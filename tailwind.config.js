/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cwth-blue': '#1A5FA8',
        'cwth-teal': '#00B0CA',
        'cwth-green': '#4CAF50',
        'cwth-light-blue': '#E8F4FD',
        'cwth-dark': '#1A2B3C',
        'cwth-mid-grey': '#6B7280',
        'cwth-border': '#D1D5DB',
        'cwth-white': '#FFFFFF',
      },
      fontFamily: {
        heading: ['Nunito Sans', 'Source Sans Pro', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Open Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
