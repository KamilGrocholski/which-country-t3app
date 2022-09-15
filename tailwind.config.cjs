/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {

    screens: {
      lg: '1200px'
    },

    keyframes: {
      'slideInFromLeft': {
        from: {
          transform: 'translate(-200%)',
          opacity: 0
        },
        to: {
          transform: 'translate(0%)',
          opacity: 1
        }
      },
      'slideInFromRight': {
        from: {
          transform: 'translate(200%)',
          opacity: 0
        },
        to: {
          transform: 'translate(0)',
          opacity: 1
        }
      },
      'slideOutToLeft': {
        from: {
          transform: 'translate(0%)',
          opacity: 1
        },
        to: {
          transform: 'translate(-200%)',
          opacity: 0
        }
      },
      'slideOutToRight': {
        from: {
          transform: 'translate(0%)',
          opacity: 1
        },
        to: {
          transform: 'translate(200%)',
          opacity: 0
        }
      }
    },

    animation: {
      'slideInFromLeft': 'slideInFromLeft 1s ease-out',
      'slideInFromRight': 'slideInFromRight 1s ease-out',
      'slideOutToLeft': 'slideOutToLeft 1s easy-out',
      'slideOutToRight': 'slideOutToRight 1s easy-out',
    },

    extend: {
      transitionProperty: {
        'height': 'height',
        'width': 'width',
      },

      colors: {
        dark: {
          light: '#181A20',
          medium: '#13151B',
          strong: '#0E1015'
        },
        primary: 'purple-500'
      }
    },
  },
  plugins: [],
};
