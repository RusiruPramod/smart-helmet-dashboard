/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.8s ease-out forwards',
        'fadeUp': 'fadeUp 0.6s ease-out forwards',
        'fadeDown': 'fadeDown 0.6s ease-out forwards',
        'fadeLeft': 'fadeLeft 0.6s ease-out forwards',
        'fadeRight': 'fadeRight 0.6s ease-out forwards',
        'bounceIn': 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'growBar': 'growBar 1.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveBar': 'waveBar 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'to': { opacity: '1' }
        },
        fadeUp: {
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeDown: {
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeLeft: {
          'to': { 
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        fadeRight: {
          'to': { 
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        bounceIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.3)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)'
          },
          '70%': { 
            transform: 'scale(0.9)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        growBar: {
          'to': { transform: 'scaleY(1)' }
        },
        waveBar: {
          '0%, 100%': { 
            transform: 'scaleY(0.3)',
            opacity: '0.5'
          },
          '50%': { 
            transform: 'scaleY(1)',
            opacity: '1'
          }
        }
      }
    },
  },
  plugins: [],
}
