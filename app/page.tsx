'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Gamepad2,
  MessageSquareText,
  Mic,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const DISCORD_API_URL = process.env.NEXT_PUBLIC_DISCORD_API || '/api/site-data';

type SiteUpdate = {
  id: string;
  newEvent: string;
  title: string;
  body: string;
  poster: string;
  submittedBy: string;
  submittedAt: string;
};

const DiscordIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M20.34 4.93A18.82 18.82 0 0 0 16.97 4l-.2.4c1.06.31 2.02.74 2.9 1.29a14.9 14.9 0 0 0-11.4 0 13.5 13.5 0 0 0 2.9-1.29L7.03 4a18.82 18.82 0 0 0-3.37.93A19.14 19.14 0 0 0 2 16.62c2.02 1.54 3.96 2.45 5.82 3.06l.52-.8a11.1 11.1 0 0 1-1.86-1.02c.16-.11.3-.23.44-.35A12.5 12.5 0 0 0 12 18.3a12.5 12.5 0 0 0 4.98-1.39c.14.12.28.24.44.35-.56.41-1.19.77-1.86 1.02l.52.8c1.86-.61 3.8-1.52 5.82-3.06.16-5.77-.99-10.35-2.66-11.69ZM9.58 14.6c-.95 0-1.72-.87-1.72-1.94 0-1.07.77-1.94 1.72-1.94.96 0 1.73.87 1.73 1.94 0 1.07-.77 1.94-1.73 1.94Zm4.84 0c-.95 0-1.73-.87-1.73-1.94 0-1.07.78-1.94 1.73-1.94.96 0 1.73.87 1.73 1.94 0 1.07-.77 1.94-1.73 1.94Z"/>
  </svg>
);

const navItems = ['About', 'Events', 'Support', 'Socials'];

const liveData = {
  activeVoiceChannels: 18,
  ongoingGames: 9,
  livePoliticalDebates: 4,
};

