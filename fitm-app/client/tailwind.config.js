const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primaryDark: "#1C1D1E", // #26282B #171717
        accentDark: "#262626",
        primaryGray: "#3f4042",
        darkerWhite: "#C4C4C4",
        accentGray: "#5e6063",
        primaryBlue: "#1B9CFC",
        primaryGreen: "#00FF85",
        accentGreen: "#25F792",
        primaryYellow: "#FDFF90",
        primaryPink: "#F19AFF",
        accentPink: "#f8ccff",
        accentBlue: "#25CCF7",
        testColor: "#393939",
        accentTestColor: "#464646",
        primaryWhite: "#F3F3F3",
        accentWhite: "#ededed",
        primaryBgWhite: "#ffffff",
        darkenedColor: "rgba(0,0,0,0.2)",
      },
      maxWidth: {
        xxs: "250px",
      },
      padding: {
        "10p": "10%",
      },
      dropShadow: {
        solidSm: "1px 1px 0 black",
        solidMd: "3px 4px 0 black",
      },
    },
  },
  plugins: [],
};
