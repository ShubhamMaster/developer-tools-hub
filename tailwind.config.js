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
        panel: '#ffffff',
        panelSoft: '#f3f7fb',
        accent: '#0f766e',
        accentSoft: '#ccfbf1',
      },
    },
  },
  plugins: [],
};
