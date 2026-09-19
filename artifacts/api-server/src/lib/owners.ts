import { clerkClient } from "@clerk/express";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db, usersTable, type User } from "@workspace/db";
import type { Request } from "express";

export function getPublicUrl(req: Request, publicToken: string): string {
  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || req.protocol;
  return `${protocol}://${req.get("host")}/feedback/${publicToken}`;
}

export async function ensureOwner(
  req: Request,
  userId: string,
): Promise<User> {
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (existing) {
    return existing;
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("Authenticated user has no email address");
  }

  const candidate = {
    id: userId,
    email,
    publicToken: randomUUID(),
  };
  await db.insert(usersTable).values(candidate).onConflictDoNothing();

  const [created] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!created) {
    throw new Error("Unable to create local owner");
  }
  return created;
}