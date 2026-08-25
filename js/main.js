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
const themeToggle = document.getElementById('themeToggle');
const themeToggleIcon = themeToggle.querySelector('.theme-toggle__icon');
const galleryTrack = document.getElementById('galleryTrack');
const gallerySlides = [...document.querySelectorAll('.gallery-slide')];
const galleryButtons = [...document.querySelectorAll('[data-gallery-dir]')];
const featuredTrack = document.getElementById('featuredTrack');
const featuredSlides = [...document.querySelectorAll('.featured-slide')];
const featuredPrev = document.querySelector('.featured-arrow.prev');
const featuredNext = document.querySelector('.featured-arrow.next');
const introOverlay = document.getElementById('introOverlay');
const introCta = document.querySelector('.intro-cta');
const modal = document.getElementById('detailModal');
const modalContent = modal.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const infoCards = document.querySelectorAll('.info-card');
const infoTip = document.getElementById('infoTip');
const tipClose = document.querySelector('.tip-close');

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
window.addEventListener('scroll', () => {
  const current = window.scrollY || 0;
  if (current > lastScrollTop && current > 80) {
    header.classList.add('is-hidden');
  } else {
    header.classList.remove('is-hidden');
  }

  if (current > 280) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }

  lastScrollTop = current;
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const sunIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"></path>
  </svg>
`;

const moonIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 15.5A7.5 7.5 0 0 1 8.5 4a7.5 7.5 0 1 0 11.5 11.5Z"></path>
  </svg>
`;

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;
  themeToggleIcon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  localStorage.setItem('cfc-theme', theme);
};

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('cfc-theme');
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

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

let galleryIndex = 0;
const galleryLen = gallerySlides.length;

const updateGallery = (index) => {
  if (!galleryTrack || !gallerySlides.length) return;
  galleryIndex = (index + galleryLen) % galleryLen;
  galleryTrack.style.transform = `translateX(-${galleryIndex * 100}%)`;
  gallerySlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === galleryIndex);
  });
};

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const dir = Number(button.dataset.galleryDir || 1);
    updateGallery(galleryIndex + dir);
  });
});

if (galleryTrack && gallerySlides.length > 1) {
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
};

if (featuredPrev) {
  featuredPrev.addEventListener('click', () => {
    updateFeatured(featuredIndex - 1);
  });
}

if (featuredNext) {
  featuredNext.addEventListener('click', () => {
    updateFeatured(featuredIndex + 1);
  });
}

if (featuredTrack && featuredSlides.length > 1) {
  setInterval(() => {
    updateFeatured(featuredIndex + 1);
  }, 5000);
}

const openModal = (card) => {
  const title = card.dataset.title || card.dataset.name || 'Community update';
  const description = card.dataset.description || 'More details coming soon.';
  const action = card.dataset.action || 'Learn more';
  const role = card.dataset.role || '';
  const badge = card.dataset.type ? card.dataset.type.charAt(0).toUpperCase() + card.dataset.type.slice(1) : 'Details';
  const discord = card.dataset.discord || 'https://discord.com';
  const instagram = card.dataset.instagram || 'https://instagram.com';
  const email = card.dataset.email || 'mailto:hello@citizensofchange.in';

  modalContent.innerHTML = `
    <span class="modal-badge">${badge}</span>
    <h3 id="modalTitle">${title}</h3>
    ${role ? `<p><strong>${role}</strong></p>` : ''}
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

infoCards.forEach((card) => {
  card.addEventListener('click', () => openModal(card));
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

if (introOverlay && introCta) {
  const hideIntro = () => {
    introOverlay.classList.add('is-hidden');
    document.body.classList.add('intro-complete');
  };

  introCta.addEventListener('click', hideIntro);
}

if (infoTip && tipClose) {
  const showInfoTip = () => {
    infoTip.classList.remove('hidden');
    window.clearTimeout(showInfoTip.timer);
    showInfoTip.timer = window.setTimeout(() => {
      infoTip.classList.add('hidden');
    }, 3000);
  };

  tipClose.addEventListener('click', () => {
    infoTip.classList.add('hidden');
    window.clearTimeout(showInfoTip.timer);
  });

  showInfoTip();
}

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
