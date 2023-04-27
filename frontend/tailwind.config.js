/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontSize: {
      //   op: "1.25rem",
      // },
      boxShadow: {
        "nav-login": "5px 8px 10px -9px",
        "nav-login-hover": "6px 9px 12px -7px",
      },
      spacing: {
        initial: "0.35rem",
        "nav-middle": "3.6rem",
        "nav-end": "7.6rem",
      }
    },
  },
  plugins: [],
}