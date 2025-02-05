import { videos, type Video, type InsertVideo } from "@shared/schema";

export interface IStorage {
  createVideo(video: InsertVideo): Promise<Video>;
  getVideo(id: number): Promise<Video | undefined>;
}

export class MemStorage implements IStorage {
  private videos: Map<number, Video>;
  private currentId: number;

  constructor() {
    this.videos = new Map();
    this.currentId = 1;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const id = this.currentId++;
    const newVideo: Video = { ...video, id };
    this.videos.set(id, newVideo);
    return newVideo;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }
}

export const storage = new MemStorage();
