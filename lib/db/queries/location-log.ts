import type { InsertLocationLogType } from "../schema";

import db from "..";
import { locationLog } from "../schema";

export async function insertLocationLog(locationId: number, insertable: InsertLocationLogType, userId: number) {
  const [inserted] = await db.insert(locationLog).values({
    ...insertable,
    userId,
    locationId,
  }).returning();

  return inserted;
}
