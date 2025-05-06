<script>
	import { Cusdetails } from '$lib/stores/solution_stores.js';
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import Icon from '@iconify/svelte';
	import { toast, Toaster } from "svelte-sonner";
	export let data;
	console.log(data, "data customer details");
	export let tog;
	export let tog1;
	export let tog2;
	export let tog3;
	export let tog4;
	export let showStep1 = true;
    export let showStep2 = true;
    export let showStep3 = true;
    export let showStep4 = true;
	let number = "";
	let authedUserEmailVerified = data?.profile?.isEmailVerified || "";
	console.log("authedUserEmailVerified", authedUserEmailVerified);
	const handleResendOtpemail = () => {
		if (!loadingotp) {
			form3.requestSubmit();
		}
	};
	let isLoadingPhone = false;
	let isEmailVerified = false;
	let loadingotp = false;
	let loadingPhone = false;
	let isLoading = false;
	let ProfileEmailVerified = false;
	let isDataAvailable = false;
	let isEditable = false;
	let verificationMessage = "";
	let emailSent = false;
	let displayMessage = "";
	let enteredOtp = "";
	let enteredOtpemail = "";
	let isOtpVerified = false;
	let isOtpPhoneVerified = false;
	let form3;
	let country;
	let errorMessage = '';
	$: isFormData =
		$Cusdetails.FirstName &&
		$Cusdetails.LastName &&
		$Cusdetails.Organisation &&
		$Cusdetails.Country &&
		$Cusdetails.Email &&
		$Cusdetails.Number;
	$Cusdetails.userId = data?.profile?.userId || "";
	// console.log("$Cusdetails.userId",$Cusdetails.userId);
	const titles = ['Dr', 'Miss', 'Mr', 'Ms', 'Mrs', 'Prof'];
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
    let errorMessage1, errorMessage2,errorMessage3,errorMessage4,errorMessage7,errorMessage5;	
	    function validateFirstName(event) {
    const input = event.target.value;
    const regex = /^[A-Za-z\s]*$/; 
    if (!regex.test(input)) {
        errorMessage1 = 'First Name cannot contain numbers or special characters';
    } else if (input.length < 3 || input.length > 50) {
	errorMessage1 = 'First Name must be between 3 and 50 characters';
	return false;
}else {
        errorMessage1 = '';
    }
}
function validateLastName(event) {
    const input = event.target.value;
    const regex = /^[A-Za-z\s]*$/; 
    if (!regex.test(input)) {
        errorMessage2 = 'Last Name cannot contain numbers or special characters';
    } else if ( input.length > 50) {
	errorMessage1 = 'Last Name must be less than 50 characters';
	return false;
}
else {
        errorMessage2 = '';
    }
}
function validatecompany(event) {
	const input = event.target.value.trim();
	const regex = /^[a-zA-Z0-9\s&\-.,!@():;"']+$/;

	if (!input) {
		errorMessage5 = '';
		return false;
	} else if (input.length < 3 || input.length > 100) {
	errorMessage5 = 'Company Name must be between 3 and 100 characters';
	return false;
}else if (!regex.test(input)) {
		errorMessage5 = 'Invalid characters in Company Name';
		return false;
	} else if (/<[^>]*>/.test(input)) {
		errorMessage5 = 'Company Name should not contain HTML tags';
		return false;
	} else {
		errorMessage5 = '';
		return true;
	}
}
function validateEmail(event) {
    const input = event.target.value;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(input)) {
        errorMessage3 = 'Please enter a valid email address';
    } else {
        errorMessage3 = '';
    }
}
function validatePhNo(country, number) {
    if (!country) {
        errorMessage4 = 'Please select your country before entering Number';
    } else {
        const pattern = phoneNumberPatterns[country];
        if (!pattern) {
            errorMessage4 = 'No validation pattern found for this country';
        } else if (!pattern.test(number)) {
            errorMessage4 = `Please enter a valid phone number for ${country}`;
        } else {
            errorMessage4 = '';
        }
    }
}
const validateAll = (country, number) => {
	if (!isFormData) {
		errorMessage = 'Please fill all the required fields';
		// setTimeout(() => {
		// 	errorMessage = '';
		// }, 5000);
		return false;
	} else {
		errorMessage = '';
	}
	validateFirstName({ target: { value: $Cusdetails.FirstName } });
	validateLastName({ target: { value: $Cusdetails.LastName } });
	validateEmail({ target: { value: $Cusdetails.Email } });
	validatecompany({ target: { value: $Cusdetails.Organisation } });
	return (
		!errorMessage1 && 
		!errorMessage2 && 
		!errorMessage3 && 
		!errorMessage4 && 
		!errorMessage5
	);
};
const cust = () => {
	// console.log("$Cusdetails.Country",$Cusdetails.Country);
	// console.log("$Cusdetails.FirstName",$Cusdetails.FirstName);
	// console.log("$Cusdetails.LastName",$Cusdetails.LastName);
	// console.log("$Cusdetails.Organisation",$Cusdetails.Organisation);
	// console.log("$Cusdetails.Email",$Cusdetails.Email);
	// console.log("$Cusdetails.Number",$Cusdetails.Number);
	if (!validateAll($Cusdetails.Country, $Cusdetails.Number)) {
	return;
}
if (validateEmail && !(authedUserEmailVerified || ProfileEmailVerified)) {
    errorMessage7 = 'Please verify your Email';
	setTimeout(() => {
	errorMessage7 = '';
}, 3000);
	return;
}
tog4();
};
onMount(() => {
    const storedEmailVerified = localStorage.getItem("ProfileEmailVerified");
    if (storedEmailVerified === "true") {
        ProfileEmailVerified = true;
    }

    // Check if user details are already filled
    if ($Cusdetails.FirstName && $Cusdetails.LastName && $Cusdetails.Email) {
        // User details are already filled, no need to fetch again
        isDataAvailable = true;
    } else if (data && data.profile) {
        // Fetch user details from data
        $Cusdetails.FirstName = `${data.profile.firstName || ""}`.trim();
        $Cusdetails.LastName = `${data.profile.lastName || ""}`.trim();
        $Cusdetails.Email = data.profile.email || "";
        $Cusdetails.Number = data.profile.cellPhone || data.profile.primaryPhone || "";
        $Cusdetails.userId = data.profile.userId || "";
        $Cusdetails.Organisation = data.profile.companyName || "";
        const profileCountry = data.profile.country?.trim();
        if (profileCountry) {
            const foundCountry = countries.find(
                (c) => c.name.toLowerCase() === profileCountry.toLowerCase(),
            );
            if (foundCountry) {
                $Cusdetails.Country = foundCountry.name;
            }
        }

        isDataAvailable = true;
    }

    isEditable = false;
    // document.addEventListener('click', handleClickOutside);
    // return () => document.removeEventListener('click', handleClickOutside);
});
	$: if (ProfileEmailVerified) {
    localStorage.setItem("ProfileEmailVerified", "true");
}

