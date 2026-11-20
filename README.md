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

Coach cards are in `index.html` under `<!-- COACHES -->`, one `<article class="coach">` per coach, in display order.
Each card has a name (`h3`), a role line (`.coach-role`) and a lessons line (`.coach-lessons`).

**Adding a coach photo is a one-line swap.**

1. Crop the photo to portrait 4:5 and save it as WebP, about 600×750, in `assets/img/`,
   e.g. `assets/img/coach-mike-griffin-600.webp`.
2. In that coach's card, replace the initials line
   `<div class="coach-pic coach-pic--initials" aria-hidden="true">MG</div>`
   with
   `<img class="coach-pic" src="assets/img/coach-mike-griffin-600.webp" width="600" height="750" loading="lazy" decoding="async" alt="Mike Griffin">`

Photos and initials share the same 4:5 frame, so nothing else changes. Don't caption group photos with a coach's name.

## Contact form (Web3Forms)

- The key lives in **`js/config.js`** → `web3formsAccessKey`.
- Web3Forms sends every submission to the email the key was created with. The current key is a temporary one
  on Cole's account. When Information@academiedarmes.com can receive mail, create a new key with that address
  at app.web3forms.com and swap it in.
- Until a key is set, the form validates and then shows a "not connected yet" message with the phone and email.
- Spam protection: hidden `botcheck` honeypot, plus Web3Forms' own filtering.

## Email

The domain has no mailbox yet, so the site shows no email address (contact section, footer and JSON-LD).
When email is set up, add it back in those three places and swap the Web3Forms key (see above).

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Locally, missing PDFs log a 404 in the console. On Netlify they're
rewritten to a small placeholder (see `netlify.toml`), so the live site stays clean.
