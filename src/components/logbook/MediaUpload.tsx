"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, Mic, X } from "lucide-react";

interface MediaUploadProps {
  type: "photo" | "video" | "voice";
  onUpload: (files: File[]) => void;
  files: File[];
  onRemove: (index: number) => void;
}

// Define icons outside component to avoid creating during render
const typeIcons = {
  photo: Camera,
  video: Video,
  voice: Mic,
} as const;

export function MediaUpload({
  type,
  onUpload,
  files,
  onRemove,
}: MediaUploadProps) {
  const [isRecording, setIsRecording] = useState(false);

  const Icon = useMemo(() => typeIcons[type], [type]);

  const getLabel = () => {
    switch (type) {
      case "photo":
        return "Ajouter photos";
      case "video":
        return "Ajouter vidéos";
      case "voice":
        return "Note vocale";
    }
  };

  const getAccept = () => {
    switch (type) {
      case "photo":
        return "image/*";
      case "video":
        return "video/*";
      case "voice":
        return "audio/*";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onUpload(selectedFiles);
  };

  const handleVoiceRecord = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      const mockFile = new File([""], `voice-note-${Date.now()}.mp3`, {
        type: "audio/mp3",
      });
      onUpload([mockFile]);
      setIsRecording(false);
    }, 3000);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        {type === "voice" ? (
          <Button
            type="button"
            variant="outline"
            className="h-24 w-full flex flex-col gap-2"
            onClick={handleVoiceRecord}
            disabled={isRecording}
          >
            <Icon
              className={`h-6 w-6 ${isRecording ? "text-red-500 animate-pulse" : ""}`}
            />
            <span className="text-sm">
              {isRecording ? "Enregistrement..." : getLabel()}
            </span>
          </Button>
        ) : (
          <>
            <input
              type="file"
              id={`${type}-upload`}
              className="hidden"
              accept={getAccept()}
              multiple={true}
              onChange={handleFileChange}
            />
            <label htmlFor={`${type}-upload`}>
              <Button
                type="button"
                variant="outline"
                className="h-24 w-full flex flex-col gap-2 cursor-pointer"
                asChild
              >
                <div>
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{getLabel()}</span>
                </div>
              </Button>
            </label>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-sm truncate">{file.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {(file.size / 1024).toFixed(1)} KB
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

