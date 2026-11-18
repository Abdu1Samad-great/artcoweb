# ARTCO — Visual Production

A premium editorial portfolio for ARTCO, covering printing, signage, laser
cutting, engraving, UV printing and custom artwork.

Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, and
**GSAP + ScrollTrigger**. The site is a single, data-driven page with a
full-screen mobile menu, filterable project grid, and a validated inquiry form.

---

## Before launch: placeholder content

No real contact details, studio address, WhatsApp number, or project
photography were supplied for this build.

- **Contact details are unset.** The UI shows “Available on request” and hides
  WhatsApp/phone/map actions until the matching environment variables are
  configured.
- **Portfolio photography is placeholder imagery sourced from Unsplash.**
  Project titles and descriptions are conceptual production studies, not real
  client work. Replace them with commissioned photography and approved case
  studies before launch.
- **The site URL falls back to `https://artco.example`.** Set
  `NEXT_PUBLIC_SITE_URL` so canonical URLs, Open Graph metadata, the sitemap and
  robots.txt point at the real domain.
- **Inquiries are stored locally by default.** Configure Resend or a webhook for
  production delivery (see [Inquiry delivery](#inquiry-delivery)).

The interactions, responsive layouts and form flow are complete; the remaining
work is content and configuration.

---

## Getting started

Requirements: **Node.js 20.9+** (22 LTS recommended) and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

| Command             | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start the development server               |
| `npm run build`     | Create the optimized production build      |
| `npm run start`     | Serve the production build                 |
| `npm run typecheck` | Run TypeScript without emitting files      |

---

## Configuration

Copy `.env.example` to `.env.local` and fill in what is known. `NEXT_PUBLIC_*`
values are compiled into the browser bundle, so restart the dev server (or
rebuild) after changing them.

### Site

| Variable               | Purpose                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, e.g. `https://artco.com`. Used in metadata, JSON-LD, sitemap and robots. |

### Contact details

| Variable                        | Purpose                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_CONTACT_PHONE`     | Displayed phone number. Creates a `tel:` link.                   |
| `NEXT_PUBLIC_CONTACT_WHATSAPP`  | WhatsApp number in international format, digits only preferred. Used to build a `wa.me` link. |
| `NEXT_PUBLIC_CONTACT_EMAIL`     | Displayed email. Creates a `mailto:` link.                       |
| `NEXT_PUBLIC_CONTACT_ADDRESS`   | Studio address. Separate lines with `|`, e.g. `Studio 4|12 Example Street|City`. |
| `NEXT_PUBLIC_MAPS_URL`          | Optional Google Maps share URL. If omitted, a search link is generated from the address. |
| `NEXT_PUBLIC_MAPS_EMBED_URL`    | Optional Google Maps embed URL. If omitted, an embed is generated from the address. |

Behaviour:

- When WhatsApp is set, it becomes the primary contact action in the contact
  section and appears in the mobile menu and footer.
- Phone and email render as links when configured.
- A map appears only when an address or map URL is present.
- With no details configured, the direct-contact rows read “Available on
  request” and the primary action is the inquiry form. No invented details are
  shown.

### Inquiry delivery

| Variable                | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `RESEND_API_KEY`        | Resend API key for email delivery.                         |
| `INQUIRY_TO_EMAIL`      | Recipient address for inquiry emails.                      |
| `INQUIRY_FROM_EMAIL`    | Verified Resend sender. Defaults to Resend’s onboarding sender. |
| `INQUIRY_WEBHOOK_URL`   | Optional endpoint that receives the inquiry as JSON.       |
| `INQUIRY_WEBHOOK_TOKEN` | Optional bearer token for the webhook.                     |

The form stores every valid submission in `.data/inquiries.jsonl` (gitignored)
and can additionally deliver it by email, webhook, or both. A submission
succeeds when at least one delivery path works.

**Production note:** the local JSONL file is useful in development but is
ephemeral on serverless hosts. Configure Resend or a webhook for real
deployments. The built-in rate limit is in-memory (6 attempts per IP per 10
minutes) and resets when the process restarts; add a shared rate limiter or
CAPTCHA if the site receives abusive traffic.

To inspect local submissions:

```bash
# macOS / Linux
tail -n 20 .data/inquiries.jsonl

# Windows PowerShell
Get-Content .data/inquiries.jsonl -Tail 20
```

---

## Editing content

Content lives in `src/data/`:

- **`site.ts`** — contact env mapping, navigation, default WhatsApp message.
  Add real contact details here through the environment variables rather than
  hard-coding them in components.
- **`services.ts`** — service order, titles, descriptions, images and alt text.
- **`projects.ts`** — categories and the project grid. `category` values must
  match an entry in `categories`; `featured` and `position` are available for
  layout/crop control.

Page metadata, the JSON-LD business schema, fonts and the OG image reference are
in `src/app/layout.tsx`.

### Placing real project work

Replace images in `public/images/` using the same filenames, or update the
paths in the data files. Recommended source sizes:

| Asset                    | Path                              | Suggested ratio / size |
| ------------------------ | --------------------------------- | ---------------------- |
| Hero photograph          | `public/images/hero.jpg`          | 3:2, 2400 px wide      |
| Service thumbnails       | `public/images/services/*.jpg`     | 4:3, 1200 px wide      |
| Project cards            | `public/images/projects/*.jpg`     | 4:5 portrait, 1200–1600 px wide |
| About photograph         | `public/images/about.jpg`         | 4:5 desktop crop, 1800 px wide |
| Open Graph image         | `public/og.jpg`                   | 1200 × 630             |

Next.js optimizes and serves AVIF/WebP variants. Keep originals under roughly
2400 px on the long edge. Update the `alt` text whenever an image changes.

Project titles, descriptions and captions are intentionally generic production
studies. Replace them with approved copy once real work is available.

---

## Accessibility and motion

- Skip link, visible focus states, semantic landmarks and one `h1` per page.
- Project filters use `aria-pressed`; the result count is announced through a
  live region.
- The mobile menu traps keyboard focus, closes on Escape, locks background
  scrolling and restores focus to the toggle.
- Form labels, inline errors, `aria-invalid`, and focus management on invalid
  submission and success.
- All entrance, stagger, image-reveal, parallax and footer animations are
  skipped when `prefers-reduced-motion: reduce` is set.
- No scroll hijacking; anchor navigation uses normal scrolling with a fixed
  header offset.
- The contact and footer sections recalculate GSAP scroll positions after the
  project filter or form state changes the page height.

---

## Project structure

```text
src/
  app/
    api/inquiry/route.ts   Inquiry validation and delivery
    globals.css            Design tokens, typography, shared utilities
    layout.tsx             Fonts, metadata, JSON-LD, navbar and footer
    page.tsx               Page composition
    robots.ts / sitemap.ts
  components/
    Hero, Services, ServiceItem, Projects, ProjectCard, About, Contact,
    InquiryForm, Navbar, Footer
    ui/                    Reveal, AnimatedHeading, SectionLabel, InquiryLink, Icons
  data/
    site.ts, services.ts, projects.ts
  lib/
    gsap.ts, inquiry.ts
public/
  images/                  Local portfolio and service photography
  og.jpg
```

---

## Deployment

1. Set the environment variables in the hosting provider.
2. Run `npm run build` (or deploy to Vercel).
3. Configure Resend or a webhook so inquiries are not lost in serverless
   environments.
4. Set `NEXT_PUBLIC_SITE_URL` and verify `https://your-domain/robots.txt`,
   `/sitemap.xml`, and the Open Graph preview.
5. Replace placeholder photography and copy before announcing the site.

The project has no database dependency. The inquiry API runs on the Node.js
runtime so it can write the local JSONL fallback in development.