const supportSteps = [
  {
    title: 'Go to #support',
    description: 'Find the channel and check the pinned instructions before opening a ticket.',
    icon: <MessageSquareText className="h-5 w-5" />,
  },
  {
    title: 'Click “Create Ticket”',
    description: 'Use the ticket panel and choose the relevant issue category to route it correctly.',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: 'Provide details',
    description: 'Share your issue, relevant context, and screenshots so the moderation team can help quickly.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

const socialLinks = [
  { label: 'Discord', href: '#', icon: DiscordIcon },
  { label: 'X', href: '#', icon: Sparkles },
  { label: 'Youtube', href: '#', icon: Volume2 },
  { label: 'Instagram', href: '#', icon: BadgeCheck },
];

function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShowHeader(current < lastScrollY || current < 30);
      setLastScrollY(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: showHeader ? 0 : -120, opacity: showHeader ? 1 : 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <div className="glass flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Image src="/CFClogo.svg" alt="Citizens Of Change logo" width={40} height={40} className="rounded-xl object-cover" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-sky-200/80">Discord Server</p>
            <h1 className="text-sm font-semibold tracking-wide text-white">Citizens Of Change</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-slate-200/80 transition duration-200 hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>

        <button className="glass rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:scale-[0.98] hover:border-sky-300/40 active:scale-95">
          Join Server
        </button>
      </div>
    </motion.header>
  );
}

function Hero() {
  const [memberCount, setMemberCount] = useState(12480);

  useEffect(() => {
    const loadMemberCount = async () => {
      try {
        const response = await fetch(DISCORD_API_URL, { cache: 'no-store' });
        const data = await response.json();

        if (data?.memberCount) {
          setMemberCount(data.memberCount);
        }
      } catch (error) {
        console.error('Failed to fetch live member count:', error);
      }
    };

    loadMemberCount();
    const timer = setInterval(loadMemberCount, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pb-12 pt-36 md:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100 shadow-[0_0_25px_rgba(52,211,153,0.2)]"
      >
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,1)]" />
        <span>Live Member Count</span>
        <span className="font-semibold">{memberCount.toLocaleString()}+</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-4xl text-center"
      >
        <h2 className="text-5xl font-black tracking-[-0.06em] text-white md:text-7xl">
          Citizens Of Change
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-6 max-w-2xl text-center text-base text-slate-200/75 md:text-lg"
      >
        A high-energy Discord community for political discussion, strategic thinking, and gaming events built around bold ideas and real conversations.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
      >
        <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_18px_40px_rgba(239,68,68,0.32)] transition hover:scale-[1.02] active:scale-95">
          Join the Server
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>

        <button className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-medium text-white transition hover:scale-[0.98] active:scale-95">
          Explore Events
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-12 grid w-full max-w-5xl gap-4 md:grid-cols-3"
      >
        {[
          { label: 'Political Rooms', value: '24', icon: MessageSquareText },
          { label: 'Live Gaming Lobbies', value: '12', icon: Gamepad2 },
          { label: 'Community Events', value: '96', icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-3xl p-5 text-left">
            <Icon className="mb-4 h-5 w-5 text-sky-300" />
            <div className="text-3xl font-bold text-white">{value}</div>
            <p className="mt-2 text-sm text-slate-200/70">{label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function LiveSection() {
  const [data, setData] = useState<typeof liveData | null>(null);
  const [latestUpdate, setLatestUpdate] = useState<SiteUpdate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(DISCORD_API_URL, { cache: 'no-store' });
        const payload = await response.json();

        setLatestUpdate(payload?.updates?.[0] || null);

        setData({
          activeVoiceChannels: payload?.updates?.length ? 18 : liveData.activeVoiceChannels,
          ongoingGames: payload?.updates?.length ? 9 : liveData.ongoingGames,
          livePoliticalDebates: payload?.updates?.length ? 4 : liveData.livePoliticalDebates,
        });
      } catch (error) {
        setData(liveData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const timer = setInterval(loadData, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="events" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-sky-200/80">Live activity</p>
          <h3 className="mt-3 text-3xl font-bold text-white md:text-5xl">Events & Activity</h3>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
          Syncing with bot data
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="glass rounded-3xl p-5">
              <div className="mb-4 h-4 w-24 animate-pulse rounded-full bg-white/10" />
              <div className="mb-6 h-12 w-24 animate-pulse rounded-2xl bg-white/10" />
              <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
            </div>
          ))
        ) : (
          [
            {
              title: 'Active Voice Channels',
              value: data!.activeVoiceChannels,
              icon: Mic,
              accent: 'text-sky-300',
            },
            {
              title: 'Ongoing Games',
              value: data!.ongoingGames,
              icon: Gamepad2,
              accent: 'text-violet-300',
            },
            {
              title: 'Live Political Debates',
              value: data!.livePoliticalDebates,
              icon: MessageSquareText,
              accent: 'text-rose-300',
            },
          ].map(({ title, value, icon: Icon, accent }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-5 transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-slate-200/70">{title}</span>
                <Icon className={`h-5 w-5 ${accent}`} />
              </div>
              <div className="text-4xl font-bold text-white">{value}</div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200/80">
                Status: Coordinated and active now
              </div>
            </motion.div>
          ))
        )}
      </div>

      {latestUpdate && (
        <div className="glass mt-5 rounded-3xl p-5">
          <div className="flex flex-col gap-5">
            <img
              src={latestUpdate.poster}
              alt={latestUpdate.title}
              className="w-full cursor-pointer rounded-2xl object-cover transition hover:opacity-90"
              style={{ minHeight: '280px' }}
              onClick={() => {
                const lightbox = document.createElement('div');
                lightbox.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4';
                lightbox.onclick = () => lightbox.remove();
                lightbox.innerHTML = `<img src="${latestUpdate.poster}" class="max-w-full max-h-[90vh] object-contain rounded-lg" alt="${latestUpdate.title}">`;
                document.body.appendChild(lightbox);
              }}
            />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/80">Latest Discord update</p>
              <h4 className="mt-2 text-2xl font-bold text-white">{latestUpdate.title}</h4>
              <p className="mt-2 text-sm text-slate-200/70">{latestUpdate.body}</p>
              <p className="mt-3 text-xs text-slate-300/50">By {latestUpdate.submittedBy}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SupportSection() {
  return (
    <section id="support" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-sky-200/80">Support</p>
        <h3 className="mt-3 text-3xl font-bold text-white md:text-5xl">How to open a ticket</h3>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {supportSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass group relative rounded-3xl p-5 transition hover:-translate-y-1"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sky-200">
                {step.icon}
              </span>
              <span className="text-xs uppercase tracking-[0.24em] text-slate-300/60">0{index + 1}</span>
            </div>
            <h4 className="text-xl font-semibold text-white">{step.title}</h4>
            <p className="mt-3 text-sm leading-7 text-slate-200/70">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="socials" className="mx-auto max-w-6xl px-4 pb-16 pt-10">
      <div className="glass flex flex-col items-center justify-between gap-6 rounded-[28px] px-6 py-6 md:flex-row">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/CFClogo.svg" alt="Citizens Of Change" width={36} height={36} className="rounded-xl object-cover" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sky-200/75">Citizens Of Change</p>
              <p className="text-sm text-slate-300/80">Discord • Politics • Gaming</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="glass inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-slate-100 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:border-sky-300/40"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-50">
      <div className="mesh-bg" />
      <Header />
      <Hero />
      <LiveSection />
      <SupportSection />
      <Footer />
    </main>
  );
}
