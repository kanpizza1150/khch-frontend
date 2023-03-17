/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Prompt", "Arial", "sans-serif"],
      },
      gridTemplateColumns: {
        main: "300px 1fr",
      },
      backgroundImage: (theme) => ({
        loginBg: "linear-gradient(250.15deg, #9AACD1 -15.43%, #C8D5E0 50.09%, #E1E8ED 98.69%);",
        mainBg:
          "linear-gradient(269.14deg, #C1CFDE 2.76%, rgba(193, 207, 222, 0.630187) 14.47%, rgba(193, 207, 222, 0) 104.65%);",
      }),
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
