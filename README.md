# StoryFlow AI

Turns documents, datasets and notes into stories, scripts and narration. It was built in
[Lovable](https://lovable.dev/projects/fbf4b49c-36d9-4773-807a-93b775b19657) and ships as a web app plus native
Android and iOS apps through [Capacitor](https://capacitorjs.com).

**Releasing to Google Play / the App Store: see [MOBILE_RELEASE.md](MOBILE_RELEASE.md).**

## Stack

Vite, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase (Lovable Cloud) for auth, database and edge
functions, and Capacitor 8 for the native shells.

## Develop

```sh
npm install
npm run dev           # web app on http://localhost:8080
npm run typecheck
npm run cap:sync      # build and copy the web app into android/ and ios/
```

Supabase edge functions live in `supabase/functions` and migrations in `supabase/migrations`.

Not copied from Lovable: the shadcn/ui components the app doesn't import, `bun.lockb`, `public/favicon.ico` and
`public/placeholder.svg`. Re-add any of the components with `npx shadcn@latest add <name>`.
