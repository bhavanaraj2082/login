/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily:{
				workSans:["Work Sans","sans-serif"],
				montserrat:["Montserrat","sans-serif"]
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
				content:"4b5563"
			},
			borderWidth:{
				"1":"1.5px"
			},
			fontSize:{
				"1s":"9px",
				"2s":"10px",
				"3s":"14px",
				"4s":"16px"
			}
		}
	},
	plugins: []
};
