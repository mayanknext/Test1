import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { FileUpload } from "@/components/FileUpload";
import { StoryConfigurator, StoryStyle, StoryTone, StoryLength } from "@/components/StoryConfigurator";
import { StoryOutput } from "@/components/StoryOutput";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowRight, AudioLines, FileText, Check } from "lucide-react";
import { Orb } from "@/components/vibe";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState("");
  const [style, setStyle] = useState<StoryStyle>("inspirational");
  const [tone, setTone] = useState<StoryTone>("storyteller");
  const [length, setLength] = useState<StoryLength>("medium");
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    setInputFile(file);
    setInputText("");
  };

  const handleTextInput = (text: string) => {
    setInputText(text);
    setInputFile(null);
  };

  const handleSaveStory = async (content: string) => {
    if (!user) {
      toast({
        title: "Sign in to save",
        description: "Create a free account to keep your stories.",
      });
      navigate("/auth");
      return;
    }

    const firstLine = content.trim().split("\n").find((line) => line.trim().length > 0) ?? "Untitled story";
    const title = firstLine.replace(/^#+\s*/, "").slice(0, 80);

    const { error } = await supabase.from("stories").insert({
      user_id: user.id,
      title,
      content,
      style,
      tone,
      length,
    });

    if (error) {
      toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Saved to your library",
      description: "Find it any time under My Stories.",
    });
  };

  const handleGenerate = async () => {
    if (!inputFile && !inputText) {
      toast({
        title: "No input provided",
        description: "Please upload a file or paste some text first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let content = inputText;

      // If a file was uploaded, read its content
      if (inputFile) {
        const reader = new FileReader();
        content = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsText(inputFile);
        });
      }

      const GENERATE_STORY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-story`;

      const response = await fetch(GENERATE_STORY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          content,
          style,
          tone,
          length,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate story");
      }

      setStory(data.story);

      toast({
        title: "Story generated",
        description: "Your content has been transformed into an engaging narrative.",
      });
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vb-bg">
      <AppHeader />
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-10 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="space-y-3"><p className="mono-12 text-vb-ink-tertiary uppercase">Your creative workspace</p><h1 className="display-40">A new story starts here.</h1><p className="copy-15 text-vb-ink-secondary">Bring the facts. Find the feeling. Make it a story.</p></div>
          <span className="inline-flex items-center gap-2 text-xs text-vb-ink-tertiary pb-1"><AudioLines className="w-4 h-4" />StoryFlow AI</span>
        </div>
        <div className="grid xl:grid-cols-[420px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)] border-y border-vb-line">
          <section aria-label="Story source and settings" className="bg-vb-bg-subtle p-5 md:p-6 lg:border-r border-vb-line min-w-0">
            <div className="flex items-center gap-3 mb-5"><span className="mono-12 text-vb-ink-tertiary">01</span><h2 className="heading-17">Your source</h2>{(inputFile || inputText) && <Check className="w-4 h-4 text-vb-success ml-auto" aria-label="Source ready" />}</div>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onTextInput={handleTextInput}
                />
            <div className="flex items-center gap-3 mt-7 mb-5 pt-6 border-t border-vb-line"><span className="mono-12 text-vb-ink-tertiary">02</span><h2 className="heading-17">Make it yours</h2></div>
                <StoryConfigurator
                  style={style}
                  tone={tone}
                  length={length}
                  onStyleChange={setStyle}
                  onToneChange={setTone}
                  onLengthChange={setLength}
                />
            <Button onClick={handleGenerate} disabled={isLoading || (!inputFile && !inputText)} size="lg" className="w-full mt-6">{isLoading ? <Orb size="xs" state="thinking" /> : <AudioLines />}{isLoading ? "Writing your story…" : "Generate story"}<ArrowRight className="ml-auto" /></Button>
          </section>
          <section aria-label="Story draft" className="min-w-0 p-5 md:p-8 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-6"><div className="flex items-center gap-3"><span className="mono-12 text-vb-ink-tertiary">03</span><h2 className="heading-17">Your story</h2></div><span className="mono-12 text-vb-ink-tertiary">{story ? "DRAFT" : "UNTITLED"}</span></div>
            {(story || isLoading) ? <StoryOutput story={story} isLoading={isLoading} onSave={handleSaveStory} saveLabel={user ? "Save to library" : "Sign in to save"} /> : <div className="flex-1 min-h-[480px] flex items-center justify-center text-center"><div className="max-w-sm space-y-5"><div className="relative mx-auto w-28 h-32 mb-8" aria-hidden="true"><div className="absolute inset-x-4 inset-y-2 border border-vb-line bg-vb-bg-subtle rounded-md rotate-[-10deg]" /><div className="absolute inset-x-3 inset-y-2 border border-vb-line bg-vb-surface-raised shadow-vb-sm rounded-md rotate-[7deg] flex flex-col items-start p-5 gap-3"><FileText className="w-7 h-7 text-vb-ink-secondary" /><div className="w-full h-px bg-vb-line" /><div className="w-3/4 h-px bg-vb-line" /><div className="w-full h-px bg-vb-line" /></div><span className="absolute -right-2 bottom-0 w-11 h-11 rounded-full bg-vb-volt text-vb-on-volt flex items-center justify-center"><AudioLines className="w-5 h-5" /></span></div><h3 className="heading-24">The next page is yours.</h3><p className="copy-15 text-vb-ink-tertiary">Every great story starts with something real.</p><div className="flex items-center justify-center gap-2 text-xs text-vb-ink-tertiary"><span>Source</span><ArrowRight className="w-3 h-3" /><span>Perspective</span><ArrowRight className="w-3 h-3" /><span>Story</span></div></div></div>}
            <p className="copy-13 text-vb-ink-tertiary text-center mt-6">AI can make mistakes. Check important details.</p>
          </section>
        </div>
        <footer className="flex flex-wrap justify-between gap-3 pt-5 text-xs text-vb-ink-tertiary"><span>Made for the stories only you can tell.</span><span className="inline-flex items-center gap-2"><FileText className="w-3.5 h-3.5" />Documents to narratives<ArrowUpRight className="w-3.5 h-3.5" /></span></footer>
      </main>
    </div>
  );
};

export default Index;
