/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',      // Bright Blue
        secondary: '#F8F9FA',    // Light Gray
        accent: '#28A745',        // Green
        'dark-gray': '#343A40',
        'medium-gray': '#6C757D',
        'light-gray-border': '#E9ECEF',
        'success-green': '#28A745',
        'warning-yellow': '#FFC107',
        'error-red': '#DC3545',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
