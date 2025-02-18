/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontSize:{
        ssm : '0.01rem',
        sm: '0.34rem'
      }
    },
    
  },
  plugins: [],
}

