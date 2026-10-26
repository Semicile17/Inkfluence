/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lime: {
          50: '#f7ffe9',
          100: '#edffcc',
          200: '#dcffa3',
          300: '#caff70',
          400: '#b9ff66',
          500: '#9bf03d',
          600: '#7dce24',
          700: '#5fa51c',
          800: '#4c801d',
          900: '#416b1d',
        },
        ink: {
          DEFAULT: '#191a23',
          800: '#22232e',
          700: '#2d2e3a',
          600: '#3c3d4a',
          500: '#565765',
        },
        paper: '#f3f3f3',
        cream: '#fbfbf8',
        electric: '#caff70',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      fontSize: {
        '10xl': ['9rem', { lineHeight: '0.9', letterSpacing: '-0.06em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(25,26,35,0.18)',
        lift: '0 26px 70px -30px rgba(25,26,35,0.35)',
        tag: '0 2px 0 0 #191a23',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(3deg)' },
          '50%': { transform: 'translateY(-22px) rotate(-3deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blink: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'spin-slow': 'spinSlow 22s linear infinite',
        wiggle: 'wiggle 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
        'pop-in': 'pop-in 0.25s ease-out both',
        blink: 'blink 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
