const plugin = require("tailwindcss/plugin")
import colors from "./src/common/constants/tailwind-colors"

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Ensure these extensions are included
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          xl: "1440px",
        },
      },
      colors: {
        ...colors,
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        geist: ["Geist", "sans-serif"],
      },
      screens: {
        lg: "1024px",
        xl: "1336px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".regular-display-2xl": {
          fontWeight: "400",
          fontSize: "4.5rem",
          lineHeight: "5.625rem",
        },
        ".medium-display-2xl": {
          fontWeight: "500",
          fontSize: "4.5rem",
          lineHeight: "5.625rem",
        },
        ".semibold-display-2xl": {
          fontWeight: "600",
          fontSize: "4.5rem",
          lineHeight: "5.625rem",
        },
        ".bold-display-2xl": {
          fontWeight: "700",
          fontSize: "4.5rem",
          lineHeight: "5.625rem",
        },

        ".regular-display-xl": {
          fontWeight: "400",
          fontSize: " 3.75rem",
          lineHeight: "4.5rem",
        },
        ".medium-display-xl": {
          fontWeight: "500",
          fontSize: " 3.75rem",
          lineHeight: "4.5rem",
        },
        ".semibold-display-xl": {
          fontWeight: "600",
          fontSize: " 3.75rem",
          lineHeight: "4.5rem",
        },
        ".bold-display-xl": {
          fontWeight: "700",
          fontSize: " 3.75rem",
          lineHeight: "4.5rem",
        },

        ".regular-display-lg": {
          fontWeight: "400",
          fontSize: "3rem",
          lineHeight: "3.75rem",
        },
        ".medium-display-lg": {
          fontWeight: "500",
          fontSize: "3rem",
          lineHeight: "3.75rem",
        },
        ".semibold-display-lg": {
          fontWeight: "600",
          fontSize: "3rem",
          lineHeight: "3.75rem",
        },
        ".bold-display-lg": {
          fontWeight: "700",
          fontSize: "3rem",
          lineHeight: "3.75rem",
        },

        ".regular-display-md": {
          fontWeight: "400",
          fontSize: "2.25rem",
          lineHeight: "2.75rem",
        },
        ".medium-display-md": {
          fontWeight: "500",
          fontSize: "2.25rem",
          lineHeight: "2.75rem",
        },
        ".semibold-display-md": {
          fontWeight: "600",
          fontSize: "2.25rem",
          lineHeight: "2.75rem",
        },
        ".bold-display-md": {
          fontWeight: "700",
          fontSize: "2.25rem",
          lineHeight: "2.75rem",
        },

        ".regular-display-sm": {
          fontWeight: "400",
          fontSize: "1.875rem",
          lineHeight: "2.375rem",
        },
        ".medium-display-sm": {
          fontWeight: "500",
          fontSize: "1.875rem",
          lineHeight: "2.375rem",
        },
        ".semibold-display-sm": {
          fontWeight: "600",
          fontSize: "1.875rem",
          lineHeight: "2.375rem",
        },
        ".bold-display-sm": {
          fontWeight: "700",
          fontSize: "1.875rem",
          lineHeight: "2.375rem",
        },

        ".regular-display-xs": {
          fontWeight: "400",
          fontSize: "1.5rem",
          lineHeight: "2rem",
        },
        ".medium-display-xs": {
          fontWeight: "500",
          fontSize: "1.5rem",
          lineHeight: "2rem",
        },
        ".semibold-display-xs": {
          fontWeight: "600",
          fontSize: "1.5rem",
          lineHeight: "2rem",
        },
        ".bold-display-xs": {
          fontWeight: "700",
          fontSize: "1.5rem",
          lineHeight: "2rem",
        },

        ".regular-text-xl": {
          fontWeight: "400",
          fontSize: "1.25rem",
          lineHeight: "1.875rem",
        },
        ".medium-text-xl": {
          fontWeight: "500",
          fontSize: "1.25rem",
          lineHeight: "1.875rem",
        },
        ".semibold-text-xl": {
          fontWeight: "600",
          fontSize: "1.25rem",
          lineHeight: "1.875rem",
        },
        ".bold-text-xl": {
          fontWeight: "700",
          fontSize: "1.25rem",
          lineHeight: "1.875rem",
        },

        ".regular-text-lg": {
          fontWeight: "400",
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
        },
        ".medium-text-lg": {
          fontWeight: "500",
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
        },
        ".semibold-text-lg": {
          fontWeight: "600",
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
        },
        ".bold-text-lg": {
          fontWeight: "700",
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
        },

        ".regular-text-md": {
          fontWeight: "400",
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },
        ".medium-text-md": {
          fontWeight: "500",
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },
        ".semibold-text-md": {
          fontWeight: "600",
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },
        ".bold-text-md": {
          fontWeight: "700",
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },

        ".regular-text-sm": {
          fontWeight: "400",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        },
        ".medium-text-sm": {
          fontWeight: "500",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        },
        ".semibold-text-sm": {
          fontWeight: "600",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        },
        ".bold-text-sm": {
          fontWeight: "700",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        },

        ".regular-text-xs": {
          fontWeight: "400",
          fontSize: "0.75rem",
          lineHeight: "1.125rem",
        },
        ".medium-text-xs": {
          fontWeight: "500",
          fontSize: "0.75rem",
          lineHeight: "1.125rem",
        },
        ".semibold-text-xs": {
          fontWeight: "600",
          fontSize: "0.75rem",
          lineHeight: "1.125rem",
        },
        ".bold-text-xs": {
          fontWeight: "700",
          fontSize: "0.75rem",
          lineHeight: "1.125rem",
        },
      })
    }),
  ],
}
