/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts}", "node_modules/daisyui/**/*.{html,js,tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
