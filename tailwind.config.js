/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: [
        "Capsule",
        "Raleway",
        "Helvetica Neue",
        "Open Sans",
        "Roboto",
        "Lato",
        "Montserrat",
        "Source Sans Pro",
        "Noto Sans",
        "Fira Sans",
        "Ubuntu",
        "PT Sans",
        "Arial",
        "sans-serif",
      ],
      //generate fallbacks
      body: [
        "Raleway",
        "Helvetica Neue",
        "Open Sans",
        "Roboto",
        "Lato",
        "Montserrat",
        "Source Sans Pro",
        "Noto Sans",
        "Fira Sans",
        "Ubuntu",
        "PT Sans",
        "Arial",
        "sans-serif",
      ],
    },
  },
  plugins: [],
};
