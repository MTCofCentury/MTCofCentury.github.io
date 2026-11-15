import { VOTE_API_URL } from './vote-config.js';

const button = document.querySelector('#vote');
const form = document.querySelector('#vote-form');
const name = document.querySelector('#voter-name');
const consent = document.querySelector('#vote-consent');
const submit = document.querySelector('#vote-submit');
const status = document.querySelector('#vote-status');
let busy = false;
let api;
try {
  const url = new URL(VOTE_API_URL);
  if (url.protocol === 'https:' && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash) api = url.origin;
} catch { /* Keep submissions unavailable until a backend is configured. */ }

function closeForm() {
  form.hidden = true;
  button.setAttribute('aria-expanded', 'false');
  button.focus();
}
if (!api) {
  status.textContent = (document.documentElement.lang === 'zh-CN' ? '私密鼓励暂未开放，请稍后再来。' : 'Private encouragement is not open yet. Please check back soon.');
  button.disabled = true;
}
button.addEventListener('click', () => {
  form.hidden = !form.hidden;
  button.setAttribute('aria-expanded', String(!form.hidden));
  if (!form.hidden) name.focus();
});
document.querySelector('#vote-cancel').addEventListener('click', () => {
  if (busy) return;
  closeForm();
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!api || busy || !form.reportValidity()) return;
  const nickname = name.value.trim().normalize('NFC');
  if (!nickname || Array.from(nickname).length > 60 || /[\p{Cc}\p{Cf}]/u.test(nickname)) {
    status.textContent = (document.documentElement.lang === 'zh-CN' ? '请输入 1 至 60 个字符的姓名或昵称，请勿包含隐藏的控制字符。' : 'Please enter a name or nickname of 1–60 characters, without hidden control characters.');
    name.focus(); return;
  }
  let token;
  try {
    token = localStorage.getItem('tiancheng-encouragement-id');
    if (!/^[a-f0-9]{64}$/.test(token || '')) {
      token = Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('');
      localStorage.setItem('tiancheng-encouragement-id', token);
    }
  } catch {
    status.textContent = (document.documentElement.lang === 'zh-CN' ? '请允许此网站使用浏览器存储，再送出鼓励。' : 'Please allow browser storage for this site before sending your encouragement.');
    return;
  }
  busy = true; submit.disabled = true; name.disabled = true; consent.disabled = true;
  form.setAttribute('aria-busy', 'true');
  status.textContent = (document.documentElement.lang === 'zh-CN' ? '正在保存你的鼓励……' : 'Saving your encouragement…');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${api}/votes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, token, consent: true }),
      credentials: 'omit', signal: controller.signal,
    });
    const result = await response.json();
    if (response.status === 409 && result.code === 'ALREADY_RECORDED') {
      status.textContent = (document.documentElement.lang === 'zh-CN' ? '这个浏览器已经送出过鼓励了，谢谢！' : 'Encouragement from this browser is already recorded. Danke!');
      closeForm();
    } else if (response.ok && result.saved === true) {
      status.textContent = (document.documentElement.lang === 'zh-CN' ? '谢谢！你的鼓励已保存，只有天成能看到你的名字。' : 'Danke! Your encouragement has been saved. Your name is visible only to Tiancheng.');
      form.reset(); closeForm();
    } else {
      throw new Error('Not saved');
    }
  } catch {
    status.textContent = (document.documentElement.lang === 'zh-CN' ? '暂时无法确认提交结果，请再试一次。通过此浏览器重试不会重复记录。' : 'We could not confirm your submission. Please try again; a retry from this browser will not create a second record.');
  } finally {
    clearTimeout(timeout); busy = false; submit.disabled = false; name.disabled = false; consent.disabled = false;
    form.removeAttribute('aria-busy');
  }
});
