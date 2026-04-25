# PrintNest

PrintNest is an AI print storefront generator for visual artists. Upload artwork, let AI write the product copy, and publish a beautiful, mobile-first print store you can share anywhere. The MVP focuses on:

- Fast onboarding (under 10 minutes from signup to live store)
- AI-generated titles, descriptions, SEO copy, captions, and price suggestions
- Public storefront with product detail pages
- WhatsApp-first checkout with structured order capture
- Artist dashboard for managing artworks and orders

## Stack

- **App:** Next.js (App Router) + TypeScript
- **UI:** Tailwind CSS
- **Data/Auth:** Supabase Postgres + Supabase Auth
- **AI:** OpenAI API
- **Storage:** Supabase Storage / Cloudinary (configurable)
- **Hosting/Ops:** Vercel, Sentry, PostHog

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill in env values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

See [.env.example](.env.example) for the full list.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (browser) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) |
| `OPENAI_API_KEY` | OpenAI key for AI copy generation |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g. `https://printnest.app`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key (optional) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (optional) |
| `SENTRY_DSN` | Sentry DSN (optional) |

## Project structure

```
src/
  app/
    (marketing)/      Landing, demo, pricing, public marketing pages
    (auth)/           Signup, login, magic link
    dashboard/        Authenticated artist dashboard
    s/[storeSlug]/    Public buyer-facing storefront
    api/              Route handlers (REST API)
  components/
    ui/               Reusable design-system primitives
    dashboard/        Dashboard-specific components
    storefront/       Public storefront components
    ai/               AI generation panels
    upload/           Artwork upload UI
  lib/                Client-safe utilities, validators
  server/             Server-only services and repositories
supabase/
  migrations/         SQL migrations for schema + RLS
```

## Database

Schema and RLS migrations live in [supabase/migrations](supabase/migrations). Apply them via the Supabase CLI (`supabase db push`) or paste them into the SQL editor.

You also need a public Storage bucket named `artwork-uploads` (used by `/api/uploads/artwork`). Create it in Supabase → Storage → New bucket → name `artwork-uploads`, public read.

## Deploying to Vercel

1. **Push to GitHub** and import the repo in Vercel. Framework preset is auto-detected (Next.js).
2. **Set environment variables** in Vercel Project Settings → Environment Variables (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` &nbsp;← must be the **service_role** key, not the anon key
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` &nbsp;← set to your Vercel URL (e.g. `https://printnest.vercel.app`)
   - Optional: `OPENAI_MODEL`, `SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
3. **Run the migrations** in Supabase (SQL Editor): `supabase/migrations/0001_init.sql` then `0002_rls.sql`.
4. **Create the `artwork-uploads` Storage bucket** (public).
5. **Configure Supabase Auth URLs**: in Supabase → Authentication → URL Configuration, add your Vercel URL as the Site URL and add `https://<your-domain>/**` to Redirect URLs.
6. Push to `main`. Vercel will run `next build` and deploy.

The build has been verified locally (`npm run build`) and produces 35 routes with 0 errors.

## Roadmap

- Phase 1: Foundation, onboarding, dashboard shell
- Phase 2: Artwork management + AI copy
- Phase 3: WhatsApp checkout + order management
- Phase 4: Themes, polish, demo data
- Phase 5: Paystack/Flutterwave/Stripe payments
- Phase 6: Print-on-demand integrations (Printful, Gelato, Printify)
