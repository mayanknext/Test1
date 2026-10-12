import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--gradient-bg)] -z-10" />
      <div className="absolute inset-0 bg-[var(--gradient-subtle)] opacity-50 -z-10" />

      <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
          <Sparkles className="w-4 h-4" />
          AI-Powered Story Generation
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
          Turn your raw data into<br />stories that inspire the world
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Upload any document, dataset, or text and watch AI transform it into an engaging narrative perfect for YouTube, podcasts, blogs, and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            className="text-lg px-8 py-6 shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-large)] transition-all bg-gradient-primary"
            onClick={onGetStarted}
          >
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-2"
          >
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
