/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#7C3AED',
          green: '#84CC16',
          darkGreen: '#65A30D',
        },
      },
    },
  },
  plugins: [],
}

