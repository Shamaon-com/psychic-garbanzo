module.exports = {
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
    extend: {
        opacity: [
            "disabled"
        ],
        backgroundColor: [
            "disabled"
        ],
        cursor: [
            "disabled"
        ]
    }
},
  plugins: [
    // ...
    require('@tailwindcss/forms'),
  ]
}
