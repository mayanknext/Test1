import { useEffect, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  FileCode2,
  X,
  Circle,
  Loader2,
  CircleCheck,
  CircleAlert,
  Sun,
  Moon,
  Contrast,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export type Theme = "light" | "dark" | "contrast";
export function preferredTheme(contrast: boolean, dark: boolean): Theme {
  return contrast ? "contrast" : dark ? "dark" : "light";
}
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const contrast = window.matchMedia("(prefers-contrast: more)");
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next = preferredTheme(contrast.matches, dark.matches);
      setTheme(next);
      document.documentElement.classList.remove("dark", "contrast");
      if (next !== "light") document.documentElement.classList.add(next);
    };
    apply();
    contrast.addEventListener("change", apply);
    dark.addEventListener("change", apply);
    return () => {
      contrast.removeEventListener("change", apply);
      dark.removeEventListener("change", apply);
    };
  }, []);
  return (
    <div className="vb-theme-switch" aria-label="Theme">
      {(
        [
          { value: "light", label: "Light", icon: Sun },
          { value: "dark", label: "Dark", icon: Moon },
          { value: "contrast", label: "High contrast", icon: Contrast },
        ] as const
      ).map((item) => (
        <Button
          key={item.value}
          variant="ghost"
          size="sm"
          title={item.label}
          aria-label={item.label}
          aria-pressed={theme === item.value}
          onClick={() => {
            setTheme(item.value);
            document.documentElement.classList.remove("dark", "contrast");
            if (item.value !== "light") document.documentElement.classList.add(item.value);
          }}
        >
          <item.icon className="size-3.5" />
          <span className="theme-label">{item.label}</span>
        </Button>
      ))}
    </div>
  );
}
export function Orb({
  size = "md",
  state = "idle",
  className,
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  state?: "idle" | "thinking" | "speaking";
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`Vibe ${state}`}
      className={cn("vb-orb", `vb-orb-${size}`, className)}
      data-state={state}
    />
  );
}
export function Suggestion({
  children,
  icon,
  description,
  onClick,
}: {
  children: ReactNode;
  icon?: ReactNode;
  description?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="secondary"
      className={cn(
        description &&
          "vb-suggestion-card h-auto min-h-20 justify-start p-4 text-left whitespace-normal",
      )}
      onClick={onClick}
    >
      {icon}
      <span>
        {children}
        {description && (
          <span className="block copy-13 text-vb-ink-tertiary mt-1 font-normal">{description}</span>
        )}
      </span>
      {description && <ArrowUpRight className="ml-auto" />}
    </Button>
  );
}
export function Attachment({
  name,
  meta = "TSX · 4 KB",
  progress,
  error,
  onRemove,
}: {
  name: string;
  meta?: string;
  progress?: number;
  error?: string;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-vb-line p-3 min-w-0">
      <span className="size-10 rounded-sm bg-vb-bg-muted flex items-center justify-center shrink-0">
        <FileCode2 className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="label-14 truncate">{name}</p>
        <p className={cn("copy-13", error ? "text-vb-danger" : "text-vb-ink-tertiary")}>
          {error ?? meta}
        </p>
        {progress !== undefined && (
          <progress
            className="w-full h-1 accent-vb-cobalt"
            value={progress}
            max={100}
            aria-label={`Upload ${name}`}
          />
        )}
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${name}`}
          title="Remove file"
          onClick={onRemove}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
