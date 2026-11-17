(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const tracks = ['debate', 'tech', 'community'];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = value => {
    if (/^\.\/(?:resume\.html\?track=(?:debate|tech|community)|assets\/[a-z\d_/-]+\.pdf(?:#page=[1-9]\d*)?)$/i.test(String(value)) && !String(value).includes('..')) return escape(value);
    try { const url = new URL(value); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? escape(url.href) : '#'; } catch { return '#'; }
  };
  const link = item => `<a href="${safeUrl(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.label)} <span aria-hidden="true">↗</span></a>`;
  const metadata = item => `<span class="card-meta"><span class="meta-tag">${escape(item.organization)}</span>${item.date ? `<span class="meta-tag">${escape(item.date)}</span>` : ''}</span>`;
  const achievements = items => items?.length ? `<section class="experience-achievements" aria-label="Achievements"><h4>Achievements</h4><ul>${items.map(item => `<li><span class="result-topline"><strong>${escape(item.title)}</strong><span>${escape(item.year)}</span></span><span class="result-event">${escape(item.event)}</span>${item.note ? `<p>${escape(item.note)}</p>` : ''}</li>`).join('')}</ul></section>` : '';
  const imageUrl = value => {
    // Local images work both by double-clicking index.html and on GitHub Pages.
    const source = String(value || '').trim();
    if (!source) return '';
    if (/^(?:\.\/)?assets\/[a-z\d_./-]+\.(?:png|jpe?g|webp|svg)$/i.test(source) && !source.includes('..')) return escape(source);
    try { const url = new URL(source); if (url.protocol === 'https:') return escape(url.href); } catch {}
    return '';
  };
  const card = item => {
    const theme = ['sage', 'lavender', 'sand', 'slate', 'photo', 'hhdc', 'xdt'].includes(item.coverTheme) ? item.coverTheme : 'sage';
    const image = imageUrl(item.image);
    const cover = image && !/^(?:\.\/)?assets\/card-cover\.png$/i.test(image)
      ? `<span class="card-cover cover-${theme}"><img src="${image}" alt="${escape(item.imageAlt || '')}" width="1200" height="800" loading="lazy" decoding="async" /></span>`
      : '';
    return `<details class="card"><summary>${cover}<span class="card-body"><span class="card-main">${metadata(item)}<span class="card-title">${escape(item.title)}</span><span class="card-summary">${escape(item.summary)}</span></span><span class="card-toggle" aria-hidden="true"></span></span></summary><div class="card-details">${(item.description || []).map(p => `<p>${escape(p)}</p>`).join('')}${achievements(item.achievements)}${item.links?.length ? `<div class="card-links">${item.links.map(link).join('')}</div>` : ''}</div></details>`;
  };

  // Missing photos collapse to a text card without an empty cover or placeholder.
  document.addEventListener('error', event => {
    const img = event.target;
    if (!img.matches?.('.card-cover img')) return;
    img.closest('.card-cover')?.remove();
  }, true);

  const bioLinks = [
    ['deep interest in artificial intelligence and its applications', 'tech'],
    ['resolving issues through debate', 'debate'],
    ['developing solutions with meaningful community impact', 'community']
  ];
  $('#bio').innerHTML = data.bio.map(paragraph => {
    let text = escape(paragraph);
    for (const [phrase, track] of bioLinks) {
      const label = escape(phrase);
      text = text.replaceAll(label, `<a class="bio-section-link" href="#${track}">${label}</a>`);
    }
    return `<p>${text}</p>`;
  }).join('');
  $('#social-links').innerHTML = data.socials.map(link).join('');
  const schoolLogo = item => item.logo
    ? `<div class="school-icon school-logo"><img src="${safeUrl(item.logo)}" alt="${escape(item.name)} logo" width="56" height="56" loading="lazy" decoding="async" referrerpolicy="no-referrer" /><span class="school-logo-fallback" aria-hidden="true">${escape(item.initials)}</span></div>`
    : `<div class="school-icon" aria-hidden="true">${escape(item.initials)}</div>`;
  const coursework = item => `<details class="coursework"><summary aria-label="Relevant coursework at ${escape(item.name)}">Relevant coursework</summary>${item.coursework?.length ? `<ul>${item.coursework.map(course => `<li>${escape(course)}</li>`).join('')}</ul>` : '<p class="coursework-empty">Course list coming soon.</p>'}</details>`;
  $('#education-list').innerHTML = data.education.map(item => `<article class="education-card">${schoolLogo(item)}<div><div class="school-heading"><h3>${escape(item.name)}</h3><span>${escape(item.date || item.location)}</span></div><p class="qualification">${escape(item.qualification)}</p><p class="education-description">${escape(item.description)}</p>${coursework(item)}</div></article>`).join('');
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

  const navLinks = $$('.nav-links a');
  const scrollSections = ['about', 'education', 'work'].map(id => $(`#${id}`));
  let activeTrack = 'debate';
  let navUpdateQueued = false;

  function updateNavFromScroll() {
    // Read just below the sticky header, including the anchor's scroll spacing.
    const readingLine = $('.site-header').getBoundingClientRect().bottom + 48;
    let activeSection = 'about';
    for (const section of scrollSections) {
      if (section.getBoundingClientRect().top <= readingLine) {
        activeSection = section.id === 'work' ? activeTrack : section.id;
      }
    }
    // Contact has no corresponding navbar item.
    if ($('#contact').getBoundingClientRect().top <= readingLine) activeSection = null;
    navLinks.forEach(anchor => {
      if (anchor.hash === `#${activeSection}`) anchor.setAttribute('aria-current', 'location');
      else anchor.removeAttribute('aria-current');
    });
  }

  function scheduleNavUpdate() {
    if (navUpdateQueued) return;
    navUpdateQueued = true;
    requestAnimationFrame(() => {
      navUpdateQueued = false;
      updateNavFromScroll();
    });
  }

  function selectTrack(track, moveFocus = false) {
    activeTrack = track;
    $$('[data-track]').forEach(button => {
      const selected = button.dataset.track === track;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      $(`#${button.dataset.track}-panel`).hidden = !selected;
      if (selected && moveFocus) button.focus();
    });
    scheduleNavUpdate();
  }
  function route() {
    const hash = location.hash.slice(1);
    if (tracks.includes(hash)) {
      selectTrack(hash);
      $('#work').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    scheduleNavUpdate();
  }
  $$('[data-track]').forEach(button => {
    button.addEventListener('click', () => { history.replaceState(null, '', `#${button.dataset.track}`); selectTrack(button.dataset.track); });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = tracks.indexOf(button.dataset.track);
      const next = event.key === 'Home' ? tracks[0] : event.key === 'End' ? tracks[tracks.length - 1] : tracks[(index + (event.key === 'ArrowRight' ? 1 : -1) + tracks.length) % tracks.length];
      history.replaceState(null, '', `#${next}`); selectTrack(next, true);
    });
  });
  // Repeated navigation to the selected track still returns to the work section.
  $$('.nav-links a, .bio a[href^="#"]').forEach(a => a.addEventListener('click', () => { if (a.hash === location.hash) route(); }));
  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', scheduleNavUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavUpdate);
  window.addEventListener('load', scheduleNavUpdate);
  document.addEventListener('toggle', scheduleNavUpdate, true);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleNavUpdate).observe($('#main'));
  route();
})();
