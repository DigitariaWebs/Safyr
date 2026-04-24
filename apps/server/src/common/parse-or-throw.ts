import { BadRequestException } from "@nestjs/common";
import type { ZodType } from "zod";

export function parseOrThrow<T>(schema: ZodType<T>, body: unknown): T {
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
