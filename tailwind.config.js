/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#071e13',
        'bg-mid': '#0c2317',
        'bg-up':  '#112b1c',
        accent:   '#5dbb63',
        sub:      '#e87a9f',
        text:     '#edf7ef',
        muted:    '#a8c8b4',
        water:    '#0d3320',
        leaf:     '#2d7a4a',
        rain:     '#7ec8e3',
        gold:     '#f5c842',
      },
      fontFamily: {
        fredoka: ['"Fredoka One"', '"M PLUS Rounded 1c"', 'cursive'],
        nunito:  ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
