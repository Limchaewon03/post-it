/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'stick-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(1.2) translateY(-20px) rotate(4deg)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(0.97) translateY(2px) rotate(-1deg)',
          },
          '75%': {
            transform: 'scale(1.02) translateY(-1px) rotate(1deg)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0) rotate(0deg)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'stick-in': 'stick-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      boxShadow: {
        'postit': '2px 4px 12px -2px rgba(0, 0, 0, 0.12), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'postit-hover': '4px 8px 18px -2px rgba(0, 0, 0, 0.18), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        'postit-dark': '0 4px 14px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
