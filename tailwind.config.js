/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF7',
        chalk: '#F0F0EA',
        ink: { DEFAULT: '#111210', 2: '#45473F', 3: '#6E7066' },
        line: { DEFAULT: 'rgba(17,18,16,0.12)', strong: 'rgba(17,18,16,0.28)' },
        go: { DEFAULT: '#16A34A', deep: '#0B6B32', tint: '#DCF5E3', ink: '#063D1D' },
        miss: '#D9480F',
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { page: '1320px' },
      keyframes: {
        pop: { '0%': { transform: 'translateY(8px) scale(.97)', opacity: 0 }, '100%': { transform: 'none', opacity: 1 } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.25 } },
      },
      animation: { pop: 'pop .5s cubic-bezier(.2,.8,.2,1) both', blink: 'blink 1.6s ease-in-out infinite' },
    },
  },
  plugins: [],
}
