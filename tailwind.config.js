/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandTeal: "#11999E",
        brandYellow: "#f59e0b",
      },
    },
  },
  plugins: [],
}