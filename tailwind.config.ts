import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'md': '680px',   // Tablet breakpoint
        'lg': '1020px',  // Desktop breakpoint (4 columns)
      },
    },
  },
  plugins: [],
}
export default config

