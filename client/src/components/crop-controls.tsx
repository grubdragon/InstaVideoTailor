import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

interface CropControlsProps {
  onCropChange: (crop: { x: number; y: number }) => void;
}

export default function CropControls({ onCropChange }: CropControlsProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Center by default

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);
    onCropChange(newPosition);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Horizontal Position</label>
          <span className="text-sm text-muted-foreground">{position.x}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handlePositionChange('x', Math.max(0, position.x - 5))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Slider
            value={[position.x]}
            min={0}
            max={100}
            step={1}
            onValueChange={([value]) => handlePositionChange('x', value)}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handlePositionChange('x', Math.min(100, position.x + 5))}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Vertical Position</label>
          <span className="text-sm text-muted-foreground">{position.y}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handlePositionChange('y', Math.max(0, position.y - 5))}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Slider
            value={[position.y]}
            min={0}
            max={100}
            step={1}
            onValueChange={([value]) => handlePositionChange('y', value)}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handlePositionChange('y', Math.min(100, position.y + 5))}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
