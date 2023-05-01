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
        "nav-login": "0px 8px 10px -9px",
        "nav-login-hover": "0px 9px 15px -7px",
      },
      spacing: {
        "initial": "0.35rem",
        "nav-middle": "3.65rem",
        "nav-end": "7.65rem",
        "bottom-first": "1.75rem",
        "bottom-middle": "7.85rem",
        "bottom-end": "14rem"
      },
      height: {
        heroSectionLg: "500px"
      },
      fontFamily: {
        logoFont: ["Bruno Ace SC"]
      },
    },
  },
  plugins: [],
}