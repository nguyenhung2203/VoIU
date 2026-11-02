/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        strace: {
          dark: '#0B3D2E',
          deep: '#115740',
          primary: '#208456',
          fresh: '#3AA66B',
          bg: '#F6F8F7',
          surface: '#FFFFFF',
          border: '#E2E9E5',
          text: '#17231D',
          muted: '#69776F',
          subtle: '#94A39A',
          accentGreen: '#E5F4EA',
          accentBlue: '#E7F2FC',
          accentYellow: '#FFF4D9',
          accentOrange: '#FFF0DF',
          success: '#24965D',
          warning: '#E6A23C',
          danger: '#D9534F',
          info: '#3478C0',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        cardHover: '0 10px 15px -3px rgba(11, 61, 46, 0.08), 0 4px 6px -2px rgba(11, 61, 46, 0.04)',
        drawer: '-4px 0 24px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}
