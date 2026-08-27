const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');
const discordLoginBtn = document.getElementById('discordLoginBtn');
const discordSignoutBtn = document.getElementById('discordSignoutBtn');
const discordUserInfo = document.getElementById('discordUserInfo');
const discordAvatar = document.getElementById('discordAvatar');
const discordUsername = document.getElementById('discordUsername');
const discordUserId = document.getElementById('discordUserId');
const scrollTopBtn = document.getElementById('scrollTopBtn');
scrollTopBtn.classList.add('hidden');
scrollTopBtn.classList.remove('visible');
const themeToggle = document.getElementById('themeToggle');
const themeToggleIcon = themeToggle.querySelector('.theme-toggle__icon');
const galleryTrack = document.getElementById('galleryTrack');
const galleryViewport = document.getElementById('galleryViewport');
const gallerySlides = [...document.querySelectorAll('.gallery-slide')];
const featuredTrack = document.getElementById('featuredTrack');
const featuredViewport = document.getElementById('featuredViewport');
const featuredSlides = [...document.querySelectorAll('.featured-slide')];
const galleryDots = document.querySelector('.gallery-dots');
const featuredDots = document.querySelector('.featured-dots');
const introOverlay = document.getElementById('introOverlay');
const modal = document.getElementById('detailModal');
const modalContent = modal.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const infoCards = document.querySelectorAll('.info-card');
const infoTip = document.getElementById('infoTip');
const tipClose = document.querySelector('.tip-close');
const siteDataUrl = window.CFC_SITE_DATA_URL || '/api/site-data';
const memberStatusMap = {
  online: { label: 'Online', className: 'online' },
  idle: { label: 'Idle', className: 'idle' },
  dnd: { label: 'Do Not Disturb', className: 'dnd' },
  offline: { label: 'Offline', className: 'offline' }
};
const latestUpdate = document.getElementById('latestUpdate');
const latestUpdateTitle = document.getElementById('latestUpdateTitle');
const latestUpdateBody = document.getElementById('latestUpdateBody');
const latestUpdateAuthor = document.getElementById('latestUpdateAuthor');
const latestUpdatePoster = document.getElementById('latestUpdatePoster');
const latestUpdateDate = document.getElementById('latestUpdateDate');
const latestUpdateTime = document.getElementById('latestUpdateTime');
const totalVoiceChannels = document.getElementById('totalVoiceChannels');
const totalChatChannels = document.getElementById('totalChatChannels');
const activeMembers = document.getElementById('activeMembers');
let latestAnnouncement = null;
let liveMemberCount = null;
const discordInviteUrl = window.CFC_DISCORD_INVITE_URL || 'https://discord.com';
const currentEventTitle = document.getElementById('currentEventTitle');
const currentEventProgress = document.getElementById('currentEventProgress');
const currentEventBar = document.getElementById('currentEventBar');
const currentEventCard = document.getElementById('currentEventCard');
const clickableTip = document.getElementById('clickable-tip');
const clickableTipClose = document.getElementById('close-tip-btn');
let currentEventProgressValue = 85;

const DISCORD_STORAGE_KEY = 'cfc_discord_user';
const DISCORD_CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID';
const DISCORD_REDIRECT_URI = `${window.location.origin}${window.location.pathname}`;

const setMenuState = (isOpen) => {
  menuOverlay.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
};

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenuState(!expanded);
});

menuOverlay.addEventListener('click', (event) => {
  if (event.target === menuOverlay) {
    setMenuState(false);
  }
});

