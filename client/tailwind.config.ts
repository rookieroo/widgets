/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector','[data-color-mode="dark"]'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'theme': '#fc466b',
        // 'background': {
        //   'light': '#f5f5f5',
        //   'dark': '#1c1c1e',
        // },
        'dark': "#333333",
        border: 'hsl(var(--border ) / <alpha-value>)',
        input: 'hsl(var(--input ) / <alpha-value>)',
        ring: 'hsl(var(--ring ) / <alpha-value>)',
        background: 'hsl(var(--background ) / <alpha-value>)',
        foreground: 'hsl(var(--foreground ) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary ) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground ) / <alpha-value>)',
          // for theme(colors.primary.600) algolia
          600: 'hsl(var(--primary ) / <alpha-value>)',
          ...colors['var(--theme)'],
        },
        gray: colors.gray,
        secondary: {
          DEFAULT: 'hsl(var(--secondary ) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground ) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive ) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground ) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted ) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground ) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent ) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground ) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover ) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground ) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card ) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground ) / <alpha-value>)',
        },
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'spacing': 'margin, padding',
      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        propel: {
          '0%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(25%)' },
          '40%': { transform: 'translateX(-25%)' },
          '60%': { transform: 'translateX(25%)' },
          '100%': { transform: 'translateX(-25%)' },
        },
        flip: {
          '0%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(-90deg)' },
          '40%': { transform: 'rotate(0deg)' },
          '60%': { transform: 'rotate(0deg)' },
          '80%': { transform: 'rotate(90deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: theme('colors.indigo.500'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

