import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ResizeImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  imageFile: File | null;
  targetType: "landscape" | "square" | "portrait" | "logos";
}

const dimensionSpecs = {
  landscape: { width: 1200, height: 628, label: "Landscape (1200×628px)" },
  square: { width: 1200, height: 1200, label: "Square (1200×1200px)" },
  portrait: { width: 960, height: 1200, label: "Portrait (960×1200px)" },
  logos: { width: 1200, height: 1200, label: "Logo Square (1200×1200px)" },
};

export const ResizeImageModal = ({ isOpen, onClose, onSave, imageFile, targetType }: ResizeImageModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const specs = dimensionSpecs[targetType];

  useEffect(() => {
    if (!imageFile) return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      // Calculate initial scale to fit image
      const scaleX = specs.width / img.width;
      const scaleY = specs.height / img.height;
      const initialScale = Math.max(scaleX, scaleY);
      setScale(initialScale);
      // Center the image
      setPosition({
        x: (specs.width - img.width * initialScale) / 2,
        y: (specs.height - img.height * initialScale) / 2,
      });
    };
    img.src = URL.createObjectURL(imageFile);

    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [imageFile, specs.width, specs.height]);

  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to target dimensions
    canvas.width = specs.width;
    canvas.height = specs.height;

    // Clear canvas
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, specs.width, specs.height);

    // Draw image
    ctx.drawImage(
      image,
      position.x,
      position.y,
      image.width * scale,
      image.height * scale
    );

    // Draw dimension overlay
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, specs.width, specs.height);

    // Draw dimension labels
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`${specs.width}×${specs.height}px`, 10, 25);
  }, [image, scale, position, specs.width, specs.height]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.nativeEvent.offsetX - position.x,
      y: e.nativeEvent.offsetY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.nativeEvent.offsetX - dragStart.x,
      y: e.nativeEvent.offsetY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], imageFile?.name || "resized-image.png", {
        type: "image/png",
      });
      onSave(file);
      onClose();
    }, "image/png");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Resize Image - {specs.label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border-2 border-border cursor-move"
              style={{ maxWidth: "100%", height: "auto" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          <div className="space-y-2">
            <Label>Zoom: {Math.round(scale * 100)}%</Label>
            <Slider
              value={[scale]}
              onValueChange={([value]) => setScale(value)}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Drag the image to reposition. Use the slider to zoom in/out.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Resized Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
