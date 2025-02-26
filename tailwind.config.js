/** @type {import('tailwindcss').Config} */
const daisyui = require('daisyui');

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#988643",           
        "primary-hover": "#89793C",   
        dark: "#000",              
        body: "#000",                 
        light: "#F6F4EE",            
        white: "#fff",               
        border: "#E5E5EA",            
        red: "#E44C4C",             
        redlight: "#FFEEEE",             
        // Add red color variants from 100 to 900
        red: {
          100: "#FFEBEB",
          200: "#FFB8B8",
          300: "#FF8888",
          400: "#FF4E4E",
          500: "#E44C4C",  // Base red color
          600: "#B33838",
          700: "#8C2626",
          800: "#611A1A",
          900: "#3A0F0F",
        }
      },
     },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: false,
    darkTheme: "light",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
    themes: [
      {
        custom: {
          "primary": "#988643",
          "primary-focus": "#988643",
          "primary-content": "#ffffff",
          "success": "#988643",
        },
      },
    ],
  },
}
