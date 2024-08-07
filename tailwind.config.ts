import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        xl: '1200px',
        lg: '950px',
        md: '750px',
        sm: '550px',
      },
    },
    fontFamily: {
      outfit: ['var(--font-outfit)'],
      inter: ['var(--font-inter)'],
    },
  },
  plugins: [],
}
export default config
