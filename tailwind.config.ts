/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dot1: {
          "0%, 80%, 100%": { opacity: "0" },
          "40%": { opacity: "1" },
        },
        dot2: {
          "0%, 40%, 100%": { opacity: "0" },
          "60%": { opacity: "1" },
        },
        dot3: {
          "0%, 60%, 100%": { opacity: "0" },
          "80%": { opacity: "1" },
        },
      },
      animation: {
        dot1: "dot1 1.4s infinite ease-in-out",
        dot2: "dot2 1.4s infinite ease-in-out",
        dot3: "dot3 1.4s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
