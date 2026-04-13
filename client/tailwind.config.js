export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D85A30",
        secondary: "#1A3A6B",
        background: "#FFF8F0",
        accent: "#F3B971",
        border: "#E7D2BC",
        surface: "#FFFFFF",
        muted: "#6E6254",
        success: "#2E8B57",
        danger: "#B42318"
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"]
      },
      boxShadow: {
        panel: "0 18px 40px rgba(98, 65, 35, 0.12)"
      }
    }
  },
  plugins: []
};
