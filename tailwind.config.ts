import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#040b17',
        panel: '#0f172a',
        accent: '#d9485f',
        sky: '#81d4ff',
        violet: '#8b5cf6',
        mint: '#6ee7b7',
      },
      boxShadow: {
        glow: '0 0 30px rgba(129, 212, 255, 0.35)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
