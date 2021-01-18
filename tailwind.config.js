module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'NanumGothic': ['"Nanum Gothic"', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        'hero-lg': "url('/img/handshake.jpeg')",
      },
      height: {
        'mobile': "40rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // ...
    require('@tailwindcss/forms'),
  ]
}
