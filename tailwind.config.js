/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily:{
				workSans:["Work Sans","sans-serif"],
				montserrat:["Montserrat","sans-serif"]
			},
			screens:{
				"xs":"400px"
			},
			colors:{
				primary:{
					"50":"#fff3f1",
					"100":"#ffe5e0",
					"200":"#ffcec5",
					"300":"#ffad9d",
					"400":"#ff7e65",
					"500":"#fe5939",
					"600":"#ec3916",
					"700":"#c72c0e",
					"800":"#a42810",
					"900":"#882714",
					"950":"#4a1005"
				},
				heading:"#374151",
				content:"#4b5563"
			},
			borderWidth:{
				"1":"1.5px"
			},
			fontSize:{
				"1s":"9px",
				"2s":"10px",
				"3s":"14px",
				"4s":"16px"
			},
			animation:{
				shimmer : 'shimmer 2s ease-in-out infinite',
        		'progress-pulse': 'progress-pulse 1.5s ease-in-out infinite',
				loadingbar: 'loadingbar 1s ease-out infinite',
				'spin-slow': 'spin 3s linear infinite',
				'slow-bounce': 'bounce 3s infinite',
				'pulse-delay': 'pulse-delay 2.5s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'float-delay': 'float 7s ease-in-out 1s infinite',
				'float-slow': 'float 8s ease-in-out 2s infinite',
				'bubble': 'bubble 4s ease-in-out infinite',
				'bubble-delay': 'bubble 5s ease-in-out 1s infinite',
				'bubble-slow': 'bubble 6s ease-in-out 2s infinite',
			},
			keyframes: {
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				  },
				  'progress-pulse': {
					'0%, 100%': { opacity: 0 },
					'50%': { opacity: 0.5 },
					'25%': { opacity: 0.25 },
					'75%': { opacity: 0.75 },

				  },
				wave: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				loadingbar: {
					'0%' : {  width: '20%',transform: 'translateX(20%)'},
					'20%': { width: '30%', transform: 'translateX(30%)' },
					'40%': { width: '60%', transform: 'translateX(30%)'},
					'60%': { width: '70%', transform: 'translateX(40%)'},
					'80%': { width: '80%', transform: 'translateX(40%)' },
					'100%': { width: '100%', transform: 'translateX(60%)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' },
				  },
				  bubble: {
					'0%': { transform: 'translateY(0)', opacity: 0.5 },
					'50%': { transform: 'translateY(-40px)', opacity: 0.8 },
					'100%': { transform: 'translateY(-80px)', opacity: 0 },
				  },
				  fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				  },
			},
		},
	},
	plugins: [require('@tailwindcss/forms')]
};

