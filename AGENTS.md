# Architecture rules
- Adapt the shared Vibe foundation to the existing Tailwind v3 configuration; keep React, routing, and connected services unchanged because this is a presentation-only adoption.
- Keep shared Vibe presentation primitives in `src/components/vibe` and semantic tokens in the global stylesheet so all app pages share themes and accessibility behaviors.
