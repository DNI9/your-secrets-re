/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#131020',
      black2: '#1E1E2E',
      white: '#D9E0EE',
      blue: '#96CDFB',
      gray: '#302D41',
      gray2: '#575268',
      red: '#E8A2AF',
    },
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      serif: [...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono],
    },
    extend: {},
  },
  plugins: [],
}
