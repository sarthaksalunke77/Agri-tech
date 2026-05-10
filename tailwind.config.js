/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#065A82',
        secondary: '#1C7293',
        accent: '#00A896',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'drop': 'drop 1.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        drop: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(10px)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