document.querySelectorAll('.menu-links a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

let lastScrollTop = 0;
const updateScrollState = () => {
  const current = window.scrollY || 0;
  const bodyReady = document.body.classList.contains('intro-complete');
  const atTop = current <= 12;
  const scrollingDown = current > lastScrollTop + 8;

  header.classList.toggle('is-hidden', bodyReady && !atTop && scrollingDown);

  if (!bodyReady || atTop) {
    scrollTopBtn.classList.add('hidden');
    scrollTopBtn.classList.remove('visible');
  } else if (current > 280) {
    scrollTopBtn.classList.remove('hidden');
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.add('hidden');
    scrollTopBtn.classList.remove('visible');
  }

  lastScrollTop = current;
};

window.addEventListener('scroll', updateScrollState);
window.addEventListener('load', () => {
  scrollTopBtn.classList.add('hidden');
  scrollTopBtn.classList.remove('visible');
  updateScrollState();
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const sunIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="3.8"></circle>
    <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
      <path d="M12 1.8v2.2M12 20v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M1.8 12h2.2M20 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/>
    </g>
  </svg>
`;

const moonIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.8 15.2A7.2 7.2 0 0 1 8.8 5.2a7.8 7.8 0 1 0 10 10Z" fill="currentColor" stroke="currentColor" stroke-width="0.8" stroke-linejoin="round"></path>
  </svg>
`;

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;
  themeToggleIcon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
};

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const systemTheme = () => (prefersDark.matches ? 'dark' : 'light');

const syncSystemTheme = () => {
  if (!localStorage.getItem('cfc-theme')) {
    applyTheme(systemTheme());
  }
};

const savedTheme = localStorage.getItem('cfc-theme');
const initialTheme = savedTheme || systemTheme();
applyTheme(initialTheme);

const applyMemberPresenceToCard = (card, status) => {
  const safeStatus = memberStatusMap[status] || memberStatusMap.offline;
  const dot = card.querySelector('.discord-status-dot');
  const label = card.querySelector('.member-status-text');
  const statusDot = card.querySelector('.member-status-dot');

  card.dataset.presence = safeStatus.className;
  if (dot) {
    dot.className = `discord-status-dot ${safeStatus.className}`;
    dot.setAttribute('aria-label', safeStatus.label);
  }
  if (label) label.textContent = safeStatus.label;
  if (statusDot) statusDot.className = `member-status-dot ${safeStatus.className}`;
};

const syncMemberPresence = (teamPresence = []) => {
  if (!teamPresence.length) return;
  const map = new Map(teamPresence.map((member) => [String(member.userId), member]));

  document.querySelectorAll('.member-card').forEach((card) => {
    const userId = card.dataset.userId || '';
    const member = map.get(String(userId));
    const status = member?.status || 'offline';
    applyMemberPresenceToCard(card, status);
  });
};

const loadSiteData = async () => {
  try {
    const response = await fetch(siteDataUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Site data request failed: ${response.status}`);
    const payload = await response.json();
    syncMemberPresence(payload.teamPresence || []);
    const count = Number(payload.memberCount);

    if (Number.isFinite(count) && count >= 0) {
      liveMemberCount = count;
      document.getElementById('memberCount').textContent = `${count.toLocaleString('en-US')}+`;
      document.getElementById('metricMembers').textContent = `${(count / 1000).toFixed(1)}K`;
    }

    const serverStats = payload.serverStats || {};
    const voiceChannels = Number.isFinite(Number(serverStats.voiceChannels)) ? Number(serverStats.voiceChannels) : 0;
    const chatChannels = Number.isFinite(Number(serverStats.chatChannels)) ? Number(serverStats.chatChannels) : 0;
    const onlineMemberCount = Math.max(Number(serverStats.onlineMembers) || 0, 0);
    const activeMemberCount = [serverStats.onlineMembers, serverStats.idleMembers, serverStats.dndMembers]
      .map(Number)
      .filter(Number.isFinite)
      .reduce((total, value) => total + Math.max(value, 0), 0);
    if (Number.isInteger(voiceChannels) && voiceChannels >= 0) totalVoiceChannels.textContent = voiceChannels.toLocaleString('en-US');
    if (Number.isInteger(chatChannels) && chatChannels >= 0) totalChatChannels.textContent = chatChannels.toLocaleString('en-US');
    if (Number.isInteger(activeMemberCount) && activeMemberCount >= 0) activeMembers.textContent = activeMemberCount.toLocaleString('en-US');
    const currentEvent = payload.currentEvent;
    const progress = Number(currentEvent?.progress);
    if (currentEvent && currentEventTitle && Number.isInteger(progress) && progress >= 0 && progress <= 100) {
      currentEventProgressValue = progress;
      currentEventTitle.textContent = currentEvent.title;
      currentEventProgress.textContent = `${progress}% complete`;
      currentEventBar.style.width = `${progress}%`;
    } else if (currentEventTitle) {
      currentEventProgressValue = 0;
      currentEventTitle.textContent = 'No active event';
      currentEventProgress.textContent = '0% complete';
      currentEventBar.style.width = '0%';
    }
    currentEventCard?.classList.toggle('current-event-cleared', !currentEvent);

    const update = payload.updates?.[0] || null;
    if (update && latestUpdate) {
      latestAnnouncement = update;
      latestUpdateTitle.textContent = update.title;
      latestUpdateBody.textContent = update.body;
      latestUpdateAuthor.textContent = update.submittedBy || 'Discord bot';
      latestUpdateDate.textContent = update.date || 'Date to be announced';
      latestUpdateTime.textContent = update.time || 'Time to be announced';
      if (update.poster) {
        latestUpdatePoster.src = update.poster;
        latestUpdatePoster.alt = `${update.title} poster`;
        latestUpdatePoster.classList.add('has-image');
      } else {
        latestUpdatePoster.removeAttribute('src');
        latestUpdatePoster.classList.remove('has-image');
      }
      latestUpdate.classList.remove('hidden');
    } else if (latestUpdate) {
      latestAnnouncement = null;
      latestUpdateTitle.innerHTML = '<strong>No active events</strong>';
      latestUpdateTitle.textContent = 'No Announcement';
      latestUpdateBody.textContent = 'There are no active announcements right now.';
      latestUpdateAuthor.textContent = payload.announcementClear?.clearedBy
        ? `Cleared by ${payload.announcementClear.clearedBy}`
        : 'null';
      latestUpdateDate.textContent = 'null';
      latestUpdateTime.textContent = 'null';
      latestUpdatePoster.removeAttribute('src');
      latestUpdatePoster.classList.remove('has-image');
      latestUpdate.classList.remove('hidden');
      latestUpdate.classList.add('announcement-cleared');
    }
    latestUpdate?.classList.toggle('announcement-cleared', !update);
  } catch (error) {
    console.error('Failed to fetch live site data:', error);
  }
};

latestUpdatePoster?.addEventListener('error', () => {
  latestUpdatePoster.removeAttribute('src');
  latestUpdatePoster.classList.remove('has-image');
});

loadSiteData();
window.setInterval(loadSiteData, 30000);
if (prefersDark.addEventListener) {
  prefersDark.addEventListener('change', syncSystemTheme);
} else if (prefersDark.addListener) {
  prefersDark.addListener(syncSystemTheme);
}

const hideIntro = () => {
  introOverlay.classList.add('is-hidden');
  document.body.classList.add('intro-complete');
  scrollTopBtn.classList.add('hidden');
  scrollTopBtn.classList.remove('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateScrollState();

  if (clickableTip) {
    clickableTip.classList.remove('hidden');
    requestAnimationFrame(() => clickableTip.classList.add('show'));
    window.clearTimeout(hideIntro.tipTimer);
    hideIntro.tipTimer = window.setTimeout(() => {
      clickableTip.classList.remove('show');
      window.setTimeout(() => clickableTip.classList.add('hidden'), 350);
    }, 3000);
  }

  const isMobile = window.matchMedia('(max-width: 640px)').matches;

  if (!isMobile) {
    animateMetricValue('#metricMembers', 4600, (value) => `${(value / 1000).toFixed(1)}K`);
    animateMetricValue('.metric-box.wide strong', 1600, (value) => `${value.toLocaleString('en-US')}K`);

    const progressLabels = document.querySelectorAll('.floating-card .progress-row span');
    if (progressLabels.length) {
      animateNumber({
        element: progressLabels[0],
        start: 0,
        end: currentEventProgressValue,
        duration: 1500,
        format: (value) => `${value}% complete`,
      });

      animateNumber({
        element: progressLabels[1],
        start: 0,
        end: 50,
        duration: 1500,
        format: (value) => `+${value}%`,
      });
    }

    animateProgressBar('.floating-card .progress-bar span', `${currentEventProgressValue}%`);
  }

  if (isMobile && liveMemberCount !== null) {
    document.getElementById('memberCount').textContent = `${liveMemberCount.toLocaleString('en-US')}+`;
  }
};

const introCta = document.querySelector('.intro-cta');
if (introCta) {
  introCta.addEventListener('click', hideIntro);
}

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
});

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => observer.observe(el));

const createDots = (container, total, onSelect) => {
  if (!container) return;

  container.innerHTML = '';

  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => onSelect(i));
    container.appendChild(dot);
  }
};

const updateDotState = (container, total, activeIndex) => {
  if (!container) return;

  const dots = [...container.querySelectorAll('.carousel-dot')];
  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === activeIndex);
  });
};

let galleryIndex = 0;
const galleryLen = gallerySlides.length;

const updateGallery = (index) => {
  if (!galleryTrack || !gallerySlides.length) return;
  galleryIndex = (index + galleryLen) % galleryLen;
  galleryTrack.style.transform = `translateX(-${galleryIndex * 100}%)`;
  gallerySlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === galleryIndex);
  });
  updateDotState(galleryDots, galleryLen, galleryIndex);
};

if (galleryTrack && gallerySlides.length > 1) {
  createDots(galleryDots, galleryLen, (newIndex) => updateGallery(newIndex));
  updateDotState(galleryDots, galleryLen, galleryIndex);

  let galleryStartX = 0;
  let galleryDeltaX = 0;
  let galleryDragging = false;

  const applyGalleryDrag = (delta) => {
    galleryTrack.style.transition = 'none';
    galleryTrack.style.transform = `translateX(${(-galleryIndex * 100) + (delta / (galleryViewport?.clientWidth || 1)) * 100}%)`;
  };

  galleryViewport?.addEventListener('pointerdown', (event) => {
    galleryStartX = event.clientX;
    galleryDeltaX = 0;
    galleryDragging = true;
    galleryTrack.style.transition = 'none';
  });

  galleryViewport?.addEventListener('pointermove', (event) => {
    if (!galleryDragging) return;
    galleryDeltaX = event.clientX - galleryStartX;
    applyGalleryDrag(galleryDeltaX);
  });

  const finishGalleryDrag = () => {
    if (!galleryDragging) return;
    galleryDragging = false;
    galleryTrack.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';

    const threshold = (galleryViewport?.clientWidth || 1) * 0.14;
    if (Math.abs(galleryDeltaX) > threshold) {
      updateGallery(galleryDeltaX < 0 ? galleryIndex + 1 : galleryIndex - 1);
    } else {
      updateGallery(galleryIndex);
    }
  };

  galleryViewport?.addEventListener('pointerup', finishGalleryDrag);
  galleryViewport?.addEventListener('pointerleave', finishGalleryDrag);
  galleryViewport?.addEventListener('pointercancel', finishGalleryDrag);

  setInterval(() => {
    updateGallery(galleryIndex + 1);
  }, 4200);
}

let featuredIndex = 0;
const featuredLen = featuredSlides.length;

const updateFeatured = (index) => {
  if (!featuredTrack || !featuredSlides.length) return;
  featuredIndex = (index + featuredLen) % featuredLen;
  featuredTrack.style.transform = `translateX(-${featuredIndex * 100}%)`;
  updateDotState(featuredDots, featuredLen, featuredIndex);
};

if (featuredTrack && featuredSlides.length > 1) {
  createDots(featuredDots, featuredLen, (newIndex) => updateFeatured(newIndex));
  updateDotState(featuredDots, featuredLen, featuredIndex);

  let featuredStartX = 0;
  let featuredDeltaX = 0;
  let featuredDragging = false;

  const applyFeaturedDrag = (delta) => {
    featuredTrack.style.transition = 'none';
    featuredTrack.style.transform = `translateX(${(-featuredIndex * 100) + (delta / (featuredViewport?.clientWidth || 1)) * 100}%)`;
  };

  featuredViewport?.addEventListener('pointerdown', (event) => {
    featuredStartX = event.clientX;
    featuredDeltaX = 0;
    featuredDragging = true;
    featuredTrack.style.transition = 'none';
  });

  featuredViewport?.addEventListener('pointermove', (event) => {
    if (!featuredDragging) return;
    featuredDeltaX = event.clientX - featuredStartX;
    applyFeaturedDrag(featuredDeltaX);
  });

  const finishFeaturedDrag = () => {
    if (!featuredDragging) return;
    featuredDragging = false;
    featuredTrack.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';

    const threshold = (featuredViewport?.clientWidth || 1) * 0.14;
    if (Math.abs(featuredDeltaX) > threshold) {
      updateFeatured(featuredDeltaX < 0 ? featuredIndex + 1 : featuredIndex - 1);
    } else {
      updateFeatured(featuredIndex);
    }
  };

  featuredViewport?.addEventListener('pointerup', finishFeaturedDrag);
  featuredViewport?.addEventListener('pointerleave', finishFeaturedDrag);
  featuredViewport?.addEventListener('pointercancel', finishFeaturedDrag);

  setInterval(() => {
    updateFeatured(featuredIndex + 1);
  }, 5000);
}

const getMemberPresence = (card) => {
  const userId = card.dataset.userId || '';
  const fallback = 'offline';
  const presence = card.dataset.presence || fallback;
  const status = memberStatusMap[presence] || memberStatusMap[fallback];
  return { userId, status };
};

const openModal = (card) => {
  const title = card.dataset.title || card.dataset.name || 'Community update';
  const description = card.dataset.description || 'More details coming soon.';
  const action = card.dataset.action || 'Learn more';
  const role = card.dataset.role || '';
  const badge = card.dataset.type ? card.dataset.type.charAt(0).toUpperCase() + card.dataset.type.slice(1) : 'Details';
  const discord = card.dataset.discord || 'https://discord.com';
  const instagram = card.dataset.instagram || 'https://instagram.com';
  const email = card.dataset.email || 'mailto:hello@citizensofchange.in';
  const { status } = getMemberPresence(card);
  const statusMarkup = card.dataset.type === 'member'
    ? `<div class="modal-member-status"><span class="member-status-dot ${status.className}"></span><span>${status.label}</span></div>`
    : '';

  modalContent.innerHTML = `
    <span class="modal-badge">${badge}</span>
    <h3 id="modalTitle">${title}</h3>
    ${role ? `<p><strong>${role}</strong></p>` : ''}
    ${statusMarkup}
    <p>${description}</p>
    <div class="modal-socials">
      <a href="${discord}" target="_blank" rel="noreferrer" aria-label="Discord">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.34 4.93A18.82 18.82 0 0 0 16.97 4l-.2.4c1.06.31 2.02.74 2.9 1.29a14.9 14.9 0 0 0-11.4 0 13.5 13.5 0 0 0 2.9-1.29L7.03 4a18.82 18.82 0 0 0-3.37.93A19.14 19.14 0 0 0 2 16.62c2.02 1.54 3.96 2.45 5.82 3.06l.52-.8a11.1 11.1 0 0 1-1.86-1.02c.16-.11.3-.23.44-.35A12.5 12.5 0 0 0 12 18.3a12.5 12.5 0 0 0 4.98-1.39c.14.12.28.24.44.35-.56.41-1.19.77-1.86 1.02l.52.8c1.86-.61 3.8-1.52 5.82-3.06.16-5.77-.99-10.35-2.66-11.69ZM9.58 14.6c-.95 0-1.72-.87-1.72-1.94 0-1.07.77-1.94 1.72-1.94.96 0 1.73.87 1.73 1.94 0 1.07-.77 1.94-1.73 1.94Zm4.84 0c-.95 0-1.73-.87-1.73-1.94 0-1.07.78-1.94 1.73-1.94.96 0 1.73.87 1.73 1.94 0 1.07-.77 1.94-1.73 1.94Z"/></svg>
      </a>
      <a href="${instagram}" target="_blank" rel="noreferrer" aria-label="Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-2.75a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25Z"/></svg>
      </a>
      <a href="${email}" aria-label="Email">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.1-.5 6.9 5.4 7-5.4H5.1Zm14.4 2.1-7.5 5.9a1 1 0 0 1-1.2 0L4.5 8.1v9.4c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V8.1Z"/></svg>
      </a>
    </div>
    <a href="${discord}" class="modal-cta" target="_blank" rel="noreferrer">${action}</a>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

const openAnnouncementMenu = () => {
  if (!latestAnnouncement) return;

  const poster = latestAnnouncement.poster
    ? `<img class="announcement-modal-poster" src="${escapeHtml(latestAnnouncement.poster)}" alt="${escapeHtml(latestAnnouncement.title)} poster">`
    : '<div class="announcement-modal-no-image">No image found</div>';

  modalContent.innerHTML = `
    <span class="modal-badge announcement-modal-badge"><span class="latest-update-dot"></span> Live announcement</span>
    <h3 id="modalTitle">${escapeHtml(latestAnnouncement.title)}</h3>
    <p>${escapeHtml(latestAnnouncement.body)}</p>
    <div class="announcement-modal-details">
      <strong>Date</strong><span>${escapeHtml(latestAnnouncement.date || 'To be announced')}</span>
      <strong>Time</strong><span>${escapeHtml(latestAnnouncement.time || 'To be announced')}</span>
    </div>
    ${poster}
    <a href="${escapeHtml(latestAnnouncement.inviteLink || discordInviteUrl)}" class="modal-cta announcement-join" target="_blank" rel="noreferrer">Join on Discord</a>
  `;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

const openImageLightbox = (imageUrl, title = 'Poster Preview') => {
  if (!imageUrl) return;

  modalContent.innerHTML = `
    <div class="modal-image-container">
      <img class="modal-image-lightbox" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}">
    </div>
  `;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

infoCards.forEach((card) => {
  card.addEventListener('click', () => openModal(card));
});

const announcementPosterWrap = document.querySelector('.announcement-poster-wrap');
announcementPosterWrap?.addEventListener('click', (event) => {
  if (latestAnnouncement && latestAnnouncement.poster) {
    event.stopPropagation();
    openImageLightbox(latestAnnouncement.poster, latestAnnouncement.title);
  }
});

latestUpdate?.addEventListener('click', openAnnouncementMenu);
latestUpdate?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openAnnouncementMenu();
  }
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target.dataset.closeModal === 'true' || event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

const animateNumber = ({ element, start, end, duration = 1400, format }) => {
  if (!element) return;

  const startAt = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startAt) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    const current = Math.round(start + (end - start) * eased);
    element.textContent = format(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const animateProgressBar = (selector, targetWidth = '85%') => {
  const progressBar = document.querySelector(selector);
  if (!progressBar) return;

  progressBar.style.transition = 'width 1.4s cubic-bezier(0.22, 1, 0.36, 1)';
  progressBar.style.width = '0%';
  requestAnimationFrame(() => {
    progressBar.style.width = targetWidth;
  });
};

const animateMetricValue = (selector, endValue, format) => {
  const target = document.querySelector(selector);
  if (!target) return;

  animateNumber({
    element: target,
    start: 0,
    end: endValue,
    format,
  });
};


const getDiscordAuthUrl = () => {
  if (!DISCORD_CLIENT_ID || DISCORD_CLIENT_ID === 'YOUR_DISCORD_CLIENT_ID') {
    return null;
  }

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'token',
    scope: 'identify',
    prompt: 'consent',
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
};

const getDiscordAvatarUrl = (user) => {
  if (!user.avatar) {
    const fallbackIndex = Number(user.discriminator || '0') % 5;
    return `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`;
  }

  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
};

const renderDiscordUser = (user) => {
  if (!user) {
    discordUserInfo.classList.add('hidden');
    discordLoginBtn.classList.remove('hidden');
    discordSignoutBtn.classList.add('hidden');
    return;
  }

  discordAvatar.src = getDiscordAvatarUrl(user);
  discordUsername.textContent = user.username || 'Discord user';
  discordUserId.textContent = user.id ? `ID: ${user.id}` : 'User connected';

  discordUserInfo.classList.remove('hidden');
  discordLoginBtn.classList.add('hidden');
  discordSignoutBtn.classList.remove('hidden');
};

const saveDiscordUser = (user) => {
  localStorage.setItem(DISCORD_STORAGE_KEY, JSON.stringify(user));
  renderDiscordUser(user);
};

const clearDiscordUser = () => {
  localStorage.removeItem(DISCORD_STORAGE_KEY);
  renderDiscordUser(null);
  const url = new URL(window.location.href);
  url.hash = '';
  history.replaceState(null, '', url);
};

const fetchDiscordUser = async (token) => {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch profile');
  }

  const user = await response.json();
  saveDiscordUser(user);
};

const handleDiscordCallback = () => {
  const hash = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hash.get('access_token');

  if (!accessToken) {
    const storedUser = localStorage.getItem(DISCORD_STORAGE_KEY);
    if (storedUser) {
      renderDiscordUser(JSON.parse(storedUser));
    } else {
      renderDiscordUser(null);
    }
    return;
  }

  fetchDiscordUser(accessToken)
    .catch(() => {
      alert('Discord authentication failed. Please configure your client ID and redirect URL.');
      clearDiscordUser();
    })
    .finally(() => {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.hash = '';
      history.replaceState(null, '', cleanUrl);
    });
};

discordLoginBtn.addEventListener('click', () => {
  const authUrl = getDiscordAuthUrl();
  if (!authUrl) {
    alert('Add your real Discord Client ID in js/main.js before testing login.');
    return;
  }
  window.location.href = authUrl;
});

discordSignoutBtn.addEventListener('click', clearDiscordUser);

handleDiscordCallback();

// Welcome Overlay stays until user clicks Explore the community button
(function() {
  const tip = document.getElementById('clickable-tip');
  const btn = document.getElementById('close-tip-btn');

  if (btn && tip) btn.addEventListener('click', () => {
    tip.classList.remove('show');
    window.clearTimeout(hideIntro.tipTimer);
    window.setTimeout(() => tip.classList.add('hidden'), 350);
  });
})();
