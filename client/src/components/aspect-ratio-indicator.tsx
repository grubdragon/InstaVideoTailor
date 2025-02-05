import { cn } from "@/lib/utils";

interface AspectRatioIndicatorProps {
  ratio: string;
  className?: string;
}

export default function AspectRatioIndicator({ ratio, className }: AspectRatioIndicatorProps) {
  const [width, height] = ratio.split(':').map(Number);
  const aspectRatio = width / height;
  
  // Use fixed width and let height adjust based on aspect ratio
  const baseWidth = 60;
  const calculatedHeight = baseWidth / aspectRatio;

  return (
    <div 
      className={cn(
        "border-2 border-primary bg-primary/10",
        className
      )}
      style={{ 
        width: `${baseWidth}px`,
        height: `${calculatedHeight}px`
      }}
    />
  );
}
