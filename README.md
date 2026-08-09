# The Build Plate

A one-page directory of 3D-printable model sites — [MakerWorld](https://makerworld.com/en/@BambuLab) featured up top, plus Printables, Thingiverse, Thangs, Cults3D, and Yeggi below.

No build step, no dependencies — it's a static HTML/CSS site.

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
├── styles.css       # all styling (dark "print bed" theme)
├── script.js        # "Suggest a link" form logic
└── README.md
```

## The "Suggest a link" form — how the owner sees submissions

GitHub Pages has no backend, so there's no database to write to. Instead, submitting the
form opens a **pre-filled GitHub issue** on your repo — the visitor hits "Submit" on GitHub,
and it shows up in your repo's **Issues** tab, tagged `link-suggestion`.

**Before you deploy**, open `script.js` and set this to your actual repo:

```js
const GITHUB_REPO = "your-username/your-repo-name";
```

Until that's set, the form will tell visitors it isn't wired up yet instead of failing silently.

One trade-off: visitors need a GitHub account to submit. If you'd rather not require that,
swap the GitHub-issue link in `script.js` for a `mailto:` link or a free form service like
Formspree — ask me and I can wire either of those in instead.

## Notes

- This is an independent directory and isn't affiliated with Bambu Lab or any listed site.
- All outbound cards link directly to the source site in a new tab.