let searchTerm = "";
    let showDropdown = false;
    let filteredCountries = countries;

	function filterCountries() {
		filteredCountries = countries.filter(
			(country) =>
				country.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
				country.code
					.replace("+", "")
					.includes(searchTerm.replace("+", "").toLowerCase()),
		);
		if (
			filteredCountries.length === 1 &&
			(filteredCountries[0].name.toLowerCase() ===
				searchTerm.toLowerCase() ||
				filteredCountries[0].code.replace("+", "").toLowerCase() ===
					searchTerm.replace("+", "").toLowerCase())
		) {
			selectCountry(filteredCountries[0]);
		} else {
			showDropdown = filteredCountries.length > 0; 
		}
	}
	function selectCountry(selectedCountry) {
		$Cusdetails.Country = selectedCountry.name;
		searchTerm = `${selectedCountry.name} `;
		showDropdown = false;
		// validatePhoneNumber(country, phone);
		// validatePhNo($Cusdetails.Country, number);
		// delete errors.$Cusdetails.Country;
		validatePhNo($Cusdetails.Country, $Cusdetails.Number);
	}
function handleInputChange(event) {
  searchTerm = event.target.value;
    const isDeleting = event.inputType === 'deleteContentBackward' || 
                     event.inputType === 'deleteContentForward';
  if (searchTerm.length > 0 && !isDeleting) {
    filterCountriesWithoutAutoSelect();
        showDropdown = filteredCountries.length > 0;
        const codeSearch = searchTerm.replace('+', '').trim();
    if (codeSearch.length > 0) {
      const exactCodeMatches = filteredCountries.filter(
        (country) => country.code.replace('+', '') === codeSearch
      );

      if (exactCodeMatches.length === 1) {
        selectCountry(exactCodeMatches[0]);
        return;
      }
    }

    const countriesStartingWith = filteredCountries.filter(
      (country) => country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    
    if (countriesStartingWith.length === 1) {
      selectCountry(countriesStartingWith[0]);
    }
  } else {
    filterCountriesWithoutAutoSelect();
    showDropdown = filteredCountries.length > 0;
  }
}
function filterCountriesWithoutAutoSelect() {
  filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      country.code.replace('+', '').includes(searchTerm.replace('+', '').toLowerCase())
  );
}
    function toggleDropdown() {
        showDropdown = !showDropdown;
    }

	// function handleClickOutside(event) {
	// 	if (!event.target.closest('.dropdown-container')) {
	// 		showDropdown = false;
	// 	}
	// }

	let countryDropdownRef;

