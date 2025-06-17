import { and, eq } from "drizzle-orm";

import db from "..";
import { locationLogImage } from "../schema";

export async function insertLocationLogImage(locationLogId: number, insertable: any, userId: number) {
  const [inserted] = await db.insert(locationLogImage).values({
    ...insertable,
    userId,
    locationLogId,
    name: "image",
  }).returning();

  return inserted;
}

export async function deleteLocationLogImage(imageId: number, userId: number) {
  const [deleted] = await db.delete(locationLogImage).where(
    and(
      eq(locationLogImage.id, imageId),
      eq(locationLogImage.userId, userId),
    ),
  ).returning();

  return deleted;
}
