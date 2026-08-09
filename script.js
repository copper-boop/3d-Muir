// ---------------------------------------------------------------
// EDIT THIS: put the email address that should receive orders.
// Submitting the form opens the visitor's email app, addressed to
// you, with the link, colors, contact info, and specs filled in.
// Contact info goes straight to your inbox — never posted publicly.
// ---------------------------------------------------------------
const OWNER_EMAIL = "your-email@example.com";

// ---------------------------------------------------------------
// Filament colors — up to 4 per print
// ---------------------------------------------------------------
const MAX_COLORS = 4;
const colorList = document.getElementById('color-list');
const addColorBtn = document.getElementById('add-color');

const defaultSwatches = ['#ff6a00', '#2f6fed', '#2c313d', '#e8e8ea'];

function colorRows() {
  return Array.from(colorList.querySelectorAll('.color-row'));
}

function refreshColorControls() {
  const rows = colorRows();
  rows.forEach((row, i) => {
    const nameInput = row.querySelector('.color-name');
    nameInput.placeholder = `Color ${i + 1}${i === 0 ? ' — e.g. coral or #ff6b4a' : ''}`;
    row.querySelector('.color-remove').hidden = rows.length <= 1;
  });
  addColorBtn.disabled = rows.length >= MAX_COLORS;
}

function addColorRow() {
  if (colorRows().length >= MAX_COLORS) return;
  const index = colorRows().length;
  const row = document.createElement('div');
  row.className = 'color-row';
  row.innerHTML = `
    <input type="color" class="color-swatch" value="${defaultSwatches[index] || '#ff6b4a'}" aria-label="Color ${index + 1} swatch">
    <input type="text" class="color-name" aria-label="Color ${index + 1} name">
    <button type="button" class="color-remove" aria-label="Remove this color">✕</button>
  `;
  colorList.appendChild(row);
  row.querySelector('.color-remove').addEventListener('click', () => {
    row.remove();
    refreshColorControls();
  });
  refreshColorControls();
}

addColorBtn.addEventListener('click', addColorRow);

colorList.querySelectorAll('.color-remove').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.closest('.color-row').remove();
    refreshColorControls();
  });
});

refreshColorControls();

function collectColors() {
  return colorRows()
    .map((row) => row.querySelector('.color-name').value.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------
// Order form — packages everything into an email to the owner
// ---------------------------------------------------------------
const form = document.getElementById('order-form');
const status = document.getElementById('order-status');

function setStatus(message, isError) {
  status.textContent = message;
  status.classList.toggle('is-error', Boolean(isError));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const link = document.getElementById('print-link').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const location = document.getElementById('print-location').value.trim();
  const specs = document.getElementById('print-specs').value.trim();
  const colors = collectColors();

  let validLink;
  try {
    validLink = new URL(link);
  } catch {
    setStatus("That print link doesn't look right — include the https://", true);
    return;
  }

  if (!phone && !email) {
    setStatus('Add a phone number or an email so we can reach you.', true);
    return;
  }

  if (!location) {
    setStatus('Add where the print should go.', true);
    return;
  }

  if (OWNER_EMAIL === "your-email@example.com") {
    setStatus('This form isn\u2019t wired up yet \u2014 the owner needs to set OWNER_EMAIL in script.js.', true);
    return;
  }

  const subject = `Print order: ${validLink.hostname}`;
  const bodyLines = [
    `Print link: ${validLink.href}`,
    `Colors: ${colors.length ? colors.join(', ') : 'not specified'}`,
    phone ? `Phone: ${phone}` : null,
    email ? `Email: ${email}` : null,
    `Location: ${location}`,
    specs ? `Specifications: ${specs}` : null,
  ].filter(Boolean).join('\n');

  const mailto = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;
  window.location.href = mailto;

  setStatus('Opening your email app \u2014 send it and we\u2019ll take it from there.', false);
});
