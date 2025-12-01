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
      colors: {
        'mj-extra': '#AFA7F0',
      },
    },
  },
  plugins: [],
}
export default config

