import { useEffect, useRef, useState } from "react";
import { VideoFormat } from "@shared/schema";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

interface VideoPreviewProps {
  file: File | null;
  format: VideoFormat;
  aspectRatio: string;
}

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps: number;
}

export default function VideoPreview({ file, format, aspectRatio }: VideoPreviewProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const getEstimatedSize = () => {
    if (!metadata) return 0;
    const bitrate = format === 'feed' ? 5000 : 10000; // kbps
    return (metadata.duration * bitrate * 1000) / (8 * 1024 * 1024); // MB
  };

  const getFinalFps = () => {
    if (!metadata?.fps) return 30; // Default to 30 if we can't detect
    // Instagram generally optimizes for 30fps
    return metadata.fps > 30 ? 30 : metadata.fps;
  };

  const [ratio1, ratio2] = aspectRatio.split(':').map(Number);
  const ratioValue = ratio1 / ratio2;

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      // Create a temporary canvas to get FPS
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let fps = 30; // Default FPS if we can't detect
      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
        const video = videoRef.current;
        let lastTime: number | null = null;
        let frames = 0;
        const callback = (now: number, metadata: any) => {
          if (lastTime === null) {
            lastTime = now;
          } else {
            frames++;
            const delta = now - lastTime;
            if (delta >= 1000) { // After 1 second
              fps = Math.round((frames * 1000) / delta);
              lastTime = null;
              frames = 0;
            }
          }
          video.requestVideoFrameCallback(callback);
        };
        video.requestVideoFrameCallback(callback);
      }

      setMetadata({
        duration: videoRef.current.duration,
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
        fps
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Preview</h2>

      {url ? (
        <>
          <AspectRatio ratio={ratioValue}>
            <video
              ref={videoRef}
              src={url}
              className="rounded-lg object-cover w-full h-full"
              onLoadedMetadata={handleLoadedMetadata}
              controls
            />
          </AspectRatio>

          {metadata && (
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Size</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <div className="text-2xl font-bold">
                      {(file!.size / (1024 * 1024)).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">MB</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Output</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <div className="text-2xl font-bold">
                      {getEstimatedSize().toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">MB</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Resolution</div>
                  <div className="mt-1 text-2xl font-bold">
                    {metadata.width}×{metadata.height}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Duration</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <div className="text-2xl font-bold">
                      {metadata.duration.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">sec</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Original FPS</div>
                  <div className="mt-1 text-2xl font-bold">
                    {metadata.fps}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Final FPS</div>
                  <div className="mt-1 text-2xl font-bold">
                    {getFinalFps()}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        <div className="border-2 border-dashed rounded-lg h-64 flex items-center justify-center text-muted-foreground">
          Upload a video to see preview
        </div>
      )}
    </div>
  );
}