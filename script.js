const portrait = document.querySelector('#portrait');
const savedPortrait = 'assets/portrait.jpg';
const fallbackPortrait = 'assets/portrait.svg';
function loadPublishedPortrait() {
  portrait.onerror = () => { portrait.onerror = null; portrait.src = fallbackPortrait; portrait.alt = (document.documentElement.lang === 'zh-CN' ? '马天成的头像占位插画' : 'Illustrated placeholder for Tiancheng Ma’s portrait'); };
  portrait.alt = (document.documentElement.lang === 'zh-CN' ? '马天成' : 'Tiancheng Ma');
  portrait.src = savedPortrait;
}
loadPublishedPortrait();
