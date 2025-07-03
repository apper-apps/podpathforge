/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B21B6',
        secondary: '#EC4899',
        accent: '#F59E0B',
        surface: '#F3F4F6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5B21B6 0%, #EC4899 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
        'gradient-surface': 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}