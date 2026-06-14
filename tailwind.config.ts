import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Calm, trustworthy "care teal" — the single vivid accent (replaces the
        // reference site's orange). High contrast for older readers; reads as
        // health, safety, and dignity rather than alarm.
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Warm-cool dark used for hero, feature bands, CTA, and footer.
        night: {
          DEFAULT: '#0c272d',
          soft: '#123942',
          muted: '#1c4954',
          line: 'rgba(255,255,255,0.12)',
        },
        // Soft tinted light section background.
        cream: '#eef5f3',
        surface: '#fbfdfc',
        ink: {
          DEFAULT: '#122a2c',
          soft: '#33484a',
          muted: '#5d7173',
        },
        // Secondary supportive accent for "value" badges only.
        sage: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,42,44,0.04), 0 8px 24px rgba(18,42,44,0.06)',
        lift: '0 12px 32px rgba(18,42,44,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
