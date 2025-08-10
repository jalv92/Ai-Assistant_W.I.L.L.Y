/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        willy: {
          primary: '#00ffff',
          secondary: '#0080ff',
          success: '#00ff00',
          error: '#ff0000',
          dark: '#0a0a0a',
          darker: '#1a1a2e',
          light: '#ffffff',
          gray: {
            100: '#f0f0f0',
            200: '#e0e0e0',
            300: '#c0c0c0',
            400: '#a0a0a0',
            500: '#808080',
            600: '#606060',
            700: '#404040',
            800: '#202020',
            900: '#101010'
          }
        }
      },
      fontFamily: {
        'futuristic': ['Orbitron', 'sans-serif'],
        'tech': ['Share Tech Mono', 'monospace'],
        'display': ['Exo 2', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'flicker': 'flicker 0.5s ease-in-out infinite',
        'rotate-slow': 'rotate 20s linear infinite'
      },
      keyframes: {
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3), 0 0 60px rgba(0, 255, 255, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.5), 0 0 90px rgba(0, 255, 255, 0.3)' 
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'willy-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        'hologram': 'linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.1) 50%, transparent)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}