/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        panel: '#111827',
        panelSoft: '#1f2937',
        accent: '#22c55e',
        accentSoft: '#14532d',
      },
    },
  },
  plugins: [],
};
