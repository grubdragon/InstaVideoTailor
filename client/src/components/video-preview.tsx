import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { VideoFormat } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const [ratio1, ratio2] = aspectRatio.split(':').map(Number);
  const ratioValue = ratio1 / ratio2;

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      // Create offscreen video element to get FPS
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file!);

      video.addEventListener('loadedmetadata', () => {
        if (videoRef.current) {
          setMetadata({
            duration: videoRef.current.duration,
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
            fps: 30 // Default to 30 FPS as actual FPS detection requires complex analysis
          });
        }
        URL.revokeObjectURL(video.src);
      });
    }
  };

  const handleExport = () => {
    // TODO: Implement actual video processing
    console.log("Exporting video...");
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log("Sharing video...");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleExport}
                  disabled={!file}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export optimized video</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleShare}
                  disabled={!file}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share video</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

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
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Original Size</div>
                  <div className="text-2xl font-bold">
                    {(file!.size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Estimated Output</div>
                  <div className="text-2xl font-bold">
                    {getEstimatedSize().toFixed(1)} MB
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Resolution</div>
                  <div className="text-2xl font-bold">
                    {metadata.width}x{metadata.height}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Duration</div>
                  <div className="text-2xl font-bold">
                    {metadata.duration.toFixed(1)}s
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Original FPS</div>
                  <div className="text-2xl font-bold">
                    {metadata.fps}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Target FPS</div>
                  <div className="text-2xl font-bold">
                    30
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