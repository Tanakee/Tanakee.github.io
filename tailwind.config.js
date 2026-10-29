/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pond: {
          bg: '#faf9f4',
          surface: '#ffffff',
          green: '#4f9d5a',
          greenDark: '#2f6b3a',
          pink: '#e87a9f',
          text: '#233229',
          muted: '#6b7a70',
          line: '#e7e3d8',
        },
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(47, 107, 58, 0.25)',
        card: '0 12px 30px -12px rgba(35, 50, 41, 0.12)',
      },
      fontFamily: {
        display: ['"M PLUS Rounded 1c"', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
