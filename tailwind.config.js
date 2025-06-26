
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{App,index,definitions}.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#CCFBF1', // teal-100
          DEFAULT: '#0D9488', // teal-600
          dark: '#0F766E',  // teal-700
        },
        highlight: { // formerly accent, for calls to action
          light: '#FFE4E6', // rose-100
          DEFAULT: '#F43F5E', // rose-500
          dark: '#E11D48',   // rose-600
        },
        ui: {
          background: '#F1F5F9', // slate-100
          surface: '#FFFFFF',    // white
          border: '#CBD5E1',     // slate-300
          borderHover: '#94A3B8', // slate-400
          ringFocus: '#5EEAD4',  // teal-300 (for focus rings, complementary to brand)
        },
        content: {
          primary: '#1E293B',    // slate-800
          secondary: '#475569',  // slate-600
          subtle: '#94A3B8',      // slate-400
          onBrand: '#FFFFFF',     // white text on brand color
          onHighlight: '#FFFFFF', // white text on highlight color
        },
        success: {
          light: '#D1FAE5', // green-100
          DEFAULT: '#10B981', // green-500
          dark: '#059669',   // green-600
          text: '#065F46',   // green-800
        },
        danger: {
          light: '#FEE2E2', // red-100
          DEFAULT: '#EF4444', // red-500
          dark: '#DC2626',   // red-600
          text: '#991B1B',   // red-800
        },
        warning: {
          light: '#FEF3C7', // amber-100
          DEFAULT: '#F59E0B', // amber-500
          dark: '#D97706',   // amber-600
          text: '#92400E',   // amber-800
        }
      }
    }
  },
  plugins: [],
}
