module.exports = {
	mode: 'jit', // Optionally use just in time engine
	purge: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	minWidth: {
		'43': '168px',
	  },
	  screens: {
      'mxl': {'max': '768px'},
      // => @media (max-width: 768px) { ... }

      'ml': {'max': '425px'},
      // => @media (max-width: 425px) { ... }

      'md': {'max': '375px'},
      // => @media (max-width: 375px) { ... }

      'ms': {'max': '320px'},
      // => @media (max-width: 320px) { ... }
	  },
	plugins: [],
};
