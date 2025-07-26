/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,vue,ts}",
    "./src/layouts/**/*.vue",
    "./src/pages/**/*.vue",
    "./src/plugins/**/*.{js,ts}",
    "./src/features/**/*.{js,vue,ts}",
    "./src/app.vue",
    "./src/error.vue",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    screens: {
      xs: "320px", // Smartwatch and very small devices
      sm: "640px", // Mobile devices
      md: "768px", // Tablets
      lg: "1024px", // Laptops
      xl: "1280px", // Desktops
      "2xl": "1536px", // Large screens
      watch: { max: "319px" }, // Smartwatch specific
      mobile: { min: "320px", max: "639px" }, // Mobile specific
    },
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      fontSize: {
        xxs: ["0.625rem", { lineHeight: "0.75rem" }],
        watch: ["0.75rem", { lineHeight: "1rem" }],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        breathing: "breathing 4s ease-in-out infinite",
        "scroll-left": "scrollLeft 30s linear infinite",
        "scroll-testimonials": "scrollTestimonials 40s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        breathing: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        scrollLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scrollTestimonials: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      minHeight: {
        "screen-safe":
          "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
      },
      maxWidth: {
        watch: "280px",
      },
    },
  },
  plugins: [],
};
