import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import type { InsertLocationType } from "../schema";

import db from "..";
import { location } from "../schema";

const nanoid = customAlphabet("1234567890,qwertyuiopasdfghjklzxcvbnm", 5);

export async function findLocations(userId: number) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}
export async function findLocationByName(existing: InsertLocationType, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.name, existing.name),
      eq(location.userId, userId),
    ),
  });
}

export async function findLocationBySlug(slug: string) {
  return db.query.location.findFirst({
    where: eq(location.slug, slug),
  });
}

export async function findUniqueSlug(slug: string) {
  let existing = !!(await findLocationBySlug(slug));

  while (existing) {
    const id = nanoid();
    console.log(id);
    const idSlug = `${slug}-${id}`;
    console.log(idSlug);
    existing = !!(await findLocationBySlug(idSlug));
    if (!existing) {
      return idSlug;
    }
  }
  return slug;
}

export async function insertLocation(insertable: InsertLocationType, slug: string, userId: number) {
  const [created] = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();
  return created;
}
