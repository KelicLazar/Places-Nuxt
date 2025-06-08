import { and, eq } from "drizzle-orm";

import type { InsertLocationLogType } from "../schema";

import db from "..";
import { locationLog } from "../schema";

export async function findLocationLog(id: number, userId: number) {
  const foundLog = await db.query.locationLog.findFirst({
    where: and(eq(locationLog.id, id), eq(locationLog.userId, userId)),
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
