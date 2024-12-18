/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          500: '#35495e',
          600: '#2c3e50',
          700: '#22313f',
          800: '#1a242f',
        },
      },
  },
  plugins: [],
}
};

