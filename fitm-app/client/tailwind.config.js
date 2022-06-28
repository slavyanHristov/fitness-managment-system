module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
      colors: {
        primaryDark: '#1C1D1E', // #26282B #171717
        accentDark: '#242526',
        primaryGray: '#3f4042',
        accentGray: '#5e6063',
        primaryBlue: '#1B9CFC',
        accentBlue: '#25CCF7',
        primaryWhite: '#F3F3F3',
        primaryBgWhite: '#ffffff',
        darkenedColor: 'rgba(0,0,0,0.2)'
      },
      maxWidth: {
        'xxs': '250px'
      },
      padding: {
        '10p': '10%'
      }
    }

  },
  plugins: [],
}