import { VideoFormat, videoFormats, aspectRatios } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FormatSelectorProps {
  selectedFormat: VideoFormat;
  onFormatChange: (format: VideoFormat) => void;
  selectedAspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
}

const formatLabels = {
  feed: "Feed Post",
  reelsStories: "Reels & Stories",
  igtv: "IGTV"
};

const formatSpecs = {
  feed: "60 seconds, up to 250MB",
  reelsStories: "90 seconds, up to 4GB",
  igtv: "60 minutes, up to 3.6GB"
};

export default function FormatSelector({
  selectedFormat,
  onFormatChange,
  selectedAspectRatio,
  onAspectRatioChange
}: FormatSelectorProps) {
  const handleFormatChange = (value: string) => {
    const format = value as VideoFormat;
    onFormatChange(format);
    // Auto-select first aspect ratio when format changes
    onAspectRatioChange(aspectRatios[format][0]);
  };

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h3 className="text-lg font-medium mb-4">1. Select Format</h3>
        <Tabs value={selectedFormat} onValueChange={handleFormatChange}>
          <TabsList className="grid grid-cols-3 w-full">
            {Object.keys(videoFormats).map((format) => (
              <TabsTrigger key={format} value={format}>
                {formatLabels[format as VideoFormat]}
              </TabsTrigger>
            ))}
          </TabsList>
          <p className="text-sm text-muted-foreground mt-2">
            {formatSpecs[selectedFormat]}
          </p>
        </Tabs>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">2. Select Aspect Ratio</h3>
        <RadioGroup
          value={selectedAspectRatio}
          onValueChange={onAspectRatioChange}
          className="grid grid-cols-3 gap-4"
        >
          {aspectRatios[selectedFormat].map((ratio) => (
            <div key={ratio} className="flex items-center space-x-2">
              <RadioGroupItem value={ratio} id={ratio} />
              <Label htmlFor={ratio}>{ratio}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
