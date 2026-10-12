import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "vb-bg": "hsl(var(--vb-bg) / <alpha-value>)",
        "vb-bg-subtle": "hsl(var(--vb-bg-subtle) / <alpha-value>)",
        "vb-bg-muted": "hsl(var(--vb-bg-muted) / <alpha-value>)",
        "vb-bg-emphasis": "hsl(var(--vb-bg-emphasis) / <alpha-value>)",
        "vb-surface-raised": "hsl(var(--vb-surface-raised) / <alpha-value>)",
        "vb-line": "hsl(var(--vb-line) / <alpha-value>)",
        "vb-line-strong": "hsl(var(--vb-line-strong) / <alpha-value>)",
        "vb-ink": "hsl(var(--vb-ink) / <alpha-value>)",
        "vb-ink-hover": "hsl(var(--vb-ink-hover) / <alpha-value>)",
        "vb-ink-secondary": "hsl(var(--vb-ink-secondary) / <alpha-value>)",
        "vb-ink-tertiary": "hsl(var(--vb-ink-tertiary) / <alpha-value>)",
        "vb-ink-disabled": "hsl(var(--vb-ink-disabled) / <alpha-value>)",
        "vb-ink-inverse": "hsl(var(--vb-ink-inverse) / <alpha-value>)",
        "vb-volt": "hsl(var(--vb-volt) / <alpha-value>)",
        "vb-volt-soft": "hsl(var(--vb-volt-soft) / <alpha-value>)",
        "vb-volt-text": "hsl(var(--vb-volt-text) / <alpha-value>)",
        "vb-on-volt": "hsl(var(--vb-on-volt) / <alpha-value>)",
        "vb-aqua": "hsl(var(--vb-aqua) / <alpha-value>)",
        "vb-cobalt": "hsl(var(--vb-cobalt) / <alpha-value>)",
        "vb-cobalt-soft": "hsl(var(--vb-cobalt-soft) / <alpha-value>)",
        "vb-cobalt-text": "hsl(var(--vb-cobalt-text) / <alpha-value>)",
        "vb-on-cobalt": "hsl(var(--vb-on-cobalt) / <alpha-value>)",
        "vb-link": "hsl(var(--vb-link) / <alpha-value>)",
        "vb-focus": "hsl(var(--vb-focus) / <alpha-value>)",
        "vb-success": "hsl(var(--vb-success) / <alpha-value>)",
        "vb-success-soft": "hsl(var(--vb-success-soft) / <alpha-value>)",
        "vb-warning": "hsl(var(--vb-warning) / <alpha-value>)",
        "vb-warning-soft": "hsl(var(--vb-warning-soft) / <alpha-value>)",
        "vb-danger": "hsl(var(--vb-danger) / <alpha-value>)",
        "vb-danger-soft": "hsl(var(--vb-danger-soft) / <alpha-value>)",
        "vb-on-danger": "hsl(var(--vb-on-danger) / <alpha-value>)",
        "vb-info": "hsl(var(--vb-info) / <alpha-value>)",
        "vb-info-soft": "hsl(var(--vb-info-soft) / <alpha-value>)",
        "vb-code-bg": "hsl(var(--vb-code-bg) / <alpha-value>)",
        "vb-code-ink": "hsl(var(--vb-code-ink) / <alpha-value>)",
        "vb-syntax-keyword": "hsl(var(--vb-syntax-keyword) / <alpha-value>)",
        "vb-syntax-string": "hsl(var(--vb-syntax-string) / <alpha-value>)",
        "vb-syntax-function": "hsl(var(--vb-syntax-function) / <alpha-value>)",
        "vb-syntax-number": "hsl(var(--vb-syntax-number) / <alpha-value>)",
        "vb-syntax-comment": "hsl(var(--vb-syntax-comment) / <alpha-value>)",
        "vb-syntax-tag": "hsl(var(--vb-syntax-tag) / <alpha-value>)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: { sans: ["Mona Sans Variable", "Arial", "sans-serif"], display: ["Hubot Sans Variable", "Arial", "sans-serif"], mono: ["JetBrains Mono Variable", "monospace"] },
      boxShadow: { "vb-sm": "var(--vb-shadow-sm)", "vb-md": "var(--vb-shadow-md)", "vb-focus": "var(--vb-focus-ring)" },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
