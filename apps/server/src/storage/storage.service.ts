import { Inject, Injectable, Logger } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "@/config/env.module";
import type { Env } from "@/config/env";
import * as path from "node:path";
import * as crypto from "node:crypto";

export const SAFYR_BUCKET = "safyr";

export const AVATAR_URL_TTL_SECONDS = 60 * 60; // 1h
export const DOCUMENT_DOWNLOAD_TTL_SECONDS = 5 * 60; // 5min

export const STORAGE_PREFIX_DOCUMENTS = "documents";
export const STORAGE_PREFIX_AVATARS = "avatars";

export type ObjectMetadata = {
  uploaderId: string;
  entityType: "document" | "avatar";
  entityId?: string;
  originalName: string;
  mimeType: string;
};

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: SupabaseClient;

  constructor(@Inject(ENV) private readonly env: Env) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      this.logger.warn(
        "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. Storage operations will fail.",
      );
      // We initialize with dummy values to avoid crash on startup, but log warning
      this.client = createClient(
        env.SUPABASE_URL || "http://localhost:54321",
        env.SUPABASE_SERVICE_ROLE_KEY || "dummy",
        {
          auth: { persistSession: false, autoRefreshToken: false },
        },
      );
    } else {
      this.client = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: { persistSession: false, autoRefreshToken: false },
        },
      );
    }
  }

  buildStorageKey(prefix: string, originalName: string): string {
    const ext = path.extname(originalName).toLowerCase();
    const id = crypto.randomUUID();
    return `${prefix}/${id}${ext}`;
  }

  async uploadObject(
    bucket: string,
    key: string,
    body: Buffer,
    opts: { contentType: string; metadata: ObjectMetadata },
  ): Promise<void> {
    const { error } = await this.client.storage.from(bucket).upload(key, body, {
      contentType: opts.contentType,
      cacheControl: "3600",
      upsert: false,
      metadata: opts.metadata as unknown as Record<string, string>,
    });

    if (error) {
      this.logger.error(
        `Supabase upload failed (${bucket}/${key}): ${error.message}`,
      );
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async createSignedUrl(
    bucket: string,
    key: string,
    ttlSeconds: number,
    options?: { download?: string },
  ): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(key, ttlSeconds, {
        download: options?.download,
      });

    if (error || !data) {
      this.logger.error(
        `Supabase signed URL failed (${bucket}/${key}): ${error?.message ?? "no data"}`,
      );
      throw new Error(
        `Failed to generate signed URL: ${error?.message ?? "no data"}`,
      );
    }

    return data.signedUrl;
  }

  async downloadObject(bucket: string, key: string): Promise<Buffer> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .download(key);

    if (error || !data) {
      this.logger.error(
        `Supabase download failed (${bucket}/${key}): ${error?.message ?? "no data"}`,
      );
      throw new Error(`Download failed: ${error?.message ?? "no data"}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async deleteObject(bucket: string, key: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove([key]);

    if (error) {
      this.logger.error(
        `Supabase delete failed (${bucket}/${key}): ${error.message}`,
      );
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  async deleteObjectSafe(bucket: string, key: string): Promise<void> {
    try {
      await this.deleteObject(bucket, key);
    } catch {
      this.logger.warn(`Best-effort delete failed for ${bucket}/${key}`);
    }
  }

  async checkConnection(): Promise<{ status: "up" | "down"; error?: string }> {
    if (!this.env.SUPABASE_URL || !this.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { status: "down", error: "Supabase credentials not configured" };
    }

    try {
      const { error } = await this.client.storage.listBuckets();
      if (error) throw error;
      return { status: "up" };
    } catch (error: unknown) {
      return {
        status: "down",
        error:
          error instanceof Error
            ? error.message
            : "Unknown storage connection error",
      };
    }
  }
}
