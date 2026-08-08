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
          50: '#eef4ff', 100: '#dbe7fe', 200: '#bdd4fe', 300: '#8fb8fd',
          400: '#5a94fa', 500: '#3170f0', 600: '#2158e0', 700: '#1c46b8',
          800: '#1c3b93', 900: '#3C376D', 950: '#152048',
        },
        cyan: {
          50: '#eef4ff', 100: '#dbe7fe', 200: '#bdd4fe', 300: '#8fb8fd',
          400: '#5a94fa', 500: '#3170f0', 600: '#2158e0', 700: '#1c46b8',
          800: '#1c3b93', 900: '#3C376D',
        },
        sky: {
          50: '#eef4ff', 100: '#dbe7fe', 200: '#bdd4fe', 300: '#8fb8fd',
          400: '#5a94fa', 500: '#3170f0', 600: '#2158e0', 700: '#1c46b8',
          800: '#1c3b93', 900: '#3C376D',
        },
        indigo: {
          50: '#eef4ff', 100: '#dbe7fe', 200: '#bdd4fe', 300: '#8fb8fd',
          400: '#5a94fa', 500: '#3170f0', 600: '#2158e0', 700: '#1c46b8',
          800: '#1c3b93', 900: '#3C376D',
        },
        violet: {
          50: '#eef4ff', 100: '#dbe7fe', 200: '#bdd4fe', 300: '#8fb8fd',
          400: '#5a94fa', 500: '#3170f0', 600: '#2158e0', 700: '#1c46b8',
          800: '#1c3b93', 900: '#3C376D',
        },
        purple: {
          50: '#eef4ff', 100: '#dbe7fe', 200: '#bdd4fe', 300: '#8fb8fd',
          400: '#5a94fa', 500: '#3170f0', 600: '#2158e0', 700: '#1c46b8',
          800: '#1c3b93', 900: '#3C376D',
        },
        amber: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f',
        },
        primary: {
          50: '#eef4ff', 100: '#dbe7fe', 200: '#bdd4fe', 300: '#8fb8fd',
          400: '#5a94fa', 500: '#3170f0', 600: '#2158e0', 700: '#1c46b8',
          800: '#1c3b93', 900: '#3C376D', 950: '#152048',
        },
        secondary: {
          50: '#eef4ff', 100: '#dbe7fe', 200: '#bdd4fe', 300: '#8fb8fd',
          400: '#5a94fa', 500: '#3170f0', 600: '#2158e0', 700: '#1c46b8',
          800: '#1c3b93', 900: '#3C376D',
        },
        accent: {
          50: '#eef4ff', 100: '#dbe7fe', 200: '#bdd4fe', 300: '#8fb8fd',
          400: '#5a94fa', 500: '#3170f0', 600: '#2158e0', 700: '#1c46b8',
          800: '#1c3b93', 900: '#3C376D',
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
        'grid-pattern': "linear-gradient(rgba(49, 112, 240, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(49, 112, 240, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      }
    },
  },
  plugins: [],
}