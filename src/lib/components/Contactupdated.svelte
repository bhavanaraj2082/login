<script>
	import {toast , Toaster  } from "svelte-sonner";
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	let phone = ''; 
	let email = '';
	let country='';
	let name = '';
	let message = '';
	let subject = '';
	let formValid = true;
	let formSubmitted = false;
	let showErrors = false;
	let successMessage = '';
	let errorMessage = '';
	function resetForm() {
    phone = '';
    email = '';
	country='';
    name = '';
    message = '';
    subject = '';
		successMessage = '';
	  errorMessage = '';

	}
	const countries = [
		{ name: 'Afghanistan', code: '+93' },
		{ name: 'Albania', code: '+355' },
		{ name: 'Algeria', code: '+213' },
		{ name: 'Andorra', code: '+376' },
		{ name: 'Angola', code: '+244' },
		{ name: 'Antigua and Barbuda', code: '+1-268' },
		{ name: 'Argentina', code: '+54' },
		{ name: 'Armenia', code: '+374' },
		{ name: 'Australia', code: '+61' },
		{ name: 'Austria', code: '+43' },
		{ name: 'Azerbaijan', code: '+994' },
		{ name: 'Bahamas', code: '+1-242' },
		{ name: 'Bahrain', code: '+973' },
		{ name: 'Bangladesh', code: '+880' },
		{ name: 'Barbados', code: '+1-246' },
		{ name: 'Belarus', code: '+375' },
		{ name: 'Belgium', code: '+32' },
		{ name: 'Belize', code: '+501' },
		{ name: 'Benin', code: '+229' },
		{ name: 'Bhutan', code: '+975' },
		{ name: 'Bolivia', code: '+591' },
		{ name: 'Bosnia and Herzegovina', code: '+387' },
		{ name: 'Botswana', code: '+267' },
		{ name: 'Brazil', code: '+55' },
		{ name: 'Brunei', code: '+673' },
		{ name: 'Bulgaria', code: '+359' },
		{ name: 'Burkina Faso', code: '+226' },
		{ name: 'Burundi', code: '+257' },
		{ name: 'Cabo Verde', code: '+238' },
		{ name: 'Cambodia', code: '+855' },
		{ name: 'Cameroon', code: '+237' },
		{ name: 'Canada', code: '+1' },
		{ name: 'Central African Republic', code: '+236' },
		{ name: 'Chad', code: '+235' },
		{ name: 'Chile', code: '+56' },
		{ name: 'China', code: '+86' },
		{ name: 'Colombia', code: '+57' },
		{ name: 'Comoros', code: '+269' },
		{ name: 'Congo, Republic of the', code: '+242' },
		{ name: 'Congo, Democratic Republic of the', code: '+243' },
		{ name: 'Costa Rica', code: '+506' },
		{ name: 'Croatia', code: '+385' },
		{ name: 'Cuba', code: '+53' },
		{ name: 'Cyprus', code: '+357' },
		{ name: 'Czech Republic', code: '+420' },
		{ name: 'Denmark', code: '+45' },
		{ name: 'Djibouti', code: '+253' },
		{ name: 'Dominica', code: '+1-767' },
		{ name: 'Dominican Republic', code: '+1-809' },
		{ name: 'Ecuador', code: '+593' },
		{ name: 'Egypt', code: '+20' },
		{ name: 'El Salvador', code: '+503' },
		{ name: 'Equatorial Guinea', code: '+240' },
		{ name: 'Eritrea', code: '+291' },
		{ name: 'Estonia', code: '+372' },
		{ name: 'Eswatini', code: '+268' },
		{ name: 'Ethiopia', code: '+251' },
		{ name: 'Fiji', code: '+679' },
		{ name: 'Finland', code: '+358' },
		{ name: 'France', code: '+33' },
		{ name: 'Gabon', code: '+241' },
		{ name: 'Gambia', code: '+220' },
		{ name: 'Georgia', code: '+995' },
		{ name: 'Germany', code: '+49' },
		{ name: 'Ghana', code: '+233' },
		{ name: 'Greece', code: '+30' },
		{ name: 'Grenada', code: '+1-473' },
		{ name: 'Guatemala', code: '+502' },
		{ name: 'Guinea', code: '+224' },
		{ name: 'Guinea-Bissau', code: '+245' },
		{ name: 'Guyana', code: '+592' },
		{ name: 'Haiti', code: '+509' },
		{ name: 'Honduras', code: '+504' },
		{ name: 'Hungary', code: '+36' },
		{ name: 'Iceland', code: '+354' },
		{ name: 'India', code: '+91' },
		{ name: 'Indonesia', code: '+62' },
		{ name: 'Iran', code: '+98' },
		{ name: 'Iraq', code: '+964' },
		{ name: 'Ireland', code: '+353' },
		{ name: 'Israel', code: '+972' },
		{ name: 'Italy', code: '+39' },
		{ name: 'Jamaica', code: '+1-876' },
		{ name: 'Japan', code: '+81' },
		{ name: 'Jordan', code: '+962' },
		{ name: 'Kazakhstan', code: '+7' },
		{ name: 'Kenya', code: '+254' },
		{ name: 'Kiribati', code: '+686' },
		{ name: 'Kuwait', code: '+965' },
		{ name: 'Kyrgyzstan', code: '+996' },
		{ name: 'Laos', code: '+856' },
		{ name: 'Latvia', code: '+371' },
		{ name: 'Lebanon', code: '+961' },
		{ name: 'Lesotho', code: '+266' },
		{ name: 'Liberia', code: '+231' },
		{ name: 'Libya', code: '+218' },
		{ name: 'Liechtenstein', code: '+423' },
		{ name: 'Lithuania', code: '+370' },
		{ name: 'Luxembourg', code: '+352' },
		{ name: 'Madagascar', code: '+261' },
		{ name: 'Malawi', code: '+265' },
		{ name: 'Malaysia', code: '+60' },
		{ name: 'Maldives', code: '+960' },
		{ name: 'Mali', code: '+223' },
		{ name: 'Malta', code: '+356' },
		{ name: 'Marshall Islands', code: '+692' },
		{ name: 'Mauritania', code: '+222' },
		{ name: 'Mauritius', code: '+230' },
		{ name: 'Mexico', code: '+52' },
		{ name: 'Micronesia', code: '+691' },
		{ name: 'Moldova', code: '+373' },
		{ name: 'Monaco', code: '+377' },
		{ name: 'Mongolia', code: '+976' },
		{ name: 'Montenegro', code: '+382' },
		{ name: 'Morocco', code: '+212' },
		{ name: 'Mozambique', code: '+258' },
		{ name: 'Myanmar', code: '+95' },
		{ name: 'Namibia', code: '+264' },
		{ name: 'Nauru', code: '+674' },
		{ name: 'Nepal', code: '+977' },
		{ name: 'Netherlands', code: '+31' },
		{ name: 'New Zealand', code: '+64' },
		{ name: 'Nicaragua', code: '+505' },
		{ name: 'Niger', code: '+227' },
		{ name: 'Nigeria', code: '+234' },
		{ name: 'North Macedonia', code: '+389' },
		{ name: 'Norway', code: '+47' },
		{ name: 'Oman', code: '+968' },
		{ name: 'Pakistan', code: '+92' },
		{ name: 'Palau', code: '+680' },
		{ name: 'Palestine', code: '+970' },
		{ name: 'Panama', code: '+507' },
		{ name: 'Papua New Guinea', code: '+675' },
		{ name: 'Paraguay', code: '+595' },
		{ name: 'Peru', code: '+51' },
		{ name: 'Philippines', code: '+63' },
		{ name: 'Poland', code: '+48' },
		{ name: 'Portugal', code: '+351' },
		{ name: 'Qatar', code: '+974' },
		{ name: 'Romania', code: '+40' },
		{ name: 'Russia', code: '+7' },
		{ name: 'Rwanda', code: '+250' },
		{ name: 'Saint Kitts and Nevis', code: '+1-869' },
		{ name: 'Saint Lucia', code: '+1-758' },
		{ name: 'Saint Vincent and the Grenadines', code: '+1-784' },
		{ name: 'Samoa', code: '+685' },
		{ name: 'San Marino', code: '+378' },
		{ name: 'Sao Tome and Principe', code: '+239' },
		{ name: 'Saudi Arabia', code: '+966' },
		{ name: 'Senegal', code: '+221' },
		{ name: 'Serbia', code: '+381' },
		{ name: 'Seychelles', code: '+248' },
		{ name: 'Sierra Leone', code: '+232' },
		{ name: 'Singapore', code: '+65' },
		{ name: 'Slovakia', code: '+421' },
		{ name: 'Slovenia', code: '+386' },
		{ name: 'Solomon Islands', code: '+677' },
		{ name: 'Somalia', code: '+252' },
		{ name: 'South Africa', code: '+27' },
		{ name: 'South Korea', code: '+82' },
		{ name: 'Spain', code: '+34' },
		{ name: 'Sri Lanka', code: '+94' },
		{ name: 'Sudan', code: '+249' },
		{ name: 'Suriname', code: '+597' },
		{ name: 'Sweden', code: '+46' },
		{ name: 'Switzerland', code: '+41' },
		{ name: 'Syria', code: '+963' },
		{ name: 'Taiwan', code: '+886' },
		{ name: 'Tajikistan', code: '+992' },
		{ name: 'Tanzania', code: '+255' },
		{ name: 'Thailand', code: '+66' },
		{ name: 'Togo', code: '+228' },
		{ name: 'Tonga', code: '+676' },
		{ name: 'Trinidad and Tobago', code: '+1-868' },
		{ name: 'Tunisia', code: '+216' },
		{ name: 'Turkey', code: '+90' },
		{ name: 'Turkmenistan', code: '+993' },
		{ name: 'Tuvalu', code: '+688' },
		{ name: 'Uganda', code: '+256' },
		{ name: 'Ukraine', code: '+380' },
		{ name: 'United Arab Emirates', code: '+971' },
		{ name: 'United Kingdom', code: '+44' },
		{ name: 'United States', code: '+1' },
		{ name: 'Uruguay', code: '+598' },
		{ name: 'Uzbekistan', code: '+998' },
		{ name: 'Vanuatu', code: '+678' },
		{ name: 'Vatican City', code: '+39' },
		{ name: 'Venezuela', code: '+58' },
		{ name: 'Vietnam', code: '+84' },
		{ name: 'Yemen', code: '+967' },
		{ name: 'Zambia', code: '+260' },
		{ name: 'Zimbabwe', code: '+263' }
	];
	const phoneNumberPatterns = {
		Afghanistan: /^[7-9]\d{8}$/,
		Algeria: /^[5-9]\d{8}$/,
		Andorra: /^\+376[0-9]{6}$/,
		Angola: /^(\+244|0)9\d{8}$/,
		'Antigua and Barbuda': /^\+1[2689]\d{7}$/,
		Armenia: /^(\+374|0)(10|20|30|40|50|60|70|80)\d{6}$/,
		Austria: /^\+43\d{1,12}$/,
		Azerbaijan: /^(\+994|0)5[0-9]\d{7}$/,
		Bahamas: /^\+1[242]\d{7}$/,
		Bangladesh: /^(\+8801|01)\d{9}$/,
		Belarus: /^(\+375|0)29\d{7}$/,
		Belgium: /^(\+32|0)4\d{8}$/,
		Belize: /^(\+501|0)\d{7}$/,
		Benin: /^(\+229|0)\d{8}$/,
		Bolivia: /^(\+591|0)\d{8}$/,
		'Bosnia and Herzegovina': /^(\+387|0)\d{8}$/,
		'Burkina Faso': /^(\+226|0)\d{8}$/,
		Burundi: /^(\+257|0)\d{8}$/,
		'Cabo Verde': /^(\+238|0)\d{7}$/,
		Cambodia: /^(\+855|0)\d{8,9}$/,
		Cameroon: /^(\+237|0)\d{8}$/,
		'Central African Republic': /^(\+236|0)\d{8}$/,
		Chad: /^(\+235|0)\d{8}$/,
		Comoros: /^(\+269|0)\d{7}$/,
		'Congo, Republic of the': /^(\+242|0)\d{7}$/,
		'Congo, Democratic Republic of the': /^(\+243|0)\d{9}$/,
		'Costa Rica': /^(\+506|0)\d{8}$/,
		Croatia: /^(\+385|0)9\d{8}$/,
		Cyprus: /^(\+357|0)\d{8}$/,
		'Czech Republic': /^(\+420|0)\d{9}$/,
		Djibouti: /^(\+253|0)\d{7}$/,
		Dominica: /^(\+1[7678]|0)\d{7}$/,
		'Dominican Republic': /^(\+1[809]|0)\d{7}$/,
		Ecuador: /^(\+593|0)\d{9}$/,
		'El Salvador': /^(\+503|0)\d{8}$/,
		'Equatorial Guinea': /^(\+240|0)\d{8}$/,
		Eritrea: /^(\+291|0)\d{7}$/,
		Estonia: /^(\+372|0)\d{7}$/,
		Eswatini: /^(\+268|0)\d{8}$/,
		Finland: /^(\+358|0)\d{9}$/,
		France: /^(\+33|0)\d{9}$/,
		Gabon: /^(\+241|0)\d{7}$/,
		Gambia: /^(\+220|0)\d{7}$/,
		Georgia: /^(\+995|0)\d{9}$/,
		Germany: /^(\+49|0)\d{10}$/,
		Greece: /^(\+30|0)\d{10}$/,
		Grenada: /^(\+1[473]|0)\d{7}$/,
		Guatemala: /^(\+502|0)\d{8}$/,
		Guinea: /^(\+224|0)\d{9}$/,
		'Guinea-Bissau': /^(\+245|0)\d{7}$/,
		Guyana: /^(\+592|0)\d{7}$/,
		Honduras: /^(\+504|0)\d{8}$/,
		Iran: /^(\+98|0)\d{10}$/,
		Iraq: /^(\+964|0)\d{9}$/,
		Ireland: /^(\+353|0)\d{9}$/,
		Italy: /^(\+39|0)\d{10}$/,
		Jamaica: /^(\+1[876]|0)\d{7}$/,
		Kenya: /^(\+254|0)\d{9}$/,
		Kiribati: /^(\+686|0)\d{4}$/,
		Laos: /^(\+856|0)\d{8}$/,
		Latvia: /^(\+371|0)\d{8}$/,
		Lebanon: /^(\+961|0)\d{8}$/,
		Lesotho: /^(\+266|0)\d{8}$/,
		Liechtenstein: /^(\+423|0)\d{7}$/,
		Lithuania: /^(\+370|0)\d{8}$/,
		Luxembourg: /^(\+352|0)\d{6}$/,
		Malawi: /^(\+265|0)\d{9}$/,
		Maldives: /^(\+960|0)\d{7}$/,
		Mali: /^(\+223|0)\d{8}$/,
		Malta: /^(\+356|0)\d{8}$/,
		'Marshall Islands': /^(\+692|0)\d{7}$/,
		Mauritania: /^(\+222|0)\d{8}$/,
		Micronesia: /^(\+691|0)\d{7}$/,
		Monaco: /^(\+377|0)\d{8}$/,
		Mongolia: /^(\+976|0)\d{8}$/,
		Montenegro: /^(\+382|0)\d{8}$/,
		Mozambique: /^(\+258|0)\d{9}$/,
		Myanmar: /^(\+95|0)\d{9}$/,
		Nauru: /^(\+674|0)\d{4}$/,
		Netherlands: /^(\+31|0)\d{9}$/,
		'New Zealand': /^(\+64|0)\d{9}$/,
		Niger: /^(\+227|0)\d{8}$/,
		Nigeria: /^(\+234|0)\d{10}$/,
		'North Macedonia': /^(\+389|0)\d{9}$/,
		Oman: /^(\+968|0)\d{8}$/,
		Palau: /^(\+680|0)\d{7}$/,
		Palestine: /^(\+970|0)\d{9}$/,
		Panama: /^(\+507|0)\d{7}$/,
		'Papua New Guinea': /^(\+675|0)\d{7}$/,
		Paraguay: /^(\+595|0)\d{9}$/,
		Poland: /^(\+48|0)\d{9}$/,
		Portugal: /^(\+351|0)\d{9}$/,
		Romania: /^(\+40|0)\d{9}$/,
		'Saint Kitts and Nevis': /^(\+1[869]|0)\d{7}$/,
		'Saint Lucia': /^(\+1[758]|0)\d{7}$/,
		'Saint Vincent and the Grenadines': /^(\+1[784]|0)\d{7}$/,
		Samoa: /^(\+685|0)\d{5}$/,
		'San Marino': /^(\+378|0)\d{7}$/,
		'Sao Tome and Principe': /^(\+239|0)\d{7}$/,
		'Saudi Arabia': /^(\+966|0)\d{9}$/,
		Senegal: /^(\+221|0)\d{9}$/,
		Seychelles: /^(\+248|0)\d{7}$/,
		'Sierra Leone': /^(\+232|0)\d{8}$/,
		Slovakia: /^(\+421|0)\d{9}$/,
		Slovenia: /^(\+386|0)\d{8}$/,
		'Solomon Islands': /^(\+677|0)\d{5}$/,
		Somalia: /^(\+252|0)\d{8}$/,
		'South Africa': /^(\+27|0)\d{9}$/,
		'South Korea': /^(\+82|0)\d{9}$/,
		Spain: /^(\+34|0)\d{9}$/,
		'Sri Lanka': /^(\+94|0)\d{9}$/,
		Syria: /^(\+963|0)\d{9}$/,
		Togo: /^(\+228|0)\d{8}$/,
		'Trinidad and Tobago': /^(\+1[868]|0)\d{7}$/,
		Tuvalu: /^(\+688|0)\d{4}$/,
		Uganda: /^(\+256|0)\d{9}$/,
		Ukraine: /^(\+380|0)\d{9}$/,
		'United Arab Emirates': /^(\+971|0)\d{9}$/,
		'United Kingdom': /^(\+44|0)\d{10}$/,
		'United States': /^(\+1|0)\d{10}$/,
		Uruguay: /^(\+598|0)\d{8}$/,
		Uzbekistan: /^(\+998|0)\d{9}$/,
		Vanuatu: /^(\+678|0)\d{5}$/,
		'Vatican City': /^(\+379|0)\d{7}$/,
		Venezuela: /^(\+58|0)\d{10}$/,
		Yemen: /^(\+967|0)\d{9}$/,
		Zimbabwe: /^(\+263|0)\d{9}$/,

		Albania: /^\d{9}$/,
		USA: /^[2-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
		UK: /^\d{4}[\s-]?\d{6}$/,
		Eurozone: /^\d{8,15}$/,
		Japan: /^\d{10,11}$/,
		Canada: /^[2-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
		Australia: /^[4-5]\d{8}$/,
		Switzerland: /^\d{9}$/,
		China: /^[1-9]\d{10}$/,
		Sweden: /^\d{6,13}$/,
		NewZealand: /^[2-9]\d{7,9}$/,
		Singapore: /^[8-9]\d{7}$/,
		HongKong: /^[5-9]\d{7}$/,
		Norway: /^\d{8}$/,
		Mexico: /^\d{10}$/,
		India: /^[6-9]\d{9}$/,
		Brazil: /^\d{10,11}$/,
		Russia: /^[1-9]\d{9}$/,
		SouthAfrica: /^\d{10}$/,
		Israel: /^[5-7]\d{8}$/,
		Thailand: /^[6-9]\d{8}$/,
		Malaysia: /^[1-9]\d{7,9}$/,
		Philippines: /^[8-9]\d{9}$/,
		UAE: /^[5-9]\d{8}$/,
		Colombia: /^\d{10}$/,
		Pakistan: /^[3-9]\d{9}$/,
		CzechRepublic: /^\d{9}$/,
		Argentina: /^\d{10,11}$/,
		Denmark: /^\d{8}$/,
		Hungary: /^\d{9}$/,
		Turkey: /^[5-9]\d{9}$/,
		Chile: /^\d{9}$/,
		SaudiArabia: /^[5-9]\d{8}$/,
		Taiwan: /^[9]\d{8}$/,
		Indonesia: /^[8-9]\d{9,10}$/,
		Vietnam: /^[3-9]\d{8,9}$/,
		Egypt: /^[1-9]\d{9}$/,
		Bahrain: /^\d{8}$/,
		Qatar: /^\d{8}$/,
		Kuwait: /^\d{8}$/,
		Morocco: /^[5-9]\d{8}$/,
		Jordan: /^\d{8,9}$/,
		Kazakhstan: /^\d{10}$/,
		Serbia: /^\d{9}$/,
		Peru: /^\d{9}$/,
		Tunisia: /^\d{8}$/,
		WestAfrica: /^\d{8}$/,
		CentralAfrica: /^\d{8}$/,
		Zambia: /^\d{9}$/,
		Nepal: /^[9]\d{9}$/,
		SriLanka: /^[7]\d{8}$/,
		Turkmenistan: /^\d{8}$/,
		Moldova: /^\d{8}$/,
		Ethiopia: /^\d{9}$/,
		Tanzania: /^\d{9}$/,
		Ghana: /^[2-9]\d{8}$/,
		Nicaragua: /^\d{8}$/,
		Bulgaria: /^\d{8,10}$/,
		BosniaHerzegovina: /^\d{8,9}$/,
		Namibia: /^\d{9}$/,
		CaymanIslands: /^\d{7}$/,
		Fiji: /^\d{7}$/,
		Macau: /^\d{8}$/,
		Mauritius: /^\d{8}$/,
		Tajikistan: /^\d{9}$/,
		Aruba: /^\d{7}$/,
		Suriname: /^\d{7}$/,
		Iceland: /^\d{7}$/,
		SierraLeone: /^\d{8}$/,
		Madagascar: /^\d{8,9}$/,
		EastCaribbean: /^\d{7}$/,
		Barbados: /^\d{7}$/,
		CFPFranc: /^\d{6,9}$/,
		PapuaNewGuinea: /^\d{8}$/,
		ElSalvador: /^\d{8}$/,
		Gibraltar: /^\d{8}$/,
		Liberia: /^\d{7}$/,
		Rwanda: /^\d{9}$/,
		Botswana: /^\d{7,8}$/,
		Kyrgyzstan: /^\d{9}$/,
		Brunei: /^\d{7}$/,
		Sudan: /^\d{9}$/,
		Libya: /^\d{8,9}$/,
		Cuba: /^\d{8}$/,
		Bhutan: /^\d{8}$/,
		DominicanRepublic: /^\d{10}$/,
		Haiti: /^\d{8}$/,
		Tonga: /^\d{7}$/
	};
	function handleSubmit(event) {
		if (phone.length === 0 || email.length === 0 || country.length === 0 || name.length === 0 || message.length === 0 || subject.length === 0) {
			console.log('Validation failed: Missing required fields');
			event.preventDefault();
			formValid = false;
			showErrors = true;
		} else {
			formValid = true;
			formSubmitted = true;
			showErrors = false;
		}
		if (!formValid) { 
			event.preventDefault(); 
		}
	}
	function showMessage(message1, keywordError) {
		successMessage = message1;
		errorMessage = keywordError;
		if (keywordError === 'success') {
        setTimeout(() => {resetForm();}, 2000);  
    }
	}

	// $: desh = country;
	// $: {
  	// console.log("desh:", desh);
	// }

	function validatePhoneNumber(country, phone) {
	const pattern = phoneNumberPatterns[country];
	if (!pattern) {
	throw new Error(`No validation pattern found for country: ${country}`);
	}
	return pattern.test(phone);
	}

</script>
<section class="my-10 w-11/12 max-w-7xl flex flex-wrap justify-center mx-auto sm:p-0 font-roboto bg-white">
	<div class="w-full border border-gray-300 rounded-lg">
		<h1 class="text-2xl font-bold bg-primary-400 text-white py-4 pl-4 rounded-t-lg">
			Get in Touch with Us
		</h1>
		<form method="POST" action="?/contactus" class="space-y-4" use:enhance={() => {
			return async({ result }) => {
				let message1 = '';
				let keywordError = '';
				console.log(result); 
				keywordError = result.data.type;
				if (keywordError === "success") {
					message1 = result.data.data.message; 
					toast.success(message1);
					console.log(message1);
					resetForm();
				} else if (keywordError === "error") {
					message1 = result.data.data.error; 
					toast.error(message1);
					console.log(message1);
				}
				showMessage(message1, keywordError);
			};
		}}>

			<section class="flex flex-col md:flex-row p-2">
				<div class="md:w-2/5 p-0 md:ml-10 mt-0 ">
					<div class="flex items-start mt-6 ml-4">
						<Icon icon="prime:phone" class="text-primary-400 w-6 h-6 mr-2" />
						<div>
							<p class="text-lg mb-2 font-semibold">Phone Number</p>
							<div class="text-base">7829922222</div>
						</div>
					</div>
					<hr class="my-2 " />
					<div class="flex items-start mt-6 ml-4">
						<Icon icon="mdi-light:email" class="text-primary-400 w-6 h-6 mr-2" />
						<div>
							<p class="text-lg mb-2 font-semibold">Email</p>
							<div class="text-base">chemikart@gmail.com</div>
						</div>
					</div>
					<hr class="my-2" />
					<div class="flex items-start mt-6 ml-4">
						<Icon icon="ep:location" class="text-primary-400 w-6 h-6 mr-2 shrink-0" />
						<div>
							<p class="text-lg mb-2 font-semibold">Location</p>
							<div class="text-base">No. 206, Vinni Arcade 100
								Feet Ring Road, Kathriguppe
								Main Rd, Bengaluru,
								Karnataka 560085</div>
						</div>
					</div>
				</div>
				<div class="md:w-3/5 md:mr-10 md:ml-10 mr-0 p-0">
					<div class="p-0 sm:p-0 md:p-0">
						<div class="mt-5">
							<h2 class="text-xl font-semibold">Send a Message</h2>
							<p class=" mt-3 mb-3">We’d love to hear from you! Send us a message, and let’s stay connected.</p>
						</div>
						<div class="flex flex-col md:flex-row md:space-x-4">
							<div class="flex-1 mb-4">
								<input type="text" name="name" id="name" bind:value={name} class="flex w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="User Name" />
								{#if showErrors && name.length === 0}
									<span class="text-red-400 text-xs">Name is required</span>
								{/if}
								{#if name.length > 0 && !/^[A-Za-z\s]+$/.test(name)}
									<span class="text-red-400 text-xs">Name cannot contain numbers or special characters</span>
								{/if}
							</div>
						</div>
						<div class="flex flex-col md:flex-row md:space-x-4">
							<div class="flex-1 mb-4">
								<input type="text" name="email" id="email" bind:value={email} class="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Email" />
								{#if showErrors && email.length === 0}
									<span class="text-red-400 text-xs">Email is required</span>
								{/if}
								{#if email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)}
									<span class="text-red-400 text-xs">Please enter a valid email address.</span>
								{/if}
							</div>
						</div>
						<div class="flex flex-col md:flex-row md:space-x-4">
							<div class="flex-1 mb-4">
								<select name="country" id="country" bind:value={country} class="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400">
									<option value="" disabled selected>Select a country</option>
									{#each countries as { code, name }}
									  <option value={name}>{name}({code})</option>
									{/each}
								  </select>
								{#if showErrors && country.length === 0}
									<span class="text-red-400 text-xs">country is required</span>
								{/if}
							</div>
							<div class="flex-1 mb-4">
								<input type="tel" name="phone" id="phone" bind:value={phone} class="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Phone" />
								{#if showErrors && phone.length === 0}
									<span class="text-red-400 text-xs">Phone number is required</span>
								{/if}
								{#if phone.length > 0 && !validatePhoneNumber( country, phone)}
    							<span class="text-red-400 text-xs">Please enter a valid phone number for {country}</span>
								{/if}
							</div>
							
						</div>
						<div class="flex flex-col md:flex-row md:space-x-4">
							<div class="flex-1 mb-4">
								<input type="text" name="subject" id="subject" bind:value={subject} class="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Subject" />
								{#if showErrors && subject.length === 0}
									<span class="text-red-400 text-xs">Subject is required</span>
								{/if}
							</div>
						</div>
						<div class="flex-1 mb-4">
							<textarea name="message" id="message" bind:value={message} class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400 mb-4 h-32" placeholder="Message"></textarea>
							{#if showErrors && message.length === 0}
								<span class="text-red-400 text-xs">Message is required</span>
							{/if}
						</div>
						<input type="hidden" name="status" value="unread" />
						<div class="flex-1 mb-2 sm:mt-0">
							<button type="submit" on:click={handleSubmit} class="px-5 py-2 bg-primary-400 text-white rounded transition duration-300 hover:bg-primary-500 sm:w-auto">Send Message</button>
						</div>
					</div>
				</div>
			</section>
		</form>
	</div>
	<Toaster position="bottom-right" richColors />
</section>