import { VideoFormat, videoFormats, aspectRatios } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import AspectRatioIndicator from "./aspect-ratio-indicator";

interface FormatSelectorProps {
  selectedFormat: VideoFormat;
  onFormatChange: (format: VideoFormat) => void;
  selectedAspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
}

const formatLabels = {
  feed: "Feed",
  reelsStories: "Reels",
  igtv: "IGTV"
};

const formatSpecs = {
  feed: "60s, 250MB",
  reelsStories: "90s, 4GB",
  igtv: "60min, 3.6GB"
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
    onAspectRatioChange(aspectRatios[format][0]);
  };

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h3 className="text-lg font-medium mb-4">1. Select Format</h3>
        <Tabs value={selectedFormat} onValueChange={handleFormatChange}>
          <TabsList className="grid w-full grid-cols-3 h-9">
            {Object.keys(videoFormats).map((format) => (
              <TabsTrigger 
                key={format} 
                value={format}
                className="text-xs px-2 py-1"
              >
                {formatLabels[format as VideoFormat]}
              </TabsTrigger>
            ))}
          </TabsList>
          <p className="text-xs text-muted-foreground mt-2">
            {formatSpecs[selectedFormat]}
          </p>
        </Tabs>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">2. Select Aspect Ratio</h3>
        <RadioGroup
          value={selectedAspectRatio}
          onValueChange={onAspectRatioChange}
          className="grid grid-cols-3 gap-4 place-items-center"
        >
          {aspectRatios[selectedFormat].map((ratio) => (
            <div key={ratio} className="flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <AspectRatioIndicator ratio={ratio} />
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ratio} id={ratio} />
                <Label htmlFor={ratio} className="text-sm">{ratio}</Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}