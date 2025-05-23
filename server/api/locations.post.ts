import type { DrizzleError } from "drizzle-orm";

import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const nanoid = customAlphabet("1234567890,qwertyuiopasdfghjklzxcvbnm", 5);
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }
  const result = await readValidatedBody(event, InsertLocation.safeParse);
  if (!result.success) {
    const statusMessage = result.error.issues.map((issue) => {
      return `${issue.path.join("")}: ${issue.message}`;
    }).join("; ");

    const data = result.error.issues.reduce((
      errors,
      issue,
    ) => {
      errors[issue.path.join("")] = issue.message;
      return errors;
    }, {} as Record<string, string>);
    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingLocation = await db.query.location.findFirst({
    where:
    and(
      eq(location.name, result.data.name),
      eq(location.userId, event.context.user.id),
    ),
  });
  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists.",

    }));
  }

  let slug = slugify(result.data.name);
  let existing = !!(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));
  console.log(slug);
  console.log(existing);

  while (existing) {
    const id = nanoid();
    console.log(id);
    const idSlug = `${slug}-${id}`;
    console.log(idSlug);
    existing = !!(await db.query.location.findFirst({
      where: eq(location.slug, idSlug),
    }));
    if (!existing) {
      slug = idSlug;
    }
  }
  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: event.context.user.id,
    }).returning();
    return created;
  }
  catch (e) {
    const error = e as DrizzleError;
    console.log("INverst error", error.message);
    if (error.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
      return sendError(event, createError({
        statusCode: 422,
        statusMessage: "Slug must be unique( the location name is used to generate the slug)",
      }));
    }
    throw (error);
  }
});
