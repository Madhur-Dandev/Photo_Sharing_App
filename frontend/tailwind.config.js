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
        "profile-img": "0px 5px 40px 5px"
      },
      spacing: {
        "initial": "0.35rem",
        "nav-middle": "3.6rem",
        "nav-end": "7.6rem",
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
      keyframes: {
        shake: {
          "0%, 100%": {
            transform: "translateX(0px)"
          },
          "25%": {
            transform: "translateX(-5px)"
          },
          "50%": {
            transform: "translateX(5px)"
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1"
          }
        }
      },
      animation: {
        "auth-field-shake": "shake .1s ease-in 2",
        "fadeIn": "fadeIn .1s ease-in forwards"
      }
    },
  },
  plugins: [],
}