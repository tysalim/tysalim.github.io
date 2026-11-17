(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const tracks = ['debate', 'tech', 'community'];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = value => {
    if (/^\.\/(?:resume\.html\?track=(?:debate|tech|community)|assets\/[a-z\d_/-]+\.pdf)$/i.test(String(value)) && !String(value).includes('..')) return escape(value);
    try { const url = new URL(value); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? escape(url.href) : '#'; } catch { return '#'; }
  };
  const link = item => `<a href="${safeUrl(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.label)} <span aria-hidden="true">↗</span></a>`;
  const tags = values => `<div class="tags">${(values || []).map(value => `<span>${escape(value)}</span>`).join('')}</div>`;
  const achievements = items => items?.length ? `<section class="experience-achievements" aria-label="Achievements"><h4>Achievements</h4><ul>${items.map(item => `<li><span class="result-topline"><strong>${escape(item.title)}</strong><span>${escape(item.year)}</span></span><span class="result-event">${escape(item.event)}</span>${item.note ? `<p>${escape(item.note)}</p>` : ''}</li>`).join('')}</ul></section>` : '';
  const imageUrl = value => {
    // Local images work both by double-clicking index.html and on GitHub Pages.
    const source = String(value || './assets/card-cover.png');
    if (/^(?:\.\/)?assets\/[a-z\d_./-]+\.(?:png|jpe?g|webp|svg)$/i.test(source) && !source.includes('..')) return escape(source);
    try { const url = new URL(source); if (url.protocol === 'https:') return escape(url.href); } catch {}
    return './assets/card-cover.png';
  };
  const card = item => {
    const theme = ['sage', 'lavender', 'sand', 'slate', 'photo', 'hhdc', 'xdt'].includes(item.coverTheme) ? item.coverTheme : 'sage';
    return `<details class="card"><summary><span class="card-cover cover-${theme}"><img src="${imageUrl(item.image)}" alt="${escape(item.imageAlt || '')}" ${item.imageFallback ? `data-fallback="${imageUrl(item.imageFallback)}"` : ''} width="1200" height="800" loading="lazy" decoding="async" /></span><span class="card-body"><span class="card-icon" aria-hidden="true">${escape(item.icon || '↗')}</span><span class="card-main"><span class="card-meta">${escape(item.organization)}${item.date ? ` · ${escape(item.date)}` : ''}</span><span class="card-title">${escape(item.title)}</span><span class="card-summary">${escape(item.summary)}</span>${tags(item.tags)}</span><span class="card-toggle" aria-hidden="true"></span></span></summary><div class="card-details">${(item.description || []).map(p => `<p>${escape(p)}</p>`).join('')}${achievements(item.achievements)}${item.links?.length ? `<div class="card-links">${item.links.map(link).join('')}</div>` : ''}</div></details>`;
  };

  // Preserve a working cover while a replacement photo is being added.
  document.addEventListener('error', event => {
    const img = event.target;
    if (!img.matches?.('.card-cover img') || !img.dataset.fallback) return;
    const fallback = img.dataset.fallback;
    delete img.dataset.fallback;
    img.src = fallback;
  }, true);

  $('#bio').innerHTML = data.bio.map(p => `<p>${escape(p)}</p>`).join('');
  $('#social-links').innerHTML = data.socials.map(link).join('');
  const schoolLogo = item => item.logo
    ? `<div class="school-icon school-logo"><img src="${safeUrl(item.logo)}" alt="${escape(item.name)} logo" width="56" height="56" loading="lazy" decoding="async" referrerpolicy="no-referrer" /><span class="school-logo-fallback" aria-hidden="true">${escape(item.initials)}</span></div>`
    : `<div class="school-icon" aria-hidden="true">${escape(item.initials)}</div>`;
  $('#education-list').innerHTML = data.education.map(item => `<article class="education-card">${schoolLogo(item)}<div><div class="school-heading"><h3>${escape(item.name)}</h3><span>${escape(item.date || item.location)}</span></div><p class="qualification">${escape(item.qualification)}</p><p class="education-description">${escape(item.description)}</p></div></article>`).join('');
  $$('.school-logo img').forEach(img => img.addEventListener('error', () => {
    img.hidden = true;
    img.parentElement.classList.add('logo-unavailable');
  }));
  $('#projects').innerHTML = data.projects.map(card).join('');
  $('#initiatives').innerHTML = (data.initiatives || []).map(card).join('');
  tracks.forEach(track => {
    const resume = data.resumes[track];
    const anchor = $(`#${track}-resume`);
    anchor.href = safeUrl(resume.url);
    anchor.innerHTML = `${escape(resume.label)} <span aria-hidden="true">↗</span>`;
  });
  $('#year').textContent = new Date().getFullYear();

  function filter(group, status) {
    const items = data[group].filter(item => status === 'all' || item.status === status);
    $(`#${group}-experience`).innerHTML = items.length ? items.map(card).join('') : `<p class="empty-state">No ${escape(status)} experiences listed yet.</p>`;
    $$(`[data-group="${group}"]`).forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === status)));
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => filter(button.dataset.group, button.dataset.filter)));
  tracks.forEach(track => filter(track, 'all'));

  function selectTrack(track, moveFocus = false) {
    $$('[data-track]').forEach(button => {
      const selected = button.dataset.track === track;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      $(`#${button.dataset.track}-panel`).hidden = !selected;
      if (selected && moveFocus) button.focus();
    });
  }
  function route() {
    const hash = location.hash.slice(1);
    if (tracks.includes(hash)) {
      selectTrack(hash);
      $('#work').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    $$('.nav-links a').forEach(a => {
      if (a.hash === (location.hash || '#about')) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }
  $$('[data-track]').forEach(button => {
    button.addEventListener('click', () => { history.replaceState(null, '', `#${button.dataset.track}`); selectTrack(button.dataset.track); routeNav(); });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = tracks.indexOf(button.dataset.track);
      const next = event.key === 'Home' ? tracks[0] : event.key === 'End' ? tracks[tracks.length - 1] : tracks[(index + (event.key === 'ArrowRight' ? 1 : -1) + tracks.length) % tracks.length];
      history.replaceState(null, '', `#${next}`); selectTrack(next, true); routeNav();
    });
  });
  function routeNav() {
    $$('.nav-links a').forEach(a => { if (a.hash === location.hash) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  }
  // Repeated navigation to the selected track still returns to the work section.
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => { if (a.hash === location.hash) route(); }));
  window.addEventListener('hashchange', route);
  route();
})();
