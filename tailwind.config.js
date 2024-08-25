/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Primary: "#111315",
        Secondry: "#1F2225",
        container: "rgb(240, 242, 245)",
        TextPrimary: "#1F2225",
        TextSecondry: "rgb(123, 128, 154)",
      },
    },
    fontFamily: {
      USRegular: "USRegular",
      USBold: "USBold",
      USMedium: "USMedium",
      USSemiBold: "USSemiBold",
    },
  },
  plugins: [],
};
