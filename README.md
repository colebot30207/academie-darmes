# Académie d'Armes website

Single-page site for Académie d'Armes, a fencing academy in Lambertville, NJ.
Plain HTML/CSS/vanilla JS. No framework, no build step. Hosted on Netlify; pushing to `main` deploys.

```
index.html            the whole page
css/styles.css        all styles (color tokens at the top)
js/config.js          settings: Web3Forms access key lives here
js/main.js            mobile menu, "Coming soon" doc check, contact form
assets/docs/          PDFs linked from the Classes & Membership buttons
assets/img/           optimized WebP images used by the site
assets/logo/          original logos + transparent PNG versions
assets/photos/        original photos as received (not loaded by the page)
assets/fonts/         self-hosted Cormorant Garamond + Inter (latin subset)
netlify.toml          headers, www→apex redirect, missing-doc rewrite
```

## Swap or add a document

The four buttons in **Classes & Membership** point to these exact filenames:

| Button          | File                              |
|-----------------|-----------------------------------|
| Class Schedule  | `assets/docs/schedule.pdf`        |
| Private Lessons | `assets/docs/private-lessons.pdf` |
| Pricing         | `assets/docs/pricing.pdf`         |
| Membership Form | `assets/docs/membership-form.pdf` |

1. Save the new PDF into `assets/docs/` with the matching filename (overwrite the old one to update it).
2. Commit and push. The button goes live automatically. Any file that isn't there shows **Coming soon**.

Docs are served with `max-age=0`, so updated PDFs show up right away.

## Edit a coach card

Coach cards are in `index.html` under `<!-- COACHES -->`. Each coach is one `<article class="coach">`.

- **Name / bio:** replace the `<span class="ph">[PLACEHOLDER: …]</span>` with plain text.
- **Add a photo to a card that only has initials:**
  1. Export a portrait photo (about 616px wide, 4:5) as WebP into `assets/img/`.
  2. Replace `<div class="coach-mono" aria-hidden="true">DG</div>` with
     `<div class="coach-photo"><img src="assets/img/NAME.webp" width="616" height="890" loading="lazy" alt="Coach portrait"></div>`.
- **Headshot note:** the current headshot is unconfirmed and sits on Jon's card (see the `TODO(Cole)` comment).
  If it's Jacob, move the `<img>` into Jacob's `.coach-photo` and remove `coach-photo--empty` there.
- Don't caption any group photo with a coach's name.

## Contact form (Web3Forms)

- The key lives in **`js/config.js`** → `web3formsAccessKey`.
- Web3Forms sends every submission to the email the key was created with. The current key is a temporary one
  on Cole's account. When Information@academiedarmes.com can receive mail, create a new key with that address
  at app.web3forms.com and swap it in.
- Until a key is set, the form validates and then shows a "not connected yet" message with the phone and email.
- Spam protection: hidden `botcheck` honeypot, plus Web3Forms' own filtering.

## Placeholders

Anything still missing shows on the page as a dashed `[PLACEHOLDER: …]` tag. To find them all:

```bash
grep -n "PLACEHOLDER" index.html
```

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Locally, missing PDFs log a 404 in the console. On Netlify they're
rewritten to a small placeholder (see `netlify.toml`), so the live site stays clean.
