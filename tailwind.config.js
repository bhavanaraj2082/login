/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
        dmSans: ["DM Sans", "sans-serif"],
      },
      screens: {
        xs: "400px",
      },
      colors: {
        primary: {
          50: "#ebf7ff",
          100: "#d2eaff",
          200: "#b0dbff",
          300: "#79c7ff",
          400: "#3aa6ff",
          500: "#0d7dff",
          600: "#0058ff",
          700: "#003fff",
          800: "#0032d2",
          900: "#0431a4",
          950: "#081f62",
        },
        heading: "#374151",
        content: "#4b5563",
      },
      borderWidth: {
        1: "1.5px",
      },
      fontSize: {
        "1s": "9px",
        "2s": "10px",
        "3s": "14px",
        "4s": "16px",
      },
      animation: {
        shimmer: "shimmer 2s ease-in-out infinite",
        "progress-pulse": "progress-pulse 1.5s ease-in-out infinite",
        loadingbar: "loadingbar 1s ease-out infinite",
        "spin-slow": "spin 5s linear infinite",
        "slow-bounce": "bounce 3s infinite",
        "pulse-delay": "pulse-delay 2.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-delay": "float 7s ease-in-out 1s infinite",
        "float-slow": "float 8s ease-in-out 2s infinite",
        bubble: "bubble 4s ease-in-out infinite",
        "bubble-delay": "bubble 5s ease-in-out 1s infinite",
        "bubble-slow": "bubble 6s ease-in-out 2s infinite",
        shine: "shine 3s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "progress-pulse": {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 0.5 },
          "25%": { opacity: 0.25 },
          "75%": { opacity: 0.75 },
        },
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        loadingbar: {
          "0%": { width: "20%", transform: "translateX(20%)" },
          "20%": { width: "30%", transform: "translateX(30%)" },
          "40%": { width: "60%", transform: "translateX(30%)" },
          "60%": { width: "70%", transform: "translateX(40%)" },
          "80%": { width: "80%", transform: "translateX(40%)" },
          "100%": { width: "100%", transform: "translateX(60%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        bubble: {
          "0%": { transform: "translateY(0)", opacity: 0.5 },
          "50%": { transform: "translateY(-40px)", opacity: 0.8 },
          "100%": { transform: "translateY(-80px)", opacity: 0 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shine: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
      },
    },
  },
};
