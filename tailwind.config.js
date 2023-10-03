/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        'bg-purple' : '#2f304a',
        'text-pink' : '#ff8c8c',
        'text-yellow': '#fce58f',
        'text-green' : '#8ffcb0'
      },
      "fontFamily": {
        'main':['Inter', 'sans-serif']
       },
    },
  },
  plugins: [],
}

