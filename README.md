# The Build Plate

A one-page site that links out to [MakerWorld](https://makerworld.com/en/@BambuLab), Printables, and Thingiverse,
then lets a visitor send you a print order: the link to the model, up to 4 filament colors,
their contact info, delivery/pickup location, and any specs.

No build step, no dependencies — it's a static HTML/CSS/JS site.

## Run it locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy with GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save — your site will be live at `https://<username>.github.io/<repo-name>/` within a minute or two.

## Structure

```
.
├── index.html      # page content and structure
├── styles.css       # all styling (warm "print bed" theme)
├── script.js        # color picker logic + order form
└── README.md
```

## Before you deploy: set your email

Open `script.js` and set this to the address that should receive orders:

```js
const OWNER_EMAIL = "your-email@example.com";
```

Until that's set, the form tells visitors it isn't wired up yet instead of failing silently.

## How the order form works

GitHub Pages has no backend, so there's no database to write to. Submitting the form
opens the **visitor's own email app**, addressed to `OWNER_EMAIL`, with the print link,
chosen colors, their phone/email, location, and specs pre-filled in the body. They just
hit send.

This is deliberate: the form collects phone numbers and email addresses, and a public
GitHub issue (the pattern used for something like a "suggest a link" form) would post
that contact info in the open. `mailto:` keeps it private, landing straight in your inbox.

**Trade-off:** it requires the visitor to have an email client configured on their device.
If you'd rather collect orders through a proper form backend instead (so it works without
one), ask me and I can wire in something like Formspree or a Google Form instead.

## Notes

- This is an independent page and isn't affiliated with Bambu Lab, Printables, or Thingiverse.
- The two directory cards and the MakerWorld card link directly to the source site in a new tab.
- Filament colors are free text plus a color swatch, so visitors can type a name ("coral") or a hex code.
