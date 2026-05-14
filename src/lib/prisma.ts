/**
 * Prisma singleton — v2 only.
 *
 * v1 reads from data/mock-orders.json via the MCP mock client, so this file is
 * intentionally empty at runtime. When swapping to a real database, install
 * `@prisma/client`, run `pnpm prisma generate`, and replace the export below
 * with the standard singleton:
 *
 *   import { PrismaClient } from "@prisma/client";
 *   const g = globalThis as unknown as { prisma?: PrismaClient };
 *   export const prisma = g.prisma ?? new PrismaClient();
 *   if (process.env.NODE_ENV !== "production") g.prisma = prisma;
 */
export const prisma = null;
