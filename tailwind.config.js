/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Game Boy Color palette - matching the Pokémon/Zelda screenshots
        "gb-black": "#000000", // True black for outlines
        "gb-darkest": "#0f0f1e",
        "gb-dark": "#2d2b3a",
        "gb-mid": "#5a5568",
        "gb-light": "#9c9ca4",
        "gb-lightest": "#f0ece3",

        // Accent colors
        "gb-gold": "#f0c000",
        "gb-blue": "#4080f0",
        "gb-red": "#e84030",
        "gb-green": "#40c040",
        "gb-sand": "#d8c870", // Pokémon path color
        "gb-grass": "#40a840", // Darker grass shade
      },
      borderWidth: {
        3: "3px",
        4: "4px",
      },
      spacing: {
        // 8px grid system
        0.5: "4px",
        1: "8px",
        2: "16px",
        3: "24px",
        4: "32px",
        5: "40px",
        6: "48px",
      },
    },
  },
  plugins: [],
};
