(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = value => {
    try { const url = new URL(value); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? escape(url.href) : '#'; } catch { return '#'; }
  };
  const link = item => `<a href="${safeUrl(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.label)} <span aria-hidden="true">↗</span></a>`;
  const tags = values => `<div class="tags">${(values || []).map(value => `<span>${escape(value)}</span>`).join('')}</div>`;
  const card = item => `<details class="card"><summary><span class="card-icon" aria-hidden="true">${escape(item.icon || '↗')}</span><span class="card-main"><span class="card-meta">${escape(item.organization)}${item.date ? ` · ${escape(item.date)}` : ''}</span><span class="card-title">${escape(item.title)}</span><span class="card-summary">${escape(item.summary)}</span>${tags(item.tags)}</span><span class="card-toggle" aria-hidden="true"></span></summary><div class="card-details">${(item.description || []).map(p => `<p>${escape(p)}</p>`).join('')}${item.links?.length ? `<div class="card-links">${item.links.map(link).join('')}</div>` : ''}</div></details>`;

  $('#bio').innerHTML = data.bio.map(p => `<p>${escape(p)}</p>`).join('');
  $('#social-links').innerHTML = data.socials.map(link).join('');
  $('#education-list').innerHTML = data.education.map(item => `<article class="education-card"><div class="school-icon" aria-hidden="true">${escape(item.initials)}</div><div><div class="school-heading"><h3>${escape(item.name)}</h3><span>${escape(item.date || item.location)}</span></div><p class="qualification">${escape(item.qualification)}</p><p class="education-description">${escape(item.description)}</p>${tags(item.subjects)}</div></article>`).join('');
  $('#achievements').innerHTML = data.achievements.map((item, i) => `<details class="achievement"><summary><span class="achievement-number">${String(i + 1).padStart(2, '0')}</span><span><strong>${escape(item.title)}</strong><span class="achievement-event">${escape(item.event)}</span></span><span class="achievement-year">${escape(item.year)}</span><span class="card-toggle" aria-hidden="true"></span></summary><p>${escape(item.note)}</p></details>`).join('');
  $('#projects').innerHTML = data.projects.map(card).join('');
  $('#year').textContent = new Date().getFullYear();

  function filter(group, status) {
    const items = data[group].filter(item => item.status === status);
    $(`#${group}-experience`).innerHTML = items.length ? items.map(card).join('') : `<p class="empty-state">No ${escape(status)} experiences listed yet.</p>`;
    $$(`[data-group="${group}"]`).forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === status)));
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => filter(button.dataset.group, button.dataset.filter)));
  filter('debate', 'current');
  filter('tech', 'current');

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
    if (hash === 'debate' || hash === 'tech') {
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
      const next = event.key === 'Home' ? 'debate' : event.key === 'End' ? 'tech' : button.dataset.track === 'debate' ? 'tech' : 'debate';
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
