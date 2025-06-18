import { and, eq } from "drizzle-orm";

import type { InsertLocationLogType } from "../schema";

import db from "..";
import { locationLog } from "../schema";

export async function findLocationLog(id: number, userId: number) {
  const foundLog = await db.query.locationLog.findFirst({
    where: and(eq(locationLog.id, id), eq(locationLog.userId, userId)),
    with: {
      images: {
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
      },
    },
  });
  return foundLog;
}

export async function insertLocationLog(locationId: number, insertable: InsertLocationLogType, userId: number) {
  const [inserted] = await db.insert(locationLog).values({
    ...insertable,
    userId,
    locationId,
  }).returning();

  return inserted;
}
export async function updateLocationLog(locationLogId: number, updateable: InsertLocationLogType, userId: number) {
  const [updated] = await db.update(locationLog).set({
    ...updateable,
    userId,
  }).where(and(
    eq(locationLog.id, locationLogId),
    eq(locationLog.userId, userId),
  ),
  ).returning();

  return updated;
}

export async function deleteLocationLog(id: number, userId: number) {
  const [deleted] = await db.delete(locationLog).where(
    and(
      eq(locationLog.id, id),
      eq(locationLog.userId, userId),
    ),
  ).returning();

  return deleted;
}
