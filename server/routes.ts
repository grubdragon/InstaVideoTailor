import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema } from "@shared/schema";
import multer from "multer";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

// Configure multer for temporary file storage
const upload = multer({ dest: "uploads/" });

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

  // New route for video processing
  app.post("/api/process-video", upload.single("video"), async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No video file provided" });
      return;
    }

    const { format, aspectRatio, cropX, cropY } = req.body;
    const inputPath = req.file.path;
    const outputPath = `${inputPath}_processed.mp4`;
    const [width, height] = aspectRatio.split(":").map(Number);

    try {
      // Get video dimensions
      const ffprobe = spawn("ffprobe", [
        "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height",
        "-of", "csv=p=0",
        inputPath
      ]);

      let dimensions = "";
      ffprobe.stdout.on("data", (data) => {
        dimensions += data.toString();
      });

      await new Promise((resolve, reject) => {
        ffprobe.on("close", (code) => {
          if (code === 0) resolve(null);
          else reject(new Error("Failed to get video dimensions"));
        });
      });

      const [videoWidth, videoHeight] = dimensions.trim().split(",").map(Number);
      const scale = Math.min(1920 / videoWidth, 1080 / videoHeight, 1);
      const targetWidth = Math.round(videoWidth * scale);
      const targetHeight = Math.round(videoHeight * scale);

      // Calculate crop dimensions
      const aspectRatioValue = width / height;
      const cropWidth = Math.round(targetHeight * aspectRatioValue);
      const cropHeight = targetHeight;

      const cropOffsetX = Math.round((targetWidth - cropWidth) * (parseInt(cropX) / 100));
      const cropOffsetY = Math.round((targetHeight - cropHeight) * (parseInt(cropY) / 100));

      // Process video with ffmpeg
      const ffmpeg = spawn("ffmpeg", [
        "-i", inputPath,
        "-vf", `scale=${targetWidth}:${targetHeight},crop=${cropWidth}:${cropHeight}:${cropOffsetX}:${cropOffsetY}`,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        outputPath
      ]);

      await new Promise((resolve, reject) => {
        ffmpeg.on("close", (code) => {
          if (code === 0) resolve(null);
          else reject(new Error("Failed to process video"));
        });
      });

      // Send the processed video
      res.download(outputPath, `processed_${req.file.originalname}`, async () => {
        // Cleanup temporary files
        await Promise.all([
          fs.unlink(inputPath).catch(() => {}),
          fs.unlink(outputPath).catch(() => {})
        ]);
      });
    } catch (error) {
      console.error("Video processing error:", error);
      res.status(500).json({ error: "Failed to process video" });
      // Cleanup on error
      await fs.unlink(inputPath).catch(() => {});
    }
  });

  return createServer(app);
}