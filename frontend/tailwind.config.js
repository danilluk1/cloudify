/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Inter"],
    },
    borderRadius: {
      50: "50px",
      30: "30px",
    },
  },
  plugins: [],
};
