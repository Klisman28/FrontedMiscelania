// tailwind.config.js
const flattenColorPalette =
  require('tailwindcss/lib/util/flattenColorPalette').default

const safeListFile = 'safelist.txt'

/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: 'jit', // <- innecesario en Tailwind v3
  content: [
    './src/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './safelist.txt',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    // Usa los breakpoints estándar y vuelve a incluir 2xl
    screens: {
      xs: '576px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      // (Opcional) alias si quieres seguir usando xxl en tu JSX
      // xxl: '1600px',
    },
    extend: {
      animation: {
        rotateCube: 'rotateCube 5s infinite linear',
      },
      keyframes: {
        rotateCube: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      // Nota: "transform" no es una llave soportada en theme.extend;
      // si necesitas utilidades, agrégalas con addUtilities en plugins.
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.500'),
            maxWidth: '65ch',
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.400'),
          },
        },
      }),
    },
  },

  // --- Safelist explícito para valores arbitrarios que usas en el layout ---
  safelist: [
    // basis fijos por breakpoint para la columna derecha
    'sm:basis-[320px]',
    'lg:basis-[360px]',
    'xl:basis-[400px]',
    '2xl:basis-[420px]',

    // grids con columnas arbitrarias (productos + resumen)
    'lg:grid-cols-[minmax(0,1fr)_320px]',
    'xl:grid-cols-[minmax(0,1fr)_360px]',

    // utilidades personalizadas que nombraste
    'hide-on-print',
    'receipt-layout',
  ],

  plugins: [
    // border-* por lado
    ({ addUtilities, theme, variants }) => {
      const colors = flattenColorPalette(theme('borderColor'))
      delete colors.default
      const colorMap = Object.keys(colors).map((color) => ({
        [`.border-t-${color}`]: { borderTopColor: colors[color] },
        [`.border-r-${color}`]: { borderRightColor: colors[color] },
        [`.border-b-${color}`]: { borderBottomColor: colors[color] },
        [`.border-l-${color}`]: { borderLeftColor: colors[color] },
      }))
      const utilities = Object.assign({}, ...colorMap)
      addUtilities(utilities, variants('borderColor'))
    },

    // Puedes mantener tu generador si te sirve para otros patrones,
    // pero recuerda que NO genera arbitrary values como basis-[360px]
    require('tailwind-safelist-generator')({
      path: safeListFile,
      patterns: [
        'text-{colors}',
        'bg-{colors}',
        'dark:bg-{colors}',
        'dark:hover:bg-{colors}',
        'dark:active:bg-{colors}',
        'hover:text-{colors}',
        'hover:bg-{colors}',
        'active:bg-{colors}',
        'ring-{colors}',
        'hover:ring-{colors}',
        'focus:ring-{colors}',
        'focus-within:ring-{colors}',
        'border-{colors}',
        'focus:border-{colors}',
        'focus-within:border-{colors}',
        'dark:text-{colors}',
        'dark:hover:text-{colors}',
        'dark:focus-within:ring-{colors}',
        'h-{height}',
        'w-{width}',
      ],
    }),

    require('@tailwindcss/typography'),
  ],
}
