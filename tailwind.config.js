/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        background: '#f5f5f7', // Apple warm gray background
        surface: '#ffffff',
        primary: {
          DEFAULT: '#0071e3', // Apple blue
          dark: '#005bba',
        },
        ink: {
          DEFAULT: '#1d1d1f',
          muted: '#86868b',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.02)',
        'float': '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.02)',
        'sheet': '0 -10px 40px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
