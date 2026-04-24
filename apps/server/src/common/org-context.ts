import { ForbiddenException } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import type { PrismaService } from "@/prisma/prisma.service";

export async function resolveOrgId(
  req: FastifyRequest,
  prisma: PrismaService,
): Promise<string> {
  const session = req.authSession;
  if (!session) {
    throw new ForbiddenException("No active session found");
  }

  const sessionAny = session.session as { activeOrganizationId?: string };
  const activeId = sessionAny.activeOrganizationId;
  if (activeId) return activeId;

  const member = await prisma.member.findFirst({
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

export function requireUserId(req: FastifyRequest): string {
  const session = req.authSession;
  if (!session || !session.user) {
    throw new ForbiddenException("No active session found");
  }
  return session.user.id;
}
