import { VOTE_API_URL } from './vote-config.js';

const form = document.querySelector('#guestbook-form');
const zh = document.documentElement.lang === 'zh-CN';
if (form) {
  const status = document.querySelector('#guestbook-status');
  const button = form.querySelector('button');
  let endpoint;
  try { const url = new URL(VOTE_API_URL); if (url.protocol === 'https:') endpoint = `${url.origin}/messages`; } catch {}
  if (endpoint) {
    button.disabled = false;
    status.textContent = zh ? '留言仅天成可见，不会公开显示。' : 'Only Tiancheng can read your message. It will not appear publicly.';
  }
  let token = Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!endpoint || button.disabled || !form.reportValidity()) return;
    button.disabled = true;
    status.textContent = zh ? '正在寄送…' : 'Sending…';
    const fields = new FormData(form);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: fields.get('nickname').trim(), message: fields.get('message').trim(), consent: fields.has('consent'), token }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok && response.status !== 409) throw new Error('Save failed');
      form.reset();
      status.textContent = zh ? '留言已送达。谢谢你在这里留下思绪。' : 'Message received. Thank you for leaving a thought here.';
      token = Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('');
    } catch {
      status.textContent = zh ? '暂时未能确认送达，请稍后重试。你的文字仍保留在表单中。' : 'Delivery could not be confirmed. Please try again; your text is still here.';
    } finally { button.disabled = false; }
  });
}
