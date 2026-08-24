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

setInterval(() => {
  updateGallery(galleryIndex + 1);
}, 4200);

let featuredIndex = 0;
const featuredLen = featuredSlides.length;

const updateFeatured = (index) => {
  featuredIndex = (index + featuredLen) % featuredLen;
  featuredTrack.style.transform = `translateX(-${featuredIndex * 100}%)`;
};

featuredPrev.addEventListener('click', () => {
  updateFeatured(featuredIndex - 1);
});

featuredNext.addEventListener('click', () => {
  updateFeatured(featuredIndex + 1);
});

setInterval(() => {
  updateFeatured(featuredIndex + 1);
}, 5000);

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
