import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";
import { locationLog } from "./location-log";

export const locationLogImage = sqliteTable("locationLogImage", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  key: text().notNull(),
  locationLogId: int().notNull().references(() => locationLog.id),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogImageRelations = relations(locationLogImage, ({ one }) => {
  return {
    locationLog: one(locationLog, {
      fields: [locationLogImage.locationLogId],
      references: [locationLog.id],
    }),
  };
});

export const InsertLocationLogImage = createInsertSchema(locationLogImage, {
  key: field => field.regex(/^\d+\/\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid key"),

}).omit({
  id: true,
  name: true,
  locationLogId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
// @ts-expect-error nzm
export type InsertlocationLogImageType = z.infer<typeof InsertLocationLogImage>;
export type SelectLocationLogImage = typeof locationLogImage.$inferSelect;
