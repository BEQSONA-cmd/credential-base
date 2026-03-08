/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
theme: {
    extend: {
      colors: {
      }
    },
  },
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },

  plugins: [],
};