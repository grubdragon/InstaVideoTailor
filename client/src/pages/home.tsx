import { Card, CardContent } from "@/components/ui/card";
import VideoUpload from "@/components/video-upload";
import FormatSelector from "@/components/format-selector";
import VideoPreview from "@/components/video-preview";
import { useState } from "react";
import { VideoFormat } from "@shared/schema";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat>("feed");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("1:1");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Instagram Video Optimizer
          </h1>
          <p className="text-muted-foreground mt-2">
            Optimize your videos for Instagram's format requirements
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <VideoUpload 
              onFileSelected={setSelectedFile}
              selectedFile={selectedFile}
            />
            
            <FormatSelector
              selectedFormat={selectedFormat}
              onFormatChange={setSelectedFormat}
              selectedAspectRatio={selectedAspectRatio}
              onAspectRatioChange={setSelectedAspectRatio}
            />
          </Card>

          <Card className="p-6">
            <VideoPreview
              file={selectedFile}
              format={selectedFormat}
              aspectRatio={selectedAspectRatio}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
