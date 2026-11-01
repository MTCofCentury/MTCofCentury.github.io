const portrait = document.querySelector('#portrait');
const input = document.querySelector('#photo-input');
const status = document.querySelector('#photo-status');
let previewURL;
const savedPortrait = 'assets/portrait.jpg';
const fallbackPortrait = 'assets/portrait.svg';
function loadPublishedPortrait() {
  portrait.onerror = () => { portrait.onerror = null; portrait.src = fallbackPortrait; portrait.alt = 'Illustrated placeholder for Tiancheng Ma’s portrait'; };
  portrait.alt = 'Tiancheng Ma';
  portrait.src = savedPortrait;
}
loadPublishedPortrait();
input.addEventListener('change', () => {
  const file = input.files[0];
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
    status.textContent = 'Please choose a JPG, PNG, or WebP image smaller than 10 MB.';
    input.value = ''; return;
  }
  if (previewURL) URL.revokeObjectURL(previewURL);
  previewURL = URL.createObjectURL(file);
  portrait.onerror = () => { status.textContent = 'This image could not be opened. Please try another photo.'; loadPublishedPortrait(); };
  portrait.src = previewURL;
  portrait.alt = 'Local preview of your selected portrait';
  status.textContent = 'Preview ready. This photo has not been uploaded or published.';
});
document.querySelector('#reset-photo').addEventListener('click', () => {
  if (previewURL) URL.revokeObjectURL(previewURL);
  previewURL = undefined; input.value = ''; loadPublishedPortrait(); status.textContent = 'Local preview cleared.';
});
document.querySelector('#vote').addEventListener('click', event => {
  const button = event.currentTarget;
  const supported = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(supported));
  button.innerHTML = supported ? 'Danke für den Rückenwind! <span>✓</span>' : 'Vote for me* <span>↗</span>';
  document.querySelector('#vote-status').textContent = supported ? 'Encouragement received. Next campaign milestone: German grammar. Nothing is saved or counted.' : '*A little encouragement, not an actual election. No votes are collected.';
});
document.querySelector('#year').textContent = new Date().getFullYear();
