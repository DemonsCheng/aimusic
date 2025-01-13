"use client";

import { cn } from "@/lib/utils";
import { UploadCloud, X, Music } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
  onFileSelect?: (file: File | null) => void;
  value?: File | null;
}

export function FileUpload({
  className,
  error,
  onFileSelect,
  value,
  ...props
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("audio/")) {
        onFileSelect?.(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect?.(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileSelect?.(null);
  };

  if (value) {
    return (
      <div className="relative w-full p-4 rounded-lg border-2 border-muted-foreground/25 bg-muted/50">
        <div className="flex items-center gap-3">
          <Music className="h-8 w-8 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {(value.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors duration-200",
        dragActive && "border-primary bg-primary/10",
        error && "border-destructive",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        {...props}
        ref={inputRef}
        className="hidden"
        type="file"
        accept="audio/*"
        onChange={handleChange}
      />
      <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground mb-1">
        Drag and drop your audio file here or click to select
      </p>
      <p className="text-xs text-muted-foreground">
        Supported formats: MP3, WAV (max 10MB)
      </p>
    </div>
  );
}
