import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Check } from "lucide-react";

export interface StoryAngle {
  title: string;
  description: string;
  style?: string;
  audience?: string;
  tone?: string;
  recommended?: boolean;
  reason?: string;
}

export interface ContentAnalysis {
  summary?: string;
  contentType?: string;
  patterns?: string[];
  themes?: string[];
  emotion?: string;
  angles?: StoryAngle[];
}

interface ContentInsightsProps {
  analysis: ContentAnalysis;
  selectedAngle: string | null;
  onSelectAngle: (angle: StoryAngle) => void;
}

export const ContentInsights = ({ analysis, selectedAngle, onSelectAngle }: ContentInsightsProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4 shadow-[var(--shadow-medium)]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">What we found in your content</h3>
        </div>

        {analysis.summary && <p className="text-sm text-muted-foreground">{analysis.summary}</p>}

        <div className="flex flex-wrap gap-2">
          {analysis.contentType && <Badge variant="secondary">{analysis.contentType}</Badge>}
          {analysis.emotion && <Badge variant="secondary">Mood: {analysis.emotion}</Badge>}
          {analysis.themes?.map((theme) => (
            <Badge key={theme} variant="outline">
              {theme}
            </Badge>
          ))}
        </div>

        {!!analysis.patterns?.length && (
          <ul className="space-y-2">
            {analysis.patterns.map((pattern) => (
              <li key={pattern} className="flex gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {!!analysis.angles?.length && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Choose the story you want to tell</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {analysis.angles.map((angle) => {
              const active = selectedAngle === angle.title;
              return (
                <button
                  key={angle.title}
                  type="button"
                  onClick={() => onSelectAngle(angle)}
                  className={`text-left rounded-xl border p-5 transition-all hover:border-primary/60 ${
                    active ? "border-primary bg-primary/5 shadow-[var(--shadow-medium)]" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold">{angle.title}</h4>
                    {active ? (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      angle.recommended && <Badge className="shrink-0">Recommended</Badge>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">{angle.description}</p>

                  {angle.reason && (
                    <p className="mt-2 text-xs text-muted-foreground italic">Why: {angle.reason}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {angle.style && <Badge variant="outline">{angle.style}</Badge>}
                    {angle.tone && <Badge variant="outline">{angle.tone}</Badge>}
                    {angle.audience && <Badge variant="outline">{angle.audience}</Badge>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
