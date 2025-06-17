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
