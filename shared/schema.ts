import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videoFormats = {
  feed: "feed",
  reelsStories: "reelsStories", 
  igtv: "igtv"
} as const;

export type VideoFormat = keyof typeof videoFormats;

export const aspectRatios = {
  feed: ["1:1", "4:5", "9:16"],
  reelsStories: ["9:16"],
  igtv: ["9:16", "16:9"]
} as const;

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  format: text("format", { enum: Object.values(videoFormats) }).notNull(),
  aspectRatio: text("aspect_ratio").notNull(),
  originalSize: integer("original_size").notNull(),
  estimatedSize: integer("estimated_size").notNull(),
  metadata: jsonb("metadata").notNull()
});

export const insertVideoSchema = createInsertSchema(videos);
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
