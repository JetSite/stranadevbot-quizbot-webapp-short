// eslint-disable-next-line no-undef
const defaultTheme = require("tailwindcss/defaultTheme");

// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "telegram-bg-color": "var(--telegram-bg-color)",
        "telegram-text-color": "var(--telegram-text-color)",
        "telegram-hint-color": "var(--telegram-hint-color)",
        "telegram-link-color": "var(--telegram-link-color)",
        "telegram-button-color": "var(--telegram-button-color)",
        "telegram-button-text-color": "var(--telegram-button-text-color)",
        "telegram-secondary-bg-color": "var(--telegram-secondary-bg-color)",
        textColor: '#1B233D',
        buttonSubmit: '#92278F',
        defaultButtonText: '#798198',
        itemDevelopment: '#727990',
        inputDesc: "#B0B2BC",
        defaultButton: '#F4F5F8',
        inputBorder: '#B5BCD1',
        startBorder: '#E7EBF5',
        borderItem: '#F0F1F2',
        buttonItem: '#F8EBF8',
        itemBg: '#FCFCFC',
        cancelRed: '#FF6666',
        textRed: '#ED1C24',
        widthSubmit: 'calc(100% - 28px)',
        highlight: '-webkit-tap-highlight-color: rgba(0, 0, 0, 0)',
        modalTransition: "#1b2343",
        textBlack: "#111828"
      },
    },
  },
};
