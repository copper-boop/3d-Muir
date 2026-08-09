// ---------------------------------------------------------------
// EDIT THIS: point it at your own GitHub repo (owner/repo-name).
// Suggestions get packaged as a pre-filled issue on THIS repo,
// so you (the owner) see every submission in your Issues tab —
// no backend, no database, no server to run.
// ---------------------------------------------------------------
const GITHUB_REPO = "your-username/your-repo-name";

// ---------------------------------------------------------------
// Filament color picker — lets a visitor type or pick any color
// for the site's accent ("filament"), applied live via a CSS
// custom property, and remembered for their next visit.
// ---------------------------------------------------------------
const FILAMENT_KEY = 'buildplate-filament-color';
const DEFAULT_FILAMENT = '#ff6b4a';

const swatchInput = document.getElementById('filament-swatch');
const textInput = document.getElementById('filament-color');
const applyBtn = document.getElementById('filament-apply');
const filamentStatus = document.getElementById('filament-status');

function isValidColor(value) {
  const probe = new Option().style;
  probe.color = '';
  probe.color = value;
  return probe.color !== '';
}

function applyFilamentColor(value, { save = true, silent = false } = {}) {
  if (!isValidColor(value)) {
    filamentStatus.textContent = `"${value}" isn\u2019t a color I recognize \u2014 try a hex code like #29c1ce or a name like teal.`;
    filamentStatus.classList.add('is-error');
    return false;
  }

  document.documentElement.style.setProperty('--accent', value);
  textInput.value = value;

  // keep the native color swatch in sync — canvas normalizes any valid
  // CSS color (name, hex, rgb...) down to a hex string the swatch accepts
  try {
    const canvas = document.createElement('canvas').getContext('2d');
    canvas.fillStyle = value;
    if (canvas.fillStyle.startsWith('#')) swatchInput.value = canvas.fillStyle;
  } catch { /* swatch sync is best-effort only */ }

  if (save) localStorage.setItem(FILAMENT_KEY, value);
  filamentStatus.classList.remove('is-error');
  if (!silent) filamentStatus.textContent = 'Filament color updated.';
  return true;
}

// restore a saved color on load, if any
const savedFilament = localStorage.getItem(FILAMENT_KEY);
if (savedFilament) applyFilamentColor(savedFilament, { save: false, silent: true });
else textInput.value = DEFAULT_FILAMENT;
swatchInput.value = savedFilament && savedFilament.startsWith('#') ? savedFilament : DEFAULT_FILAMENT;

applyBtn.addEventListener('click', () => {
  const value = textInput.value.trim();
  if (value) applyFilamentColor(value);
});

textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    applyBtn.click();
  }
});

swatchInput.addEventListener('input', () => {
  applyFilamentColor(swatchInput.value);
});

const form = document.getElementById('suggest-form');
const status = document.getElementById('suggest-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('site-name').value.trim();
  const url = document.getElementById('site-url').value.trim();
  const note = document.getElementById('site-note').value.trim();

  if (!name || !url) {
    status.textContent = 'Add a site name and a link first.';
    status.classList.add('is-error');
    return;
  }

  let validUrl;
  try {
    validUrl = new URL(url);
  } catch {
    status.textContent = "That link doesn't look right — include the https://";
    status.classList.add('is-error');
    return;
  }

  if (GITHUB_REPO === "your-username/your-repo-name") {
    status.textContent = 'This site isn\u2019t wired to a repo yet \u2014 the owner needs to set GITHUB_REPO in script.js.';
    status.classList.add('is-error');
    return;
  }

  const title = `Link suggestion: ${name}`;
  const body = [
    `**Site:** ${name}`,
    `**Link:** ${validUrl.href}`,
    note ? `**Why:** ${note}` : null,
  ].filter(Boolean).join('\n\n');

  const issueUrl =
    `https://github.com/${GITHUB_REPO}/issues/new` +
    `?title=${encodeURIComponent(title)}` +
    `&body=${encodeURIComponent(body)}` +
    `&labels=${encodeURIComponent('link-suggestion')}`;

  window.open(issueUrl, '_blank', 'noopener');

  status.classList.remove('is-error');
  status.textContent = 'Opening GitHub in a new tab \u2014 sign in and hit Submit to send it to the owner.';
  form.reset();
});
