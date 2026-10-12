import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type StoryStyle = "inspirational" | "romantic" | "mystery" | "educational" | "scifi" | "documentary" | "comedy" | "historical";
export type StoryTone = "professional" | "playful" | "storyteller" | "philosophical";
export type StoryLength = "short" | "medium" | "long";
interface StoryConfiguratorProps {
  style: StoryStyle; tone: StoryTone; length: StoryLength;
  onStyleChange: (style: StoryStyle) => void;
  onToneChange: (tone: StoryTone) => void;
  onLengthChange: (length: StoryLength) => void;
}
const styles: { value: StoryStyle; label: string }[] = [
  { value: "inspirational", label: "Inspirational / Motivational" },
  { value: "romantic", label: "Romantic / Emotional" },
  { value: "mystery", label: "Mystery / Thriller" },
  { value: "educational", label: "Educational / Explainer" },
  { value: "scifi", label: "Sci-Fi / Futuristic" },
  { value: "documentary", label: "Documentary / Narration" },
  { value: "comedy", label: "Comedy / Light-hearted" },
  { value: "historical", label: "Historical / Epic" },
];
export const StoryConfigurator = ({ style, tone, length, onStyleChange, onToneChange, onLengthChange }: StoryConfiguratorProps) => <div className="space-y-5">
  <div className="space-y-2"><Label htmlFor="story-style" className="text-xs text-vb-ink-secondary">Story style</Label><Select value={style} onValueChange={(v) => onStyleChange(v as StoryStyle)}><SelectTrigger id="story-style" className="vb-control h-11 bg-vb-bg text-sm"><SelectValue /></SelectTrigger><SelectContent>{styles.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
  <div className="space-y-2"><Label htmlFor="story-tone" className="text-xs text-vb-ink-secondary">Tone & voice</Label><Select value={tone} onValueChange={(v) => onToneChange(v as StoryTone)}><SelectTrigger id="story-tone" className="vb-control h-11 bg-vb-bg"><SelectValue /></SelectTrigger><SelectContent>{(["professional", "playful", "storyteller", "philosophical"] as const).map((v) => <SelectItem key={v} value={v}><span className="capitalize">{v}</span></SelectItem>)}</SelectContent></Select></div>
  <fieldset className="space-y-2"><legend className="text-xs text-vb-ink-secondary mb-2">Story length</legend><div className="grid grid-cols-3 gap-1 bg-vb-bg-muted rounded-full p-1">{(["short", "medium", "long"] as const).map((v) => <Button key={v} variant="ghost" size="sm" aria-pressed={length === v} onClick={() => onLengthChange(v)} className={`capitalize px-2 ${length === v ? "bg-vb-bg text-vb-cobalt-text shadow-vb-sm" : "text-vb-ink-secondary"}`}>{v}</Button>)}</div><p className="mono-12 text-vb-ink-tertiary">{length === "short" ? "1–2 minutes" : length === "medium" ? "About 5 minutes" : "Chapter length"}</p></fieldset>
</div>;
