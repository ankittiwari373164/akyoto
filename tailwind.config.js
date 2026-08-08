/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PGST-style signature blue — used for CTAs, links, active states
        blue: {
          50: '#f5f5fa', 100: '#e8e7f3', 200: '#cecce5', 300: '#aba7d3',
          400: '#7e77bb', 500: '#5a52a3', 600: '#474181', 700: '#423c77',
          800: '#3f3a72', 900: '#3C376D', 950: '#2d2952',
        },
        cyan: {
          50: '#f5f5fa', 100: '#e8e7f3', 200: '#cecce5', 300: '#aba7d3',
          400: '#7e77bb', 500: '#5a52a3', 600: '#474181', 700: '#423c77',
          800: '#3f3a72', 900: '#3C376D', 950: '#2d2952',
        },
        sky: {
          50: '#f5f5fa', 100: '#e8e7f3', 200: '#cecce5', 300: '#aba7d3',
          400: '#7e77bb', 500: '#5a52a3', 600: '#474181', 700: '#423c77',
          800: '#3f3a72', 900: '#3C376D', 950: '#2d2952',
        },
        indigo: {
          50: '#f5f5fa', 100: '#e8e7f3', 200: '#cecce5', 300: '#aba7d3',
          400: '#7e77bb', 500: '#5a52a3', 600: '#474181', 700: '#423c77',
          800: '#3f3a72', 900: '#3C376D', 950: '#2d2952',
        },
        violet: {
          50: '#f5f5fa', 100: '#e8e7f3', 200: '#cecce5', 300: '#aba7d3',
          400: '#7e77bb', 500: '#5a52a3', 600: '#474181', 700: '#423c77',
          800: '#3f3a72', 900: '#3C376D', 950: '#2d2952',
        },
        purple: {
          50: '#f5f5fa', 100: '#e8e7f3', 200: '#cecce5', 300: '#aba7d3',
          400: '#7e77bb', 500: '#5a52a3', 600: '#474181', 700: '#423c77',
          800: '#3f3a72', 900: '#3C376D', 950: '#2d2952',
        },
        amber: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f',
        },
        primary: {
          50: '#f5f5fa', 100: '#e8e7f3', 200: '#cecce5', 300: '#aba7d3',
          400: '#7e77bb', 500: '#5a52a3', 600: '#474181', 700: '#423c77',
          800: '#3f3a72', 900: '#3C376D', 950: '#2d2952',
        },
        secondary: {
          50: '#f5f5fa', 100: '#e8e7f3', 200: '#cecce5', 300: '#aba7d3',
          400: '#7e77bb', 500: '#5a52a3', 600: '#474181', 700: '#423c77',
          800: '#3f3a72', 900: '#3C376D', 950: '#2d2952',
        },
        accent: {
          50: '#f5f5fa', 100: '#e8e7f3', 200: '#cecce5', 300: '#aba7d3',
          400: '#7e77bb', 500: '#5a52a3', 600: '#474181', 700: '#423c77',
          800: '#3f3a72', 900: '#3C376D', 950: '#2d2952',
        },
        dark: {
          900: '#0f1729',
          800: '#16213b',
          700: '#1e2c4d',
          600: '#293b66',
        }
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(60, 55, 109, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(60, 55, 109, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      }
    },
  },
  plugins: [],
}