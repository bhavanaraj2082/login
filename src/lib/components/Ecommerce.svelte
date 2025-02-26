<script>
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";
	import { tick } from "svelte";
	import { toast, Toaster } from "svelte-sonner";
	let selectedNames = [];
	let reason = [];
	let submitting = false;
	$: reason = [...selectedNames];
	export let data;
	let authedUserEmailVerified = data?.profile?.isEmailVerified;
	console.log("authedUserEmailVerified", authedUserEmailVerified);

	// console.log("authedUserEmailVerified",authedUserEmailVerified);

	let verificationMessage = "";
	let emailSent = false;
	let displayMessage = "";
	let enteredOtp = "";
	let enteredOtpemail = "";
	let isOtpVerified = false;
	let isOtpPhoneVerified = false;
	let isLoading = false;
	let showSuccesDiv = false;
	let showFailureDiv = false;
	let ProfileEmailVerified;
	let form3;
	import { enhance } from "$app/forms";
	const countries = [
		{ name: "Afghanistan", code: "+93" },
		{ name: "Albania", code: "+355" },
		{ name: "Algeria", code: "+213" },
		{ name: "Andorra", code: "+376" },
		{ name: "Angola", code: "+244" },
		{ name: "Antigua and Barbuda", code: "+1-268" },
		{ name: "Argentina", code: "+54" },
		{ name: "Armenia", code: "+374" },
		{ name: "Australia", code: "+61" },
		{ name: "Austria", code: "+43" },
		{ name: "Azerbaijan", code: "+994" },
		{ name: "Bahamas", code: "+1-242" },
		{ name: "Bahrain", code: "+973" },
		{ name: "Bangladesh", code: "+880" },
		{ name: "Barbados", code: "+1-246" },
		{ name: "Belarus", code: "+375" },
		{ name: "Belgium", code: "+32" },
		{ name: "Belize", code: "+501" },
		{ name: "Benin", code: "+229" },
		{ name: "Bhutan", code: "+975" },
		{ name: "Bolivia", code: "+591" },
		{ name: "Bosnia and Herzegovina", code: "+387" },
		{ name: "Botswana", code: "+267" },
		{ name: "Brazil", code: "+55" },
		{ name: "Brunei", code: "+673" },
		{ name: "Bulgaria", code: "+359" },
		{ name: "Burkina Faso", code: "+226" },
		{ name: "Burundi", code: "+257" },
		{ name: "Cabo Verde", code: "+238" },
		{ name: "Cambodia", code: "+855" },
		{ name: "Cameroon", code: "+237" },
		{ name: "Canada", code: "+1" },
		{ name: "Central African Republic", code: "+236" },
		{ name: "Chad", code: "+235" },
		{ name: "Chile", code: "+56" },
		{ name: "China", code: "+86" },
		{ name: "Colombia", code: "+57" },
		{ name: "Comoros", code: "+269" },
		{ name: "Congo, Republic of the", code: "+242" },
		{ name: "Congo, Democratic Republic of the", code: "+243" },
		{ name: "Costa Rica", code: "+506" },
		{ name: "Croatia", code: "+385" },
		{ name: "Cuba", code: "+53" },
		{ name: "Cyprus", code: "+357" },
		{ name: "Czech Republic", code: "+420" },
		{ name: "Denmark", code: "+45" },
		{ name: "Djibouti", code: "+253" },
		{ name: "Dominica", code: "+1-767" },
		{ name: "Dominican Republic", code: "+1-809" },
		{ name: "Ecuador", code: "+593" },
		{ name: "Egypt", code: "+20" },
		{ name: "El Salvador", code: "+503" },
		{ name: "Equatorial Guinea", code: "+240" },
		{ name: "Eritrea", code: "+291" },
		{ name: "Estonia", code: "+372" },
		{ name: "Eswatini", code: "+268" },
		{ name: "Ethiopia", code: "+251" },
		{ name: "Fiji", code: "+679" },
		{ name: "Finland", code: "+358" },
		{ name: "France", code: "+33" },
		{ name: "Gabon", code: "+241" },
		{ name: "Gambia", code: "+220" },
		{ name: "Georgia", code: "+995" },
		{ name: "Germany", code: "+49" },
		{ name: "Ghana", code: "+233" },
		{ name: "Greece", code: "+30" },
		{ name: "Grenada", code: "+1-473" },
		{ name: "Guatemala", code: "+502" },
		{ name: "Guinea", code: "+224" },
		{ name: "Guinea-Bissau", code: "+245" },
		{ name: "Guyana", code: "+592" },
		{ name: "Haiti", code: "+509" },
		{ name: "Honduras", code: "+504" },
		{ name: "Hungary", code: "+36" },
		{ name: "Iceland", code: "+354" },
		{ name: "India", code: "+91" },
		{ name: "Indonesia", code: "+62" },
		{ name: "Iran", code: "+98" },
		{ name: "Iraq", code: "+964" },
		{ name: "Ireland", code: "+353" },
		{ name: "Israel", code: "+972" },
		{ name: "Italy", code: "+39" },
		{ name: "Jamaica", code: "+1-876" },
		{ name: "Japan", code: "+81" },
		{ name: "Jordan", code: "+962" },
		{ name: "Kazakhstan", code: "+7" },
		{ name: "Kenya", code: "+254" },
		{ name: "Kiribati", code: "+686" },
		{ name: "Kuwait", code: "+965" },
		{ name: "Kyrgyzstan", code: "+996" },
		{ name: "Laos", code: "+856" },
		{ name: "Latvia", code: "+371" },
		{ name: "Lebanon", code: "+961" },
		{ name: "Lesotho", code: "+266" },
		{ name: "Liberia", code: "+231" },
		{ name: "Libya", code: "+218" },
		{ name: "Liechtenstein", code: "+423" },
		{ name: "Lithuania", code: "+370" },
		{ name: "Luxembourg", code: "+352" },
		{ name: "Madagascar", code: "+261" },
		{ name: "Malawi", code: "+265" },
		{ name: "Malaysia", code: "+60" },
		{ name: "Maldives", code: "+960" },
		{ name: "Mali", code: "+223" },
		{ name: "Malta", code: "+356" },
		{ name: "Marshall Islands", code: "+692" },
		{ name: "Mauritania", code: "+222" },
		{ name: "Mauritius", code: "+230" },
		{ name: "Mexico", code: "+52" },
		{ name: "Micronesia", code: "+691" },
		{ name: "Moldova", code: "+373" },
		{ name: "Monaco", code: "+377" },
		{ name: "Mongolia", code: "+976" },
		{ name: "Montenegro", code: "+382" },
		{ name: "Morocco", code: "+212" },
		{ name: "Mozambique", code: "+258" },
		{ name: "Myanmar", code: "+95" },
		{ name: "Namibia", code: "+264" },
		{ name: "Nauru", code: "+674" },
		{ name: "Nepal", code: "+977" },
		{ name: "Netherlands", code: "+31" },
		{ name: "New Zealand", code: "+64" },
		{ name: "Nicaragua", code: "+505" },
		{ name: "Niger", code: "+227" },
		{ name: "Nigeria", code: "+234" },
		{ name: "North Macedonia", code: "+389" },
		{ name: "Norway", code: "+47" },
		{ name: "Oman", code: "+968" },
		{ name: "Pakistan", code: "+92" },
		{ name: "Palau", code: "+680" },
		{ name: "Palestine", code: "+970" },
		{ name: "Panama", code: "+507" },
		{ name: "Papua New Guinea", code: "+675" },
		{ name: "Paraguay", code: "+595" },
		{ name: "Peru", code: "+51" },
		{ name: "Philippines", code: "+63" },
		{ name: "Poland", code: "+48" },
		{ name: "Portugal", code: "+351" },
		{ name: "Qatar", code: "+974" },
		{ name: "Romania", code: "+40" },
		{ name: "Russia", code: "+7" },
		{ name: "Rwanda", code: "+250" },
		{ name: "Saint Kitts and Nevis", code: "+1-869" },
		{ name: "Saint Lucia", code: "+1-758" },
		{ name: "Saint Vincent and the Grenadines", code: "+1-784" },
		{ name: "Samoa", code: "+685" },
		{ name: "San Marino", code: "+378" },
		{ name: "Sao Tome and Principe", code: "+239" },
		{ name: "Saudi Arabia", code: "+966" },
		{ name: "Senegal", code: "+221" },
		{ name: "Serbia", code: "+381" },
		{ name: "Seychelles", code: "+248" },
		{ name: "Sierra Leone", code: "+232" },
		{ name: "Singapore", code: "+65" },
		{ name: "Slovakia", code: "+421" },
		{ name: "Slovenia", code: "+386" },
		{ name: "Solomon Islands", code: "+677" },
		{ name: "Somalia", code: "+252" },
		{ name: "South Africa", code: "+27" },
		{ name: "South Korea", code: "+82" },
		{ name: "Spain", code: "+34" },
		{ name: "Sri Lanka", code: "+94" },
		{ name: "Sudan", code: "+249" },
		{ name: "Suriname", code: "+597" },
		{ name: "Sweden", code: "+46" },
		{ name: "Switzerland", code: "+41" },
		{ name: "Syria", code: "+963" },
		{ name: "Taiwan", code: "+886" },
		{ name: "Tajikistan", code: "+992" },
		{ name: "Tanzania", code: "+255" },
		{ name: "Thailand", code: "+66" },
		{ name: "Togo", code: "+228" },
		{ name: "Tonga", code: "+676" },
		{ name: "Trinidad and Tobago", code: "+1-868" },
		{ name: "Tunisia", code: "+216" },
		{ name: "Turkey", code: "+90" },
		{ name: "Turkmenistan", code: "+993" },
		{ name: "Tuvalu", code: "+688" },
		{ name: "Uganda", code: "+256" },
		{ name: "Ukraine", code: "+380" },
		{ name: "United Arab Emirates", code: "+971" },
		{ name: "United Kingdom", code: "+44" },
		{ name: "United States", code: "+1" },
		{ name: "Uruguay", code: "+598" },
		{ name: "Uzbekistan", code: "+998" },
		{ name: "Vanuatu", code: "+678" },
		{ name: "Vatican City", code: "+39" },
		{ name: "Venezuela", code: "+58" },
		{ name: "Vietnam", code: "+84" },
		{ name: "Yemen", code: "+967" },
		{ name: "Zambia", code: "+260" },
		{ name: "Zimbabwe", code: "+263" },
	];
	const phoneNumberPatterns = {
		Afghanistan: /^[7-9]\d{8}$/,
		Algeria: /^[5-9]\d{8}$/,
		Andorra: /^\+376[0-9]{6}$/,
		Angola: /^(\+244|0)9\d{8}$/,
		"Antigua and Barbuda": /^\+1[2689]\d{7}$/,
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
		"Bosnia and Herzegovina": /^(\+387|0)\d{8}$/,
		"Burkina Faso": /^(\+226|0)\d{8}$/,
		Burundi: /^(\+257|0)\d{8}$/,
		"Cabo Verde": /^(\+238|0)\d{7}$/,
		Cambodia: /^(\+855|0)\d{8,9}$/,
		Cameroon: /^(\+237|0)\d{8}$/,
		"Central African Republic": /^(\+236|0)\d{8}$/,
		Chad: /^(\+235|0)\d{8}$/,
		Comoros: /^(\+269|0)\d{7}$/,
		"Congo, Republic of the": /^(\+242|0)\d{7}$/,
		"Congo, Democratic Republic of the": /^(\+243|0)\d{9}$/,
		"Costa Rica": /^(\+506|0)\d{8}$/,
		Croatia: /^(\+385|0)9\d{8}$/,
		Cyprus: /^(\+357|0)\d{8}$/,
		"Czech Republic": /^(\+420|0)\d{9}$/,
		Djibouti: /^(\+253|0)\d{7}$/,
		Dominica: /^(\+1[7678]|0)\d{7}$/,
		"Dominican Republic": /^(\+1[809]|0)\d{7}$/,
		Ecuador: /^(\+593|0)\d{9}$/,
		"El Salvador": /^(\+503|0)\d{8}$/,
		"Equatorial Guinea": /^(\+240|0)\d{8}$/,
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
		"Guinea-Bissau": /^(\+245|0)\d{7}$/,
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
		"Marshall Islands": /^(\+692|0)\d{7}$/,
		Mauritania: /^(\+222|0)\d{8}$/,
		Micronesia: /^(\+691|0)\d{7}$/,
		Monaco: /^(\+377|0)\d{8}$/,
		Mongolia: /^(\+976|0)\d{8}$/,
		Montenegro: /^(\+382|0)\d{8}$/,
		Mozambique: /^(\+258|0)\d{9}$/,
		Myanmar: /^(\+95|0)\d{9}$/,
		Nauru: /^(\+674|0)\d{4}$/,
		Netherlands: /^(\+31|0)\d{9}$/,
		"New Zealand": /^(\+64|0)\d{9}$/,
		Niger: /^(\+227|0)\d{8}$/,
		Nigeria: /^(\+234|0)\d{10}$/,
		"North Macedonia": /^(\+389|0)\d{9}$/,
		Oman: /^(\+968|0)\d{8}$/,
		Palau: /^(\+680|0)\d{7}$/,
		Palestine: /^(\+970|0)\d{9}$/,
		Panama: /^(\+507|0)\d{7}$/,
		"Papua New Guinea": /^(\+675|0)\d{7}$/,
		Paraguay: /^(\+595|0)\d{9}$/,
		Poland: /^(\+48|0)\d{9}$/,
		Portugal: /^(\+351|0)\d{9}$/,
		Romania: /^(\+40|0)\d{9}$/,
		"Saint Kitts and Nevis": /^(\+1[869]|0)\d{7}$/,
		"Saint Lucia": /^(\+1[758]|0)\d{7}$/,
		"Saint Vincent and the Grenadines": /^(\+1[784]|0)\d{7}$/,
		Samoa: /^(\+685|0)\d{5}$/,
		"San Marino": /^(\+378|0)\d{7}$/,
		"Sao Tome and Principe": /^(\+239|0)\d{7}$/,
		"Saudi Arabia": /^(\+966|0)\d{9}$/,
		Senegal: /^(\+221|0)\d{9}$/,
		Seychelles: /^(\+248|0)\d{7}$/,
		"Sierra Leone": /^(\+232|0)\d{8}$/,
		Slovakia: /^(\+421|0)\d{9}$/,
		Slovenia: /^(\+386|0)\d{8}$/,
		"Solomon Islands": /^(\+677|0)\d{5}$/,
		Somalia: /^(\+252|0)\d{8}$/,
		"South Africa": /^(\+27|0)\d{9}$/,
		"South Korea": /^(\+82|0)\d{9}$/,
		Spain: /^(\+34|0)\d{9}$/,
		"Sri Lanka": /^(\+94|0)\d{9}$/,
		Syria: /^(\+963|0)\d{9}$/,
		Togo: /^(\+228|0)\d{8}$/,
		"Trinidad and Tobago": /^(\+1[868]|0)\d{7}$/,
		Tuvalu: /^(\+688|0)\d{4}$/,
		Uganda: /^(\+256|0)\d{9}$/,
		Ukraine: /^(\+380|0)\d{9}$/,
		"United Arab Emirates": /^(\+971|0)\d{9}$/,
		"United Kingdom": /^(\+44|0)\d{10}$/,
		"United States": /^(\+1|0)\d{10}$/,
		Uruguay: /^(\+598|0)\d{8}$/,
		Uzbekistan: /^(\+998|0)\d{9}$/,
		Vanuatu: /^(\+678|0)\d{5}$/,
		"Vatican City": /^(\+379|0)\d{7}$/,
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
		Tonga: /^\d{7}$/,
	};
	let isDataAvailable = false;
	let isEditable = false;
	onMount(() => {
		if (data && data.profile) {
			name =
				`${data.profile.firstname || ""} ${data.profile.lastname || ""}`.trim();
			email = data.profile.email || "";
			number = data.profile.cellPhone || "";

			const profileCountry = data.profile.country?.trim();
			if (profileCountry) {
				const foundCountry = countries.find(
					(c) =>
						c.name.toLowerCase() === profileCountry.toLowerCase(),
				);
				if (foundCountry) {
					location = foundCountry.name;
				}
			}

			isDataAvailable = true;
		} else {
			name = "";
			email = data?.email || "";
			number = "";

			location = "";
			isDataAvailable = false;

			if (data?.email) {
				email = data.email;
				const reloadFlag = sessionStorage.getItem("emailReloaded");
				if (!reloadFlag) {
					sessionStorage.setItem("emailReloaded", "true");
					location.reload(); // This will reload the page only once to prevent infinite reload
				} else {
					sessionStorage.removeItem("emailReloaded");
				}
			}
		}

		isEditable = false;
	});
	let isChecked = false;
	let phone = "";
	let name = "";
	let message = "";
	let subject = "";
	let formValid = true;
	let formSubmitted = false;
	let showErrors = false;
	let successMessage = "";
	let errorMessage = "";
	let fname = "";
	let lname = "";
	let email = "";
	let number = "";
	let location = "";
	let details = "";
	let company = "";
	let role = "";
	function resetForm() {
		phone = "";
		name = "";
		message = "";
		subject = "";
		successMessage = "";
		errorMessage = "";
		fname = "";
		lname = "";
		email = "";
		number = "";
		location = "";
		details = "";
		company = "";
		role = "";
		selectedNames = [];
	}
	function handleSubmit(event) {
		if (
			number.length === 0 ||
			email.length === 0 ||
			fname.length === 0 ||
			company.length === 0 ||
			details.length === 0 ||
			role.length === 0 ||
			lname.length === 0 ||
			reason.length === 0 ||
			!isChecked
		) {
			console.log("Validation failed: Missing required fields");
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
		const messageContainer = document.querySelector(".message-container");
		if (messageContainer) {
			setTimeout(() => {
				messageContainer.scrollIntoView({ behavior: "smooth" });
			}, 100);
		}
		if (keywordError === "success") {
			setTimeout(() => {
				resetForm();
			}, 2000);
		}
	}
	function validatePhoneNumber(location, number) {
		const pattern = phoneNumberPatterns[location];
		if (!pattern) {
			throw new Error(
				`No validation pattern found for location: ${location}`,
			);
		}
		return pattern.test(number);
	}
	let loadingotp = false;
	const handleResendOtpemail = () => {
		if (!loadingotp) {
			form3.requestSubmit();
		}
	};
	let searchTerm = "";
    let showDropdown = false;
    let filteredCountries = [];

	function filterCountries() {
		filteredCountries = countries.filter(
			(location) =>
				location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				location.code
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
			selectlocation(filteredCountries[0]);
		} else {
			showDropdown = filteredCountries.length > 0; 
		}
	}
	function selectlocation(selectedlocation) {
		location = selectedlocation.name;
		searchTerm = `${selectedlocation.name} `;
		showDropdown = false;
		validatePhoneNumber(location, number);
		delete errors.location;
	}

    function handleInputChange(event) {
        searchTerm = event.target.value;
        filterCountries();
    }

    function toggleDropdown() {
        showDropdown = !showDropdown;
    }
</script>

{#if showSuccesDiv}
	<div
		class="h-4/5 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl mb-10"
	>
		<div
			class="w-10/12 md:w-8/12 bg-gradient-to-r from-green-100 via-green-50 to-green-100 p-8 rounded-lg shadow-lg text-center"
		>
			<h3 class="text-2xl font-semibold text-green-600 mb-4">
				Chemikart Solution Submission
			</h3>
			<p class="text-lg text-gray-700 mb-6">
				Thank you for reaching out! We have received your inquiry and
				will get back to you with a tailored solution shortly.
			</p>

			<div class="w-10/12 mx-auto my-6 border-t-2 border-green-300"></div>
			<div>
				<a
					href="/ecom-solutions"
					class="bg-white text-primary-500 border border-primary-500 px-4 py-2 rounded-md hover:bg-primary-500 hover:text-white transition"
				>
					Return to Solutions Page
				</a>
			</div>
		</div>
	</div>
{:else if showFailureDiv}
	<div class="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
		<p class="font-semibold mb-4">
			There was a problem submitting the form. Please try again after some
			time.
		</p>
		<a
			href="/contact-us"
			class="bg-white w-fit border text-black border-gray-500 px-4 py-2 rounded-md transition block"
		>
			Report Issue
		</a>
	</div>
{:else}
	<section class="md:w-11/12 mx-auto max-w-7xl px-6 md:px-2 bg-gray-50">
		<section class="mt-6">
			<div class="text-primary-400 text-2xl font-semibold mb-7">
				Chemikart Solutions
			</div>
			<p class="leading-6 text-content mx-auto text-justify-center">
				We offer a full range of e-Commerce tools designed to enable
				greater spend control for your procurement staff, providing your
				researchers with ease of access to the products they've come to
				rely on.
			</p>
			<p class="leading-6 text-content mx-auto text-justify-center mt-2">
				We have three solutions available to help you save time and cost
				in procurement management. Read further for more details of each
				solution, or fill out our contact form and our team will reach
				out to you to answer any questions.
			</p>
			<div class="mt-12 mx-auto">
				<div
					class="flex gap-5 flex-wrap lg:flex-nowrap max-md:flex-col"
				>
					<div class="w-full lg:w-3/5">
						<div class="space-y-10 md:space-y-8 max-md:space-y-6">
							<div
								class="flex flex-col md:flex-row items-start gap-4"
							>
								<Icon
									icon="game-icons:on-target"
									class="w-10 h-10 text-primary-400 flex-shrink-0"
								/>
								<div class="flex-auto">
									<h2
										class="font-semibold text-lg font-worksans text-primary-400"
									>
										The One-to-One Solution: E-Procurement
									</h2>
									<p class="text-content mt-4">
										e-Procurement provides seamless
										system-to-system connectivity of your
										existing spend management system.
									</p>
								</div>
							</div>
							<div
								class="flex flex-col md:flex-row items-start gap-4"
							>
								<Icon
									icon="mdi:family-tree"
									class="w-10 h-8 text-primary-400 flex-shrink-0"
								/>
								<div class="flex-auto">
									<h2
										class="font-semibold text-lg font-worksans text-primary-400"
									>
										The Customized Solution: Pipeline®
									</h2>
									<p class="text-content mt-4">
										This customized service balances your
										organization's business needs with the
										product requirements of your
										researchers.
									</p>
								</div>
							</div>
							<div
								class="flex flex-col md:flex-row items-start gap-4"
							>
								<Icon
									icon="fluent-mdl2:text-document-shared"
									class="w-10 h-8 text-primary-400 flex-shrink-0"
								/>
								<div class="flex-auto">
									<h2
										class="font-semibold text-lg font-worksans text-primary-400"
									>
										The Simple Solution: Chemikart E-Shop
									</h2>
									<p class="text-content mt-4">
										Your procurement staff can access our
										products simply, easily, and securely
										through chemikart.com.
									</p>
								</div>
							</div>
						</div>
					</div>
					<aside
						class="w-full lg:w-1/3 md:ml-0 lg:ml-8 max-md:w-full"
					>
						<div
							class="flex flex-col items-start space-y-5 text-black"
						>
							<Icon
								icon="game-icons:chemical-drop"
								class="w-20 h-24 text-primary-400"
							/>
							<p class="text-content">
								Discover our latest website features and enhance
								your experience with Chemikart.<br />Find
								information regarding new features as well as
								tips and tricks with Get Site Smart.
							</p>
							<div class="mt-8"></div>
						</div>
					</aside>
				</div>
			</div>
		</section>
		<section class="mx-1 md:mx-1">
			<hr
				class="self-center mt-20 h-px w-full border border-black border-opacity-40 max-md:mt-10"
			/>
		</section>
		<section class="px-4 mt-8">
			<div class="flex gap-8 max-md:flex-col">
				<div class="flex flex-col w-2/3 max-md:w-full">
					<div
						class="flex flex-col text-sm leading-6 text-black max-md:mt-6"
					>
						<h3
							class="font-semibold text-lg font-worksans mt-8 text-primary-400"
						>
							The One-to-One Solution: E-Procurement
						</h3>
						<p class="mt-4 text-content">
							Chemikart is your source for procurement
							optimization. If you are already using an electronic
							spend management solution, leverage your investment
							to generate even greater savings by automating
							Chemikart's purchases and link your current buying
							platform to us.
						</p>
						<p class="mt-4 text-content">
							We support all major e-Procurement providers and
							have a dedicated technical team available to work
							with your organization or platform provider and
							install customized, scalable, all-in-one procurement
							solutions. e-Procurement offers efficiencies across
							the purchasing cycle, enabling product selection
							through e-Catalogs, both punchout or hosted file,
							accepting e-Purchase orders, sending electronic
							invoices, order confirmations, and advanced shipping
							notices, and more.
						</p>
						<h4
							class="mt-6 font-semibold text-lg font-worksans text-primary-400"
						>
							Three Steps to Install e-Procurement
						</h4>
						<ol
							class="list-decimal list-inside mt-4 space-y-3 text-content"
						>
							<li>
								Create a Project Plan: We will partner with you
								to gather requirements, provide detailed
								analysis, then implement a project plan with
								milestones.
							</li>
							<li>
								Setup & Testing: We will work through setup and
								testing to ensure end-to-end processes are in
								place.
							</li>
							<li>
								Launch and Go-Live Monitoring: After testing, we
								provide post-go-live monitoring to ensure the
								solution meets your expectations.
							</li>
						</ol>
					</div>
				</div>
				<div class="flex flex-col w-1/3 max-md:w-full max-md:mt-6">
					<h3
						class="font-semibold text-lg font-worksans mt-8 text-primary-400"
					>
						Benefits to e-Procurement
					</h3>
					<ol
						class="list-decimal list-inside mt-4 space-y-3 text-content"
					>
						<li>
							Process efficiency from end-to-end driven by
							real-time data exchange, speed, and transaction
							efficiency.
						</li>
						<li>
							Cost Reduction via reduced transaction costs and
							administrative overhead.
						</li>
						<li>
							A variety of spend analysis options and direct spend
							control.
						</li>
						<li>
							Automated transactions increase productivity through
							improved order handling accuracy, paperless
							invoicing, and faster procure-to-pay cycles.
						</li>
						<li>
							Global approach and management of scale, harmonized
							for all your sites.
						</li>
					</ol>
					<a href="#contact-team"> </a>
				</div>
			</div>
			<div class="flex gap-8 max-md:flex-col mt-12">
				<div class="flex flex-col w-2/3 max-md:w-full">
					<h3
						class="font-semibold text-lg font-worksans mt-8 text-primary-400"
					>
						The Customized Solution: Pipeline®
					</h3>
					<p class="mt-4 text-content">
						An advanced ordering process customized to meet your
						business needs. PIPELINE® delivers options and benefits
						beyond simple ordering, providing direct, private
						connection to our order processing and fulfillment
						system. Flexible ordering processes are customized to
						meet your organization's requirements.
					</p>
					<p class="mt-4 text-content">
						When you create your order through PIPELINE®, you see
						the exact purchase total. In addition, it provides a
						portal to information and special offers that have been
						tailored specifically for your organization.
					</p>
					<p class="mt-4 text-content">
						To learn more about creating your PIPELINE® experience,
						submit the form to have one of our team members reach
						out.
					</p>
				</div>
				<div class="flex flex-col w-1/3 max-md:w-full max-md:mt-6">
					<h4
						class="font-semibold text-lg font-worksans mt-8 text-primary-400"
					>
						Benefits of PIPELINE®
					</h4>
					<ul
						class="list-disc list-inside mt-4 space-y-2 text-content"
					>
						<li>Elimination of paper transactions</li>
						<li>No IT investment required</li>
						<li>Support of procurement approval levels</li>
						<li>
							Real-time product availability with contract pricing
						</li>
						<li>Customized invoicing and payment</li>
						<li>Streamlined reconciliation process</li>
					</ul>
					<a href="#contact-team"> </a>
				</div>
			</div>
			<div class="flex gap-8 max-md:flex-col mt-12">
				<div class="flex flex-col w-2/3 max-md:w-full">
					<h3
						class="font-semibold text-lg font-worksans mt-8 text-primary-400"
					>
						The Simple Solution: Chemikart E-Shop
					</h3>
					<p class="mt-4 text-content">
						Your online order is integrated with our fulfillment
						systems, allowing for rapid processing. You can request
						quotes, place orders, and track deliveries all in one
						place.
					</p>
					<p class="mt-4 text-content">
						With Chemikart.com as the leading Web site in the
						industry, you can rest assured you're getting the most
						competitive service available.
					</p>
				</div>
				<div class="flex flex-col w-1/3 max-md:w-full max-md:mt-6">
					<h4
						class="font-semibold text-lg font-worksans mt-8 text-primary-400"
					>
						Benefits of the Chemikart e-Shop:
					</h4>
					<ul
						class="list-disc list-inside mt-4 space-y-2 text-content"
					>
						<li>Your information is safe and secure</li>
						<li>Advanced tools and product searches</li>
						<li>Account-specific pricing</li>
						<li>e-Quotes converted directly to orders</li>
					</ul>
					<a href="#contact-team"> </a>
				</div>
			</div>
		</section>
		<section class="mx-1 md:mx-1">
			<hr
				class="self-center mt-20 h-px w-full border border-black border-opacity-40 max-md:mt-10"
			/>
		</section>
		<section
			id="contact-team"
			class="flex flex-col items-start py-6 w-full max-md:px-2 md:mt-10 scroll-smooth"
		>
			<h2
				class="font-semibold text-2xl font-worksans text-primary-400 ml-3"
			>
				Contact Our Team
			</h2>
			<form
				method="POST"
				action="?/contactus"
				class="w-full mt-3 max-w-3xl ml-3"
				use:enhance={(event) => {
					submitting= true;
					const isEmailVerified = ProfileEmailVerified; // Assuming this is the first email verification check
					const isAuthedUserEmailVerified = authedUserEmailVerified; // The second email verification check
					console.log(
						isEmailVerified,
						isAuthedUserEmailVerified,
						"Email verification status",
					);
					if (!(isEmailVerified || isAuthedUserEmailVerified)) {
						console.log("Email is not verified");
						toast.error("Please verify your email to proceed");
						event.preventDefault();
						// Return a function that does nothing to prevent form submission
						return () => {};
					}

					return async ({ result }) => {
						let message1 = "";
						let keywordError = "";
						console.log(result);
						keywordError = result.data.type;
						if (keywordError === "success") {
							message1 = result.data.data.message;
							submitting = false;
							showSuccesDiv = true;
							console.log(message1);
						} else if (keywordError === "error") {
							submitting = false;
							message1 = result.data.data.error;
							toast.error(message1);
							showFailureDiv = true;
							
							console.log(message1);
						}
						showMessage(message1, keywordError);
						setTimeout(() => {
							window.scrollTo({ top: 0, behavior: "smooth" });
						}, 100);
					};
				}}
			>
				<!-- <div class="message-container mt-3">
        {#if errorMessage === "success"}
            <div class="text-center bg-green-100 text-green-700 py-2 mb-4 rounded-md">
                {successMessage}
            </div>
            {:else if errorMessage === 'error'}
                <div class="text-center bg-red-100 text-red-700 py-2 mb-4 rounded-md">
                    {successMessage}
                </div>
            {/if}
    </div> -->
				<div>
					<p
						class="mb-5 mt-6 text-bold font-semibold text-primary-400"
					>
						Select all that apply
					</p>
				</div>
				<div>
					<label class="flex items-center space-x-2 text-lg">
						<!-- type="checkbox"
                    class="form-checkbox rounded text-primary-600 mr-2 focus:outline-none focus:ring-0" -->
						<input
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0"
							value="I have a question about an existing B2B connection "
						/>
						<span class="mb-5 text-xs"
							>I have a question about an existing B2B connection.</span
						>
					</label>
					<label class="flex items-center space-x-2 text-lg">
						<input
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0"
							value=" I would like to have more information about B2B solutions "
						/>
						<span class="mb-5 text-xs"
							>I would like to have more information about B2B
							solutions</span
						>
					</label>
					<label class="flex items-center space-x-2 text-lg">
						<input
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0"
							value=" I would like to be contacted about setting up a B2B connection "
						/>
						<span class="mb-5 text-xs"
							>I would like to be contacted about setting up a B2B
							connection</span
						>
					</label>
					<label class="flex items-center space-x-2 text-lg">
						<input
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0"
							value=" I would like to know if there is an existing B2B connection for my organization "
						/>
						<span class="mb-5 text-xs"
							>I would like to know if there is an existing B2B
							connection for my organization</span
						>
					</label>
					<label class="flex items-center space-x-2 text-lg">
						<input
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0"
							value=" I have another question (fill in Additional details)"
						/>
						<span class="mb-5 text-xs"
							>I have another question (fill in Additional
							details)</span
						>
					</label>
				</div>
				<div
					class="w-full mt-3 max-w-full sm:max-w-lg md:max-w-3xl overflow-hidden"
				>
					<div class="flex flex-col md:flex-row md:space-x-4">
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="text"
								name="fname"
								id="fname"
								bind:value={fname}
								class="flex text-sm w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-400 focus:shadow-none focus:ring-0 placeholder-gray-400"
								placeholder="First Name*"
							/>
							{#if showErrors && fname.length === 0}
								<span class="text-red-400 text-xs"
									>First Name is required</span
								>
							{/if}
							{#if fname.length > 0 && !/^[A-Za-z\s]+$/.test(fname)}
								<span class="text-red-400 text-xs"
									>First Name cannot contain numbers or
									special characters</span
								>
							{/if}
						</div>
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="text"
								name="lname"
								id="lname"
								bind:value={lname}
								class="flex w-full border border-gray-300 text-sm p-2 rounded focus:outline-none focus:border-primary-400 focus:shadow-none focus:ring-0 placeholder-gray-400"
								placeholder="Last Name*"
							/>
							{#if showErrors && lname.length === 0}
								<span class="text-red-400 text-xs"
									>Last Name is required</span
								>
							{/if}
							{#if lname.length > 0 && !/^[A-Za-z\s]+$/.test(lname)}
								<span class="text-red-400 text-xs"
									>Last Name cannot contain numbers or special
									characters</span
								>
							{/if}
						</div>
					</div>
					<div class="flex flex-col md:flex-row md:space-x-4">
						<div class="flex-1 mb-4 relative w-full">
							<div class="relative">
							<input
								type="text"
								id="location" 
								name="location"
								bind:value={location}
								placeholder="Location"
								on:input={handleInputChange}
								on:click={toggleDropdown}
								class="w-full text-sm px-2 py-2 placeholder-gray-400 rounded  border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-500"
								required
							/>
						
							<Icon
								icon={showDropdown ? "ep:arrow-up-bold" : "ep:arrow-down-bold"}
								class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
								on:click={toggleDropdown}
							/>
							</div>
						
							<!-- Dropdown Suggestions -->
							{#if showDropdown}
								<div class="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
									<ul class="max-h-60 overflow-y-auto text-sm">
										{#each filteredCountries as location (location.name)}
											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
											<li
												on:click={() => selectlocation(location)}
												class="px-4 py-2 cursor-pointer hover:bg-gray-100"
											>
												{location.name} ({location.code})
											</li>
										{/each}
										{#if filteredCountries.length === 1}
											<div class="px-4 py-2 text-gray-600 text-xs">No matching countries found!</div>
										{/if}
									</ul>
								</div>
							{/if}
						
							<!-- Validation Message -->
							{#if showErrors && location.length === 0}
								<span class="text-red-500 text-xs font-medium">location is required</span>
							{/if}
						</div>
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="tel"
								name="number"
								id="number"
								bind:value={number}
								class="block w-full border border-gray-300 text-sm p-2 rounded focus:outline-none focus:border-primary-400 focus:shadow-none focus:ring-0 placeholder-gray-400"
								placeholder="Phone Number*"
							/>
							{#if showErrors && number.length === 0}
								<span class="text-red-400 text-xs"
									>Number is required</span
								>
							{/if}
							<!-- {#if number.length > 0 && !/^\+?[0-9]{10}$/.test(number)}
                                    <span class="text-red-400 text-xs">Please enter a valid number number.</span>
                                {/if} -->
							{#if number.length > 0 && !validatePhoneNumber(location, number)}
								<span class="text-red-400 text-xs"
									>Please enter a valid phone number for {location}</span
								>
							{/if}
						</div>
					</div>
					<div class="flex flex-col md:flex-row md:space-x-4">
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="text"
								name="company"
								id="company"
								bind:value={company}
								class="block w-full border border-gray-300 text-sm p-2 rounded focus:outline-none focus:border-primary-400 focus:shadow-none focus:ring-0 placeholder-gray-400"
								placeholder="Company Name*"
							/>
							{#if showErrors && company.length === 0}
								<span class="text-red-400 text-xs"
									>Company Name is required</span
								>
							{/if}
						</div>
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="text"
								name="role"
								id="role"
								bind:value={role}
								class="block w-full border border-gray-300 text-sm p-2 rounded focus:outline-none focus:border-primary-400 focus:shadow-none focus:ring-0 placeholder-gray-400"
								placeholder="Role*"
							/>
							{#if showErrors && role.length === 0}
								<span class="text-red-400 text-xs"
									>Role is required</span
								>
							{/if}
						</div>
					</div>
					<div class="flex flex-col md:flex-row md:space-x-4">
						<div class="flex-1 mb-4 sm:w-full">
							<!-- <input type="text" name="email" id="email" bind:value={email} class="block w-full border border-gray-300 text-sm p-2 rounded focus:outline-none focus:border-primary-400 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Email Address*" /> -->
							<input
								type="hidden"
								name="email"
								id="email"
								bind:value={email}
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
											ProfileEmailVerified =
												result.data.isEmailVerified;
											if (
												authedUserEmailVerified === true
											) {
												ProfileEmailVerified = true;
											}

											verificationMessage =
												result.data.message;

											if (
												verificationMessage.includes(
													"Verification email sent successfully. Please check your inbox.",
												)
											) {
												displayMessage =
													"Please check your inbox.";
												emailSent = true;
												enteredOtp = "";
												isOtpVerified = false;
											} else {
												displayMessage =
													verificationMessage;
												emailSent = false;
												isOtpVerified = false;
											}

											toast.success(verificationMessage);
										} else {
											toast.error(result.data.message);
											ProfileEmailVerified =
												result.data.isEmailVerified;
											emailSent = false;
										}
									};
								}}
								class="flex w-full items-center"
								on:submit={() => {
									isLoading = true;
								}}
							>
								<div class="relative w-full">
									<input
										type="text"
										name="email"
										id="email"
										bind:value={email}
										class="flex w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400"
										placeholder="Email"
										on:input={() => {
											email = email.trim();

											ProfileEmailVerified = false;
											emailSent = false;
											authedUserEmailVerified = false;
										}}
									/>
									{#if showErrors && email.length === 0}
										<span class="text-red-400 text-xs"
											>Email is required</span
										>
									{/if}
									{#if email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)}
										<span class="text-red-400 text-xs"
											>Please enter a valid email address.</span
										>
									{/if}
									{#if isLoading}
										<span
											class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-primary-600 flex items-center"
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
											class="absolute right-2 top-1/2 mt- transform -translate-y-1/2 text-2s font-semibold text-primary-600 hover:underline cursor-pointer disabled:cursor-not-allowed"
											disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
												email,
											) ||
												email
													.split("@")[1]
													.includes("gamil")}
										>
											Verify
										</button>
									{:else if emailSent}
										<span
											class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
										>
											{#if isOtpVerified}
												Verified
												<Icon
													icon="material-symbols:verified-rounded"
													class="w-4 h-4 mt-2 ml-1"
												/>
											{:else}
												<Icon
													icon="fluent:mail-all-read-16-filled"
													class="w-4  h-4 mr-1"
												/>
												Check your inbox
											{/if}
										</span>
									{:else}
										<span
											class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
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
							{#if emailSent && isOtpVerified === false}
								<br />

								<form
									action="?/verifyOtpEmail"
									method="POST"
									use:enhance={() => {
										return async ({ result }) => {
											loadingotp = false; // Hide loading spinner when the request is complete
											if (result.status === 200) {
												if (
													result.data.status === 200
												) {
													const verifiedMessage =
														result.data.message;
													toast.success(
														verifiedMessage,
													);
													isOtpVerified =
														result.data
															.isEmailVerified;
													enteredOtpemail = "";
													ProfileEmailVerified = true;
													console.log(
														isOtpVerified,
														"isOtpVerified",
													);
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
										loadingotp = true; // Show loading message when form is submitted
									}}
								>
									<div class="relative w-full">
										<input
											type="hidden"
											name="email"
											id="email"
											bind:value={email}
										/>
										<input
											type="text"
											name="enteredOtp"
											bind:value={enteredOtpemail}
											placeholder="Enter 6-digit OTP"
											class="flex w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400"
											on:input={() => {
												enteredOtpemail =
													enteredOtpemail.trim();
											}}
										/>
										<button
											type="submit"
											class="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary-600 font-bold text-2s py-1 rounded hover:underline"
											disabled={loadingotp}
										>
											<!-- {loadingotp ? 'Verifying...' : 'Verify'} -->
											{#if loadingotp}
												<span
													class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary-600 flex items-center"
												>
													<Icon
														icon="line-md:loading-alt-loop"
														class="w-4 h-4 mr-1 animate-spin"
													/>
													Verifying...
												</span>
											{:else}
												Verify
											{/if}
										</button>
									</div>
									<div class="flex justify-end text-sm">
										<button
											type="button"
											on:click={handleResendOtpemail}
											disabled={loadingotp}
											class="text-sm text-primary-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Get a new code
										</button>
									</div>
								</form>
							{/if}
							<!-- {#if showErrors && email.length === 0}
                                    <span class="text-red-400 text-xs">Email is required</span>
                                {/if}
                                {#if email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)}
                                    <span class="text-red-400 text-xs">Please enter a valid email address.</span>
                                {/if} -->
						</div>
					</div>
					<div class="flex-1 mb-4 sm:w-full">
						<textarea
							name="details"
							id="details"
							bind:value={details}
							class="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:border-primary-400 focus:shadow-none focus:ring-0 placeholder-gray-400 mb-4 h-32"
							placeholder="Additional Details*"
						></textarea>
						{#if showErrors && details.length === 0}
							<span class="text-red-400 text-xs"
								>Additional Details are required</span
							>
						{/if}
					</div>
					<div>
						<label class="flex items-center space-x-2">
							<input
								type="checkbox"
								name="query"
								bind:value={reason}
								bind:checked={isChecked}
								class="w-4 h-4 mb-5 ml-1 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0"
							/>

							<span class="mb-5 text-xs"
								>I confirm that I have selected the correct
								queries</span
							>
						</label>
						{#if showErrors && reason.length === 0}
							<span class="text-red-400 text-xs"
								>Please select one of the above reasons</span
							>
						{/if}
						{#if showErrors && !isChecked}
							<span class="text-red-400 text-xs"
								>confirm the above statement</span
							>
						{/if}
						<input type="hidden" name="status" value="unread" />
					</div>
					<div class="flex-1 mb-4 sm:mt-0">
						<button
  type="submit"
  on:click={handleSubmit}
  class="px-5 py-2 bg-primary-400 text-white rounded transition duration-300 hover:bg-primary-500 sm:w-auto"
>
  {#if submitting}
    Sending...
  {:else}
    Send Message
  {/if}
</button>

					</div>
				</div>
			</form>
			<Toaster position="bottom-right" richColors />
		</section>
	</section>
{/if}
