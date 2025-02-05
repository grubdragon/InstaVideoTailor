import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.post("/api/videos", async (req, res) => {
    try {
      const video = insertVideoSchema.parse(req.body);
      const created = await storage.createVideo(video);
      res.json(created);
    } catch (err) {
      res.status(400).json({ error: "Invalid video data" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const video = await storage.getVideo(id);
    if (!video) {
      res.status(404).json({ error: "Video not found" });
      return;
    }
    res.json(video);
  });

  return createServer(app);
}
