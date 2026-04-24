import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard } from "@/auth/auth.guard";
import {
  StorageService,
  SAFYR_BUCKET,
  STORAGE_PREFIX_DOCUMENTS,
  DOCUMENT_DOWNLOAD_TTL_SECONDS,
} from "./storage.service";
import type { FastifyRequest } from "fastify";

@Controller("storage")
@UseGuards(AuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post("upload")
  async upload(@Req() req: FastifyRequest) {
    const data = await req.file();
    if (!data) {
      throw new BadRequestException("No file uploaded");
    }

    const buffer = await data.toBuffer();
    const session = req.authSession;

    if (!session || !session.user) {
      throw new BadRequestException("User session not found");
    }

    const key = this.storageService.buildStorageKey(
      STORAGE_PREFIX_DOCUMENTS,
      data.filename,
    );

    await this.storageService.uploadObject(SAFYR_BUCKET, key, buffer, {
      contentType: data.mimetype,
      metadata: {
        uploaderId: session.user.id,
        entityType: "document",
        originalName: data.filename,
        mimeType: data.mimetype,
      },
    });

    return {
      key,
      originalName: data.filename,
      mimeType: data.mimetype,
      size: buffer.length,
    };
  }

  @Get("signed-url/*")
  async getSignedUrl(@Param("*") key: string) {
    const url = await this.storageService.createSignedUrl(
      SAFYR_BUCKET,
      key,
      DOCUMENT_DOWNLOAD_TTL_SECONDS,
    );

    return { url };
  }
}
