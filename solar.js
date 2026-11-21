(() => {
  const map = document.querySelector('#solar-map');
  if (!map) return;
  const zh = document.documentElement.lang === 'zh-CN';
  const worlds = [
    ['about', 'sun', '太阳', 'Sun', '绝对引力中心 · 关于我', 'The human · A gravitational centre', '#ffbb63', 54],
    ['zhuangzi', 'mercury', '水星', 'Mercury', '庄子与我 · 留一句话', 'Zhuangzi & me · Leave a thought', '#b9b4a9', 13],
    ['stardust', 'venus', '金星', 'Venus', '宇宙的一条脚注', 'A cosmic footnote', '#e3bd83', 20],
    ['school-memories', 'earth', '地球', 'Earth', '过去的回忆 · 校园往事', 'School memories · Pages from the past', '#74b5d7', 22],
    ['essays', 'mars', '火星', 'Mars', '文史哲 · 阅读与思考', 'Literature, history & philosophy', '#cb8063', 17],
    ['future', 'jupiter', '木星', 'Jupiter', '政治 · 一场早早开跑的竞选', 'Politics · An extremely early campaign', '#c9a58d', 38],
    ['saturn', 'saturn', '土星', 'Saturn', '', '', '#dac99e', 31],
    ['uranus', 'uranus', '天王星', 'Uranus', '', '', '#9ad8dc', 25],
    ['neptune', 'neptune', '海王星', 'Neptune', '', '', '#5b7fe0', 25],
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1000 640');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('orbit-lines');
  map.append(svg);
  let hover = -1, focus = -1, selected = 0, paused = false, speed = 1;
  const angles = [0, 2.8, 5.2, 1.0, 3.7, 5.7, 2.5, .25, 4.3];
  const nodes = worlds.map(([id, body, cn, en, descCn, descEn, color, size], i) => {
    const section = document.getElementById(id);
    section.classList.add('planet-section', `world-${body}`);
    section.style.setProperty('--planet-color', color);
    section.dataset.world = zh ? cn : en;
    if (body !== 'sun') {
      const scene = document.createElement('div');
      scene.className = `planet-scene scene-${body}`;
      const backdrop = document.createElement('div');
      backdrop.className = 'planet-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      section.before(scene);
      scene.append(backdrop, section);
    }
    const orbit = i ? document.createElementNS(svg.namespaceURI, 'ellipse') : null;
    if (orbit) {
      orbit.setAttribute('cx', 500); orbit.setAttribute('cy', 320);
      orbit.setAttribute('rx', 58 + i * 49); orbit.setAttribute('ry', 36 + i * 32);
      orbit.addEventListener('pointerenter', () => { hover = i; highlight(); });
      orbit.addEventListener('pointerleave', () => { hover = -1; highlight(); });
      orbit.addEventListener('click', () => select(i));
      svg.append(orbit);
    }
    const button = document.createElement('button');
    button.type = 'button'; button.className = `world-button world-${body}`;
    button.style.setProperty('--planet-color', color);
    button.style.setProperty('--size', `${size}px`);
    button.setAttribute('aria-label', `${zh ? cn : en} · ${zh ? descCn || '空白板块' : descEn || 'Unwritten chapter'}`);
    button.innerHTML = `<span class="planet-sphere" aria-hidden="true"></span><span class="world-label">${zh ? cn : en}</span><span class="world-card"><small>0${i + 1} / ${en.toUpperCase()}</small><strong>${zh ? cn : en}</strong>${(zh ? descCn : descEn) ? `<span>${zh ? descCn : descEn}</span>` : ''}</span>`;
    button.addEventListener('pointerenter', () => { hover = i; highlight(); });
    button.addEventListener('pointerleave', () => { hover = -1; highlight(); });
    button.addEventListener('focus', () => { focus = i; highlight(); });
    button.addEventListener('blur', () => { focus = -1; highlight(); });
    button.addEventListener('click', () => select(i));
    map.append(button);
    return { section, button, orbit };
  });
  function highlight() {
    const active = hover >= 0 ? hover : focus;
    nodes.forEach(({button, orbit}, i) => {
      button.classList.toggle('is-highlighted', active === i);
      orbit?.classList.toggle('is-highlighted', active === i);
    });
  }
  // Replace this callback to integrate analytics or custom navigation.
  window.onSelectSection = window.onSelectSection || function(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
  };
  function select(i) {
    selected = i;
    nodes.forEach(({button}, n) => button.classList.toggle('is-selected', n === i));
    window.onSelectSection(worlds[i][0]);
    document.dispatchEvent(new CustomEvent('sectionselect', { detail: { sectionId: worlds[i][0] } }));
  }
  const toggle = document.querySelector('.motion-toggle');
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = zh ? (paused ? '继续公转' : '暂停公转') : (paused ? 'Resume orbits' : 'Pause orbits');
  });
  let last = 0, visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(map);
  function frame(time) {
    const dt = Math.min((time - (last || time)) / 1000, .05); last = time;
    const stop = paused || hover >= 0 || focus >= 0 || reduced.matches;
    speed = reduced.matches ? 0 : speed + ((stop ? 0 : 1) - speed) * (1 - Math.exp(-dt * 9));
    if (visible && !mobile.matches && !document.hidden) {
      nodes.forEach(({button}, i) => {
        if (i) angles[i] += dt * speed * (.14 / (1 + i * .35));
        const x = i ? 500 + Math.cos(angles[i]) * (58 + i * 49) : 500;
        const y = i ? 320 + Math.sin(angles[i]) * (36 + i * 32) : 320;
        button.style.left = `${x / 10}%`; button.style.top = `${y / 6.4}%`;
        button.classList.toggle('card-left', x > 700);
        button.classList.toggle('card-below', y < 140);
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  const progress = document.querySelector('.journey-progress');
  const location = progress.querySelector('.journey-location');
  let pending = false;
  function updateProgress() {
    pending = false;
    const target = innerHeight * .4;
    let current = -1;
    nodes.forEach(({section}, i) => { if (section.getBoundingClientRect().top <= target) current = i; });
    progress.classList.toggle('is-visible', current >= 0 && nodes[8].section.getBoundingClientRect().bottom > 0);
    if (current >= 0) {
      location.textContent = `0${current + 1} / ${zh ? worlds[current][2] : worlds[current][3].toUpperCase()}`;
      progress.style.setProperty('--progress', `${current / 8 * 100}%`);
      nodes.forEach(({section, button}, i) => {
        section.classList.toggle('is-current', current === i);
        button.setAttribute('aria-current', current === i ? 'location' : 'false');
      });
    }
  }
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();
})();
