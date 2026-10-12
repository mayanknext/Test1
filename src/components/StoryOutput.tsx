import { useEffect, useRef, useState } from "react";
import { Orb } from "@/components/vibe";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Copy, Download, Loader2, Volume2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { copyText, isNative, saveFile } from "@/lib/native";

interface StoryOutputProps {
  story: string;
  isLoading: boolean;
  title?: string;
  onSave?: (content: string) => Promise<void> | void;
  saveLabel?: string;
}

export const StoryOutput = ({ story, isLoading, title, onSave, saveLabel }: StoryOutputProps) => {
  const [editedStory, setEditedStory] = useState(story);
  const [audioLoading, setAudioLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const audioUrlRef = useRef<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setEditedStory(story);
  }, [story]);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  const handleCopy = async () => {
    await copyText(editedStory);
    toast({
      title: "Copied to clipboard",
      description: "Your story has been copied successfully.",
    });
  };

  const handleDownload = async () => {
    try {
      await saveFile(new Blob([editedStory], { type: "text/plain" }), "story.txt");
      if (!isNative) {
        toast({
          title: "Downloaded",
          description: "Your story has been downloaded successfully.",
        });
      }
    } catch (error) {
      // Dismissing the native share sheet rejects; that isn't an error worth showing.
      if (!isNative) throw error;
    }
  };

  const handleAudio = async () => {
    setAudioLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: editedStory }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Narration failed");
      }

      const blob = await response.blob();

      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = URL.createObjectURL(blob);
      new Audio(audioUrlRef.current).play().catch(() => {});

      toast({
        title: "Narration ready",
        description: isNative
          ? "Your narration is playing. Choose where to save the MP3."
          : "Your MP3 has been downloaded and is playing now.",
      });

      await saveFile(blob, "story.mp3").catch(() => {});
    } catch (error) {
      toast({
        title: "Couldn't create narration",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setAudioLoading(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(editedStory);
    } finally {
      setSaving(false);
    }
  };

  const disabled = isLoading || !editedStory;

  return (
    <div className="space-y-4 flex-1 min-w-0" aria-busy={isLoading}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-vb-line">
        <h3 className="text-sm font-medium min-w-0 break-words">{title || "Story draft"}</h3>
        <div className="flex flex-wrap items-center gap-1">
          {onSave && <Button variant="secondary" size="sm" onClick={handleSave} disabled={disabled || saving}>{saving ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <Save />}{saveLabel || "Save"}</Button>}
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Copy story" onClick={handleCopy} disabled={disabled}><Copy /></Button></TooltipTrigger><TooltipContent>Copy story</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Download text" onClick={handleDownload} disabled={disabled}><Download /></Button></TooltipTrigger><TooltipContent>Download text</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Export MP3" onClick={handleAudio} disabled={disabled || audioLoading}>{audioLoading ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <Volume2 />}</Button></TooltipTrigger><TooltipContent>Export MP3</TooltipContent></Tooltip>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-vb-bg rounded-lg">
            <div className="text-center space-y-4">
              <Orb state="thinking" className="mx-auto" />
              <p className="text-sm text-muted-foreground">
                Writing your story…
              </p>
            </div>
          </div>
        ) : (
          <textarea
            aria-label="Story editor"
            value={editedStory}
            onChange={(e) => setEditedStory(e.target.value)}
            placeholder="Your generated story will appear here..."
            className="w-full min-h-[480px] p-4 rounded-xl border border-vb-line-strong bg-vb-bg resize-y text-base leading-7"
          />
        )}
      </div>
      {!isLoading && <p className="mono-12 text-vb-ink-tertiary">{editedStory.trim() ? editedStory.trim().split(/\s+/).length : 0} words</p>}
    </div>
  );
};
