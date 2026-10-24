/** ============================================================
 *  Tailwind config — Supreme Painting & Decorating Ltd
 *  Brand colours + fonts live here. Change them once, rebuild
 *  (npm run build) and the whole site updates.
 *  ============================================================ */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#171512', // main dark background (warm graphite)
          800: '#1E1C18',
          700: '#22201C', // panels on dark
          600: '#2E2B25',
          500: '#3C3830',
        },
        gold: {
          50: '#FBF5E1',
          100: '#F6E7B4',
          200: '#F1CF6B', // highlight gold
          300: '#E6BC48',
          DEFAULT: '#D4A72C', // brand gold
          500: '#D4A72C',
          600: '#A87A1C', // deep gold (hover / text on light)
          700: '#7E5B14',
        },
        paint: '#FBFAF7', // fresh-paint white (light sections)
        stone: {
          DEFAULT: '#ECE8E0', // dust-sheet stone
          dark: '#D9D3C7',
        },
        muted: {
          DEFAULT: '#5E5A52', // body text on light
          dark: '#B9B2A4', // body text on dark
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '1200px',
      },
      boxShadow: {
        gold: '0 8px 32px -8px rgba(212,167,44,.45)',
        lift: '0 24px 48px -24px rgba(23,21,18,.35)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        twinkle: {
          '0%,100%': { opacity: '0', transform: 'scale(.4) rotate(0deg)' },
          '40%,60%': { opacity: '1', transform: 'scale(1) rotate(45deg)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        bob: 'bob 5s ease-in-out infinite',
        'bob-slow': 'bob 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