function handleFormClick(event) {
const isInCountry = countryDropdownRef?.contains(event.target);
if (!isInCountry) {
  showDropdown = false;
}
}

	let errors = {};
	function handleKeyDown(event) {
    if (event.key === "Enter" && searchTerm.length >= 3 && filteredCountries.length > 0) {
        selectCountry(filteredCountries[0]);
        event.preventDefault();
    }
}

const scrollToStep = (stepId) => {
		const element = document.getElementById(stepId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

const handleEdit = (step, toggleFn) => {
		toggleFn();
		scrollToStep(step);
	};
</script>
{#if showStep1}
<div id="step1" class="pb-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="ph:test-tube-fill" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
	<h1 class="font-bold text-black text-opacity-25 sm:text-2xl text-sm">Step 1: Select custom solution type</h1>
	</span>
	<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={() => handleEdit('step1', tog)}>Edit</button>
</div>
{/if}
<hr />
{#if showStep2}
<div id="step2" class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="wpf:edit-file" class="sm:w-7 sm:h-7 w-5 h-5 text-primary-300" />
	<h1 class="font-bold text-black text-opacity-25 sm:text-2xl text-sm">Step 2: Select custom format</h1>
	</span>
	<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs"on:click={() => handleEdit('step2', tog1)}>Edit</button>
</div>
{/if}
<hr /><hr />
{#if showStep3}
<div id="step3" class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="hugeicons:test-tube" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
	<h1 class="font-bold text-black text-opacity-25 sm:text-2xl text-sm">Step 3: Configure custom solution</h1>
	</span>
	<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={() => handleEdit('step3', tog2)}>Edit</button>
</div>
{/if}
<hr /><hr />
{#if showStep4}
<div id="step4" class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="material-symbols:add-notes-outline-rounded" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300"  style="stroke-width: 2;" />
	<h1 class="font-bold text-black text-opacity-25 sm:text-2xl text-sm">Step 4: Additional notes</h1>
</span>
	<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={() => handleEdit('step4', tog3)}>Edit</button>
</div>
{/if}
<hr /><hr />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="bg-white " on:click={handleFormClick}>
	<span class="flex items-center gap-2 pt-10">
		<Icon icon="ph:user-list-bold" class="sm:w-8 sm:h-8 w-6 h-6 text-heading" />
	<h1 class="font-bold sm:text-2xl text-sm ">Step 5: Customer details</h1>
	</span>
	<div class="sm:ml-10 ml-0">
	<h1 class="font-semibold py-5 text-primary-500 sm:text-md text-sm ">Please fill the details</h1>
	<div class="grid grid-cols-1 gap-x-6 gap-y-1 md:w-3/4 lg:w-1/2 sm:grid-cols-6">
		<div class="sm:col-span-2  sm:col-start-1">
			<input
				type="hidden"
				name="userId"
				id="userId"
				bind:value={$Cusdetails.userId}
			/>
				<label for="title" class="sm:text-sm text-xs">Title</label>
		  <div class="">
			<select
				id="title"
				name="title"
				placeholder="title"
				class="block w-full sm:text-sm text-xs rounded py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1  focus:border-primary-500 bg-white"
				bind:value={$Cusdetails.Title}
			>
				<option value="" disabled selected>Title</option>
				{#each titles as title}
					<option value={title} class="sm:text-sm text-xs">{title}</option>
				{/each}
			</select>
		  </div>
		</div>
		<div class="sm:col-span-2">
			<label for="" class="sm:text-sm text-xs">First name <span class="text-primary-500"> *</span></label>
			<div class="">
			<input
			type="text"
			class="block w-full rounded py-1.5 sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
			bind:value={$Cusdetails.FirstName}
			name="Firstname"
			id="firstname"
			on:input={() => {
				validateFirstName
				const trimmedName = $Cusdetails.FirstName.trim();
						  $Cusdetails.FirstName= trimmedName;
						  if (!trimmedName) {
      errors = { ...errors, FirstName: "" };
    } else if (trimmedName.length < 3 || trimmedName.length > 50) {
  errors = { ...errors, FirstName: "Must be between 3–50 chars" };
}else if (!/^[A-Za-z\s&\-.,!@():;"']+$/.test(trimmedName)) {
      errors = { ...errors, FirstName: "Invalid chars in First Name" };
    } else if (/<[^>]*>/.test(trimmedName)) {
      errors = { ...errors, FirstName: "First Name should not contain HTML tags" };
    } else {
      const { FirstName, ...rest } = errors;
      errors = rest; 
    }
				}}
			required
		/>
		{#if errors?.FirstName}
		<span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
		  {errors.FirstName}
		</span>
	  {/if}
        {#if errorMessage && !$Cusdetails.FirstName}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">   
			FirstName is required</div>
		{/if}
		{#if errorMessage1}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1 md:hidden block ">
			{errorMessage1}</div>
		{/if}
		  </div>
		 
		</div>
		<div class="sm:col-span-2">
			<label for="" class="sm:text-sm text-xs">Last name <span class="text-primary-500"> *</span></label>
			<div class="">
			<input
					type="text"
					name="lastname"
					class="block w-full sm:text-sm text-xs rounded py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
					id="lastname"
					bind:value={$Cusdetails.LastName}
					required
					on:input={() => {
						validateLastName
						const trimmedLName = $Cusdetails.LastName.trim();
								  $Cusdetails.LastName= trimmedLName;

								  if (!trimmedLName) {
      errors = { ...errors, LastName: "" };
    } else if ( trimmedLName.length > 50) {
  errors = { ...errors, LastName: "Must be less than 50 chars" };
}else if (!/^[A-Za-z\s&\-.,!@():;"']+$/.test(trimmedLName)) {
      errors = { ...errors, LastName: "Invalid chars in Last Name" };
    } else if (/<[^>]*>/.test(trimmedLName)) {
      errors = { ...errors, LastName: "Last Name should not contain HTML tags" };
    } else {
      const { LastName, ...rest } = errors;
      errors = rest; 
    }
						}}
				/>
				{#if errors?.LastName}
		<span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
		  {errors.LastName}
		</span>
	  {/if}
                {#if errorMessage && !$Cusdetails.LastName}
                <div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
                    LastName is required</div>
                {/if}
				{#if errorMessage2}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1 md:hidden block">
			{errorMessage2}</div>
		{/if}
		  </div>
		</div>
	  </div>
	<div class=" mb-2">
		<!-- {#if errorMessage1}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1 md:block hidden ">
			{errorMessage1}</div>
		{/if} -->
		{#if errorMessage2}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1 md:block hidden">
			{errorMessage2}</div>
		{/if}
		<label for="" class="sm:text-sm text-xs">Country <span class="text-primary-500"> *</span></label>
		<br />
		<div class="flex-1 mb-4 relative w-full" bind:this={countryDropdownRef}>
				<div class="flex items-center relative overflow-hidden w-full bg-gray-50 md:w-3/4 sm:2/5 lg:w-1/2 ">
    <input
        type="text"
        id="country"
        name="country"
        bind:value={$Cusdetails.Country}
        placeholder="Select your Country"
        on:input={handleInputChange}
        on:click={toggleDropdown}
		on:keydown={handleKeyDown}
        class="block w-full sm:text-sm text-xs rounded py-1.5 pr-8 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500 bg-white"
        required
    />
    <!-- SVG Icon -->
											<!-- svelte-ignore a11y-no-static-element-interactions -->
											<svg
											  xmlns="http://www.w3.org/2000/svg"
											  class="h-5 w-5 text-gray-500 transition-transform duration-200 cursor-pointer absolute right-2"
											  fill="none"
											  viewBox="0 0 24 24"
											  stroke="currentColor"
											  stroke-width="2"
											  style:transform={showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}
											  on:click={toggleDropdown}
											>
											  <path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M19 9l-7 7-7-7"
											  />
											</svg>
			</div>
			{#if showDropdown}
				<div class="absolute md:w-3/4 sm:2/5 lg:w-1/2 sm:text-sm text-xs bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
					<ul class="max-h-60 overflow-y-auto text-sm">
						{#each filteredCountries as country (country.name)}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<li
								on:click={() => selectCountry(country)}
								class="px-4 py-1.5 cursor-pointer hover:bg-gray-100"
							>
								{country.name} ({country.code})
							</li>
						{/each}
						{#if filteredCountries.length === 0}
							<div class="px-4 py-1.5 text-gray-600 text-xs">No matching countries found!</div>
						{/if}
					</ul>
				</div>
			{/if}
			{#if errorMessage && !$Cusdetails.Country}
			<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
				Country is required</div>
			{/if}
		</div>
	</div>
	<div class="mt-2 mb-2">
		<label for="" class="sm:text-sm text-xs">Phone number <span class="text-primary-500"> *</span></label>
		<br />
		<input
			class="block rounded md:w-3/4 sm:2/5 lg:w-1/2 sm:text-sm text-xs w-full py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500 placeholder:text-sm"
			type="tel"
			name="phone"
			id="phone"
			bind:value={$Cusdetails.Number}
			placeholder=""
			required			
			on:input={() => {
				validatePhNo($Cusdetails.Country, $Cusdetails.Number)
				const trimmedNum = $Cusdetails.Number.trim();
						  $Cusdetails.Number= trimmedNum;
				}}
            />
			{#if errorMessage && !$Cusdetails.Number}
			<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
				Phone number is required</div>
			{/if}
		{#if $Cusdetails.Number && errorMessage4}
<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
    {errorMessage4}
</div>
{/if}
	</div>
	<div class="flex-1 mb-4 mt-2">
		<label for="" class="sm:text-sm text-xs">Email <span class="text-primary-500"> *</span></label>
		<input
			type="hidden"
			name="email"
			id="email"
			bind:value={$Cusdetails.Email}
		/>
		<form
			action="?/verifyemail"
			bind:this={form3}
			method="POST"
			use:enhance={({}) => {
				return async ({ result }) => {
					isLoading = false;
					console.log("result", result);
					if (result.data?.status === 200) {
						ProfileEmailVerified = result.data.isEmailVerified;
						if (authedUserEmailVerified === true) {
							ProfileEmailVerified = true;
						}

						verificationMessage = result.data.message;

						if (
							verificationMessage.includes(
								"Verification email sent successfully. Please check your inbox.",
							)
						) {
							displayMessage = "Please check your inbox.";
							emailSent = true;
							enteredOtp = "";
							isOtpVerified = false;
						} else {
							displayMessage = verificationMessage;
							emailSent = false;
							isOtpVerified = false;
						}

						toast.success(verificationMessage);
					} else {
						toast.error(result.data.message);
						ProfileEmailVerified = result.data.isEmailVerified;
						emailSent = false;
					}
				};
			}}
			class="flex w-full items-center"
			on:submit={() => {
				isLoading = true;
			}}
		>
			<div
				class="flex items-center space-x-2 rounded md:w-3/4 sm:2/5 lg:w-1/2 w-full py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500 pr-1"
			>
				<input
					type="text"
					name="email"
					id="email"
					bind:value={$Cusdetails.Email}
					class="block w-full h-6 border-0 focus:outline-none focus:ring-0 sm:text-sm text-xs"
					on:input={() => {
						ProfileEmailVerified = false;
						emailSent = false;
						authedUserEmailVerified = false;
					}}
				/>
				{#if isLoading}
					<span
						class="text-2s font-semibold text-primary-600 flex items-center"
					>
						<Icon
							icon="line-md:loading-alt-loop"
							class="w-4 h-4 mr-1"
						/>
						Verifying...
					</span>
				{:else if !ProfileEmailVerified && !emailSent && authedUserEmailVerified !== true && data.isEmailVerified !== true}
					<button
						type="submit"
						class="sm:text-xs text-[9px] font-semibold text-primary-600 hover:underline cursor-pointer disabled:cursor-not-allowed"
						disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
							$Cusdetails.Email,
						) || $Cusdetails.Email.split("@")[1].includes("gmial")}
					>
						Verify
					</button>
				{:else if emailSent}
					<span
						class="text-2s font-semibold text-green-600 flex items-center"
					>
						{#if isOtpVerified}
							Verified
							<Icon
								icon="material-symbols:verified-rounded"
								class="w-4 h-4 ml-1"
							/>
						{:else}
							<Icon
								icon="fluent:mail-all-read-16-filled"
								class="w-4 h-4 mr-1"
							/>
							Check your inbox
						{/if}
					</span>
				{:else}
					<span
						class="text-2s font-semibold text-green-600 flex items-center"
					>
						Verified
						<Icon
							icon="material-symbols:verified-rounded"
							class="w-4 h-4 ml-1"
						/>
					</span>
				{/if}
			</div>
		</form>
		{#if $Cusdetails.Email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test($Cusdetails.Email)}
			<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
				Please enter a valid email address.
			</div>
		{/if}
		{#if errorMessage && !$Cusdetails.Email}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
			Email is required</div>
		{/if}
		{#if errorMessage7}
    <div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
        {errorMessage7}
    </div>
		{/if}
		{#if emailSent && isOtpVerified === false}
			<br />

			<form
				action="?/verifyOtpEmail"
				method="POST"
				use:enhance={() => {
					return async ({ result }) => {
						loadingotp = false;
						if (result.status === 200) {
							if (result.data.status === 200) {
								const verifiedMessage = result.data.message;
								toast.success(verifiedMessage);
								isOtpVerified = result.data.isEmailVerified;
								enteredOtpemail = "";
								ProfileEmailVerified = true;
								console.log(isOtpVerified, "isOtpVerified");
							} else {
								const errorMessage =
									result.data.message ||
									"An unknown error occurred!";
								toast.error(errorMessage);
							}
						} else {
							const errorMessage =
								result.data.message ||
								"Request failed. Please try again.";
							toast.error(errorMessage);
						}
					};
				}}
				on:submit={() => {
					loadingotp = true;
				}}
			>
				<div
					class="flex items-center space-x-1 rounded-md md:w-3/4 sm:2/5 lg:w-1/2 w-full py-1 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				>
					<input
						type="hidden"
						name="email"
						id="email"
						bind:value={$Cusdetails.Email}
					/>
					<input
						type="text"
						name="enteredOtp"
						bind:value={enteredOtpemail}
						placeholder="Enter 6-digit OTP"
						class="block w-full h-6 border-0 sm:text-sm text-xs focus:outline-none focus:ring-0"
						on:input={() => {
							enteredOtpemail = enteredOtpemail.trim();
						}}
					/>
					<button
						type="submit"
						class="text-primary-600 font-semibold sm:text-xs text-[9px] rounded hover:underline pr-4"
						disabled={loadingotp}
					>
						{#if loadingotp}
							<span
								class="text-2s font-semibold text-primary-600 flex items-center"
							>
								<Icon
									icon="line-md:loading-alt-loop"
									class="w-4 h-4 animate-spin"
								/>
								Verifying
							</span>
						{:else}
							Verify
						{/if}
					</button>
				</div>
				<div class="">
					<button
						type="button"
						on:click={handleResendOtpemail}
						disabled={loadingotp}
						class="sm:text-2s text-[8px]"
					>
						Didn't receive the code?
						<span
							class="sm:text-2s text-[8px] font-semibold text-primary-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Get a new code
						</span>
					</button>
				</div>
			</form>
		{/if}
	</div>
	<div class="mt-2 mb-2">
		<label for="" class="sm:text-sm text-xs">Company name <span class="text-primary-500"> *</span></label>
		<br />
  <input
  type="text"
  name="organisation"
  id="organisation"
  bind:value={$Cusdetails.Organisation}
  class="block rounded md:w-3/4 sm:2/5 lg:w-1/2 sm:text-sm text-xs w-full py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
  on:input={() => {
    $Cusdetails.Organisation = $Cusdetails.Organisation.trimStart(); // Avoid leading spaces

    const org = $Cusdetails.Organisation.trim();

    if (!org) {
      errors = { ...errors, organisation: "" };
    } else if (org.length < 3 || org.length > 100) {
  errors = { ...errors, organisation: "Company Name must be between 3 and 100 characters" };
}else if (!/^[A-Za-z0-9\s&\-.,!@():;"']+$/.test(org)) {
      errors = { ...errors, organisation: "Invalid characters in Company Name" };
    } else if (/<[^>]*>/.test(org)) {
      errors = { ...errors, organisation: "Company Name should not contain HTML tags" };
    } else {
      const { organisation, ...rest } = errors;
      errors = rest; 
    }
  }}
/>

{#if errors?.organisation}
  <span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
    {errors.organisation}
  </span>
{/if}

{#if errorMessage && !$Cusdetails.Organisation}
<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">   
	Company Name is required</div>
{/if}
	</div>
	<div class="flex space-x-4">
		<button
			type="button"
			on:click={cust}
			class="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded sm:text-sm text-xs sm:px-5 px-2 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-500 focus:outline-none dark:focus:ring-primary-500 my-5"
			>Save & continue</button
		>
	</div>
</div>
</div>
<div class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="material-symbols:delivery-truck-speed-outline-rounded" class="sm:w-9 sm:h-9 w-7 h-7 text-gray-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">Step 6: Delivery information</h1>
	</span>
</div>
<hr />