import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Video } from "lucide-react";

interface VideoUploadProps {
  onFileSelected: (file: File | null) => void;
  selectedFile: File | null;
}

export default function VideoUpload({ onFileSelected, selectedFile }: VideoUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }
    onFileSelected(file);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload Video</h2>
      
      <div className="relative">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload"
        />
        
        <label 
          htmlFor="video-upload"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        >
          {selectedFile ? (
            <div className="text-center space-y-2">
              <Video className="w-8 h-8 mx-auto text-primary" />
              <div className="text-sm">{selectedFile.name}</div>
              <div className="text-xs text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                Drop your video here or click to browse
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
