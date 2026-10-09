/** @type {import('tailwindcss').Config} */

// Agro M24 Market design tokens: deep agricultural green as the brand anchor,
// a warm off-white canvas, navy "ink" neutrals and a small harvest-amber accent.
const brand = {
  50: '#eef7f1',
  100: '#d5ecdd',
  200: '#acd9bd',
  300: '#7bbf97',
  400: '#4ca171',
  500: '#2d8555',
  600: '#1b6b3d',
  700: '#165834',
  800: '#13462b',
  900: '#0f3a24',
  950: '#072014',
};

const ink = {
  50: '#f4f6f9',
  100: '#e6eaf0',
  200: '#c9d1dd',
  300: '#9aa6b8',
  400: '#6a7890',
  500: '#4a576d',
  600: '#334056',
  700: '#222e42',
  800: '#162033',
  900: '#0d1524',
  950: '#070c17',
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // `brand`, `brand-dark` and `brand-light` are used throughout the app;
        // they now resolve to the new palette, alongside the full 50–950 scale.
        brand: {
          ...brand,
          light: brand[500],
          DEFAULT: brand[600],
          dark: brand[700],
        },
        // Existing green/emerald/gray utilities follow the new palette so every
        // screen picks up the new style without rewriting each class.
        green: brand,
        emerald: brand,
        gray: ink,
        ink,
        harvest: {
          50: '#fff8ec',
          100: '#fdecc8',
          200: '#fbd88f',
          300: '#f7bf55',
          400: '#f0a52c',
          500: '#de8a16',
          600: '#bf6a0f',
          700: '#974c10',
        },
        canvas: '#faf8f4',
        surface: '#ffffff',
        line: {
          DEFAULT: '#e8e4db',
          strong: '#d6d1c4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgb(13 21 36 / 0.04), 0 4px 16px -4px rgb(13 21 36 / 0.06)',
        lift: '0 2px 4px rgb(13 21 36 / 0.04), 0 18px 40px -12px rgb(13 21 36 / 0.18)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1240px',
        },
      },
    },
  },
  plugins: [],
}
