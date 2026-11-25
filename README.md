# drtooth.dental

Website for Dr. Tooth Family and Implant Dentistry (Bellevue and Mountlake Terrace, WA).
Built with [Astro](https://astro.build) and Tailwind CSS. It's a static site, deployed to GitHub Pages by
GitHub Actions on every push to `main`.

## Editing content

| What | Where |
|---|---|
| Practice name, email, form endpoint, privacy notice link | [src/data/site.ts](src/data/site.ts) (`site`) |
| Office addresses, phones, **hours** | [src/data/site.ts](src/data/site.ts) (`offices`) |
| Headline numbers and About highlights | [src/data/site.ts](src/data/site.ts) (`stats`, `highlights`) |
| Services list | [src/data/services.ts](src/data/services.ts) |
| Home page text | [src/pages/index.astro](src/pages/index.astro), [src/components/Hero.astro](src/components/Hero.astro) |
| Office pages (`/bellevue/`, `/mountlake-terrace/`) | [src/pages/[office].astro](src/pages/[office].astro) (generated from `offices`) |
| Privacy page | [src/pages/privacy.astro](src/pages/privacy.astro) |
| Hero photo | Replace [src/assets/hero.jpg](src/assets/hero.jpg) and update its `alt` in `Hero.astro` |
| Share image (link previews) | Overwrite [public/og-image.png](public/og-image.png), 1200×630 |
| Logo / icons | [src/assets/logo.png](src/assets/logo.png), then `npm run make:icons` |

Office hours are per day, in 24-hour time, `null` for closed. The site groups matching days for display
and also publishes the hours to search engines. **Keep them in sync with the Google Business Profile.**

```ts
hours: {
  Mon: ['09:00', '16:00'],
  Tue: ['09:00', '18:00'],
  // …
  Sat: null,
  Sun: null,
},
```

## Running locally

Needs **Node 22.23 or newer** (Node 24 LTS recommended).

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + build into dist/
npm run preview   # serve dist/
```

In `npm run dev` the appointment form always shows. In a production build it only shows once
`site.formEndpoint` is set; until then visitors see "Book by phone".

## Appointment form

Contact and scheduling fields only, with no free-text box. It sends to a Google Apps Script web app owned
by the practice's Google Workspace (with the HIPAA BAA accepted), which saves requests to a restricted
Sheet and emails the front desk a notice with no patient details in it. Setup:
[apps-script/README.md](apps-script/README.md).

## Launch checklist

1. **Form:** deploy the Apps Script from the practice account, set `formEndpoint`, send a test request.
2. **Repo:** merge `astro-rebuild` into `main`.
3. **Pages:** repo Settings → Pages → Source: **GitHub Actions**. Custom domain: `drtooth.dental`.
   Verify the domain under the account/org Settings → Pages (adds a TXT record) to prevent takeover.
4. **DNS in Squarespace** (check the IPs against GitHub's "Managing a custom domain" docs on the day):
   - Remove the domain forwarding to `mv-ai-code.github.io/drtooth/` and the Squarespace default A records.
   - `@` A: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `@` AAAA: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www` CNAME: `mv-ai-code.github.io`
   - **Keep the Google Workspace MX, SPF (TXT) and DKIM records**, or practice email stops working.
5. When the certificate is issued, enable **Enforce HTTPS**.
6. Check `https://drtooth.dental`, `https://www.drtooth.dental`, `/bellevue/`, `/mountlake-terrace/` and an
   unknown path (should show the 404 page).
7. Check link previews in the Facebook Sharing Debugger and LinkedIn Post Inspector.
8. Retire the two old personal-account Apps Scripts (see the apps-script README). Ask before deleting.

## Open items for the practice

Marked `VERIFY` in the code.

- **Holiday hours:** the Mountlake Terrace Google listing shows regular hours on Thanksgiving and
  Black Friday with "Hours might differ", meaning no holiday hours are set. Set them in the Google
  Business Profile.
- **Notice of Privacy Practices:** a PDF or page to link (HIPAA requires posting it on the website).
  Also have the practice review the [privacy page](src/pages/privacy.astro).
- **Claims from the old site** (softened or removed for now):
  - "15+ years" and "5,000+ patients": still shown; confirm or remove.
  - "98% success rate": **removed**.
  - "Board-certified dentists" (plural): now "Advanced training in implant and cosmetic dentistry".
  - "Evening and weekend appointments": now "Ask about appointment times that fit your schedule".
  - "Pain-free procedures": now "Modern techniques focused on comfort".
- CEREC and CBCT: available at both offices?
- Botox and lip filler: within scope of practice in WA, and offered at both offices?
- Amalgam fillings: still offered? (The site now says tooth-colored fillings.)
- Cleanings and exams aren't in the services list; should they be?
- Which mailbox receives form notices (`NOTIFY_EMAIL`).
- New photos: hero image and the final share image.
