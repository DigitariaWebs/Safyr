import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "@/auth/auth.guard";
import { OrganizationService } from "./organization.service";
import {
  UpdateOrganizationSchema,
  CreateRepresentativeSchema,
  UploadDocumentSchema,
  type UpdateOrganizationDto,
  type CreateRepresentativeDto,
} from "@safyr/schemas/organization";
import type { FastifyRequest } from "fastify";
import type { ZodType } from "zod";
import { PrismaService } from "@/prisma/prisma.service";

function parseOrThrow<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new BadRequestException({
      code: "VALIDATION_ERROR",
      message: "Invalid input",
      details: result.error.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }
  return result.data;
}

@Controller("organization")
@UseGuards(AuthGuard)
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly prisma: PrismaService,
  ) {}

  private async getOrgId(req: FastifyRequest): Promise<string> {
    const session = req.authSession;
    if (!session) {
      throw new ForbiddenException("No active session found");
    }

    const sessionAny = session.session as { activeOrganizationId?: string };
    const activeId = sessionAny.activeOrganizationId;
    if (activeId) return activeId;

    const member = await this.prisma.member.findFirst({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });

    if (!member) {
      throw new ForbiddenException(
        "User is not affiliated with any organization",
      );
    }

    return member.organizationId;
  }

  @Get()
  async getOrganization(@Req() req: FastifyRequest) {
    return this.organizationService.getOrganization(await this.getOrgId(req));
  }

  @Patch()
  async updateOrganization(@Req() req: FastifyRequest, @Body() body: unknown) {
    const data = parseOrThrow(UpdateOrganizationSchema, body);
    return this.organizationService.updateOrganization(
      await this.getOrgId(req),
      data as UpdateOrganizationDto,
    );
  }

  @Post("representative")
  async createRepresentative(
    @Req() req: FastifyRequest,
    @Body() body: unknown,
  ) {
    const data = parseOrThrow(CreateRepresentativeSchema, body);
    return this.organizationService.createRepresentative(
      await this.getOrgId(req),
      data as CreateRepresentativeDto,
    );
  }

  @Get("compliance")
  async getCompliance(@Req() req: FastifyRequest) {
    return this.organizationService.getComplianceReport(
      await this.getOrgId(req),
    );
  }

  @Post("documents")
  async uploadDocument(@Req() req: FastifyRequest) {
    const session = req.authSession;
    if (!session || !session.user) {
      throw new ForbiddenException("No active session found");
    }

    const data = await req.file();
    if (!data) {
      throw new BadRequestException("No file uploaded");
    }

    const fields = data.fields as Record<
      string,
      { value?: string } | undefined
    >;
    const payload = {
      requirementId: fields.requirementId?.value,
      expiryDate: fields.expiryDate?.value,
    };

    const parsed = parseOrThrow(UploadDocumentSchema, payload);

    const buffer = await data.toBuffer();

    return this.organizationService.createOrReplaceDocument(
      await this.getOrgId(req),
      session.user.id,
      {
        buffer,
        filename: data.filename,
        mimetype: data.mimetype,
      },
      parsed.requirementId,
      parsed.expiryDate,
    );
  }
}
