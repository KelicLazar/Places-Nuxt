import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import type { SelectLocationLogImage } from "./location-log-image";

import { user } from "./auth";
import { location } from "./location";
import { locationLogImage } from "./location-log-image";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endeddAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: int().notNull().references(() => location.id, { onDelete: "cascade" }),
  userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),

  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
export const locationLOgRelations = relations(locationLog, ({ one, many }) => {
  return {
    location: one(location, {
      fields: [locationLog.locationId],
      references: [location.id],
    }),
    images: many(locationLogImage),
  };
});

export const InsertLocationLog = createInsertSchema(locationLog, {
  name: field => field.min(1).max(100),
  description: field => field.max(100),
  lat: field => field.min(-90).max(90),
  long: field => field.min(-180).max(180),
}).omit({
  id: true,
  userId: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
}).superRefine((values, context) => {
  if (values.startedAt > values.endeddAt || values.endeddAt < values.startedAt) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start Date must be before End Date",
      path: ["startedAt"],
    });
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End Date must be after Start Date",
      path: ["endeddAt"],
    });
  }
});
// @ts-expect-error nzm
export type InsertLocationLogType = z.infer<typeof InsertLocationLog>;
export type SelectLocationLog = typeof locationLog.$inferSelect;
export type SelectLocationLogWithImages = SelectLocationLog & {
  images: SelectLocationLogImage[];
};
