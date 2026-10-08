/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sinhala: ["Noto Sans Sinhala", "sans-serif"],
        tamil: ["Noto Sans Tamil", "sans-serif"],
        english: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
