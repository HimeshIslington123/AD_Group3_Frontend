/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        primaryLight: "#1E293B",
        background: "#F8FAFC",
        card: "#FFFFFF",
        border: "#E2E8F0",
        textMain: "#0F172A",
        textSecondary: "#64748B",
      },
    },
  },
  plugins: [],
};