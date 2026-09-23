/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          lime: '#bbf246',
          bright: '#a3e635',
          glow: '#84cc16',
          dark: '#4d7c0f',
          subtle: 'rgba(187, 242, 70, 0.15)'
        },
        'lime-accent': '#bbf246',
        'lime-bright': '#a3e635',
        'lime-subtle': 'rgba(187, 242, 70, 0.15)',
        dark: {
          bg: '#0B0F17',
          card: '#131926',
          'card-hover': '#182132',
          surface: '#1A2234',
          border: '#1F293D',
          borderLight: '#2A364F',
          muted: '#64748B',
          text: '#F8FAFC',
          subtext: '#94A3B8'
        },
        brand: {
          navy: '#0B1F3A',
          'navy-dark': '#061224',
          'navy-light': '#142E54',
          blue: '#155EEF',
          'blue-hover': '#0B4ACB',
          'blue-subtle': '#EFF8FF',
          bg: '#F7F9FC',
          card: '#FFFFFF',
          text: '#101828',
          'text-secondary': '#667085',
          'text-muted': '#98A2B3',
          border: '#E4E7EC',
          'border-subtle': '#F2F4F7',
          success: '#12B76A',
          'success-subtle': '#ECFDF3',
          warning: '#F79009',
          'warning-subtle': '#FFFAEB',
          danger: '#F04438',
          'danger-subtle': '#FEF3F2',
          info: '#2E90FA',
          'info-subtle': '#EFF8FF',
          accent: '#7F56D9',
          'accent-subtle': '#F9F5FF',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.25), 0 1px 2px 0 rgba(0, 0, 0, 0.15)',
        'card-hover': '0 8px 16px -2px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'lime-glow': '0 0 20px -2px rgba(187, 242, 70, 0.45)',
        'popover': '0 12px 24px -4px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
        'modal': '0 25px 35px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'card': '16px',
        'pill': '9999px',
        'input': '10px',
      }
    },
  },
  plugins: [],
}
