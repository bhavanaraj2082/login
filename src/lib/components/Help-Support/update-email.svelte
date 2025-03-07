<script>
	import {onMount} from 'svelte'
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  import { toast } from "svelte-sonner";
  let formLoading=false;
 
  export let data;
  let form;
  let searchTerm="";
  let errors={};

  let assistance = "";
  let country= data?.profile?.country||"";
let firstName = data?.profile?.firstName||"";
let lastName = data?.profile?.lastName||"";
let email =  data?.profile?.email||"";
let phoneNumber = data?.profile?.cellPhone|| "";
let companyName =  data?.profile?.companyName|| "";
  let location = "";
  let accountNumber = "";
  let currentEmail = "";
  let newEmail = "";
  let message = "";
  let errormessage = "";
  const validateField = (fieldName) => {
	if (!fieldName || fieldName === 'firstName') {
	  if (!firstName || !/^[A-Za-z\s]+$/.test(firstName)) {
		errors.firstName = 'First name is required and should contain only letters';
	  } else {
		delete errors.firstName;
	  }
	}
  
	if (!fieldName || fieldName === 'lastName') {
	  if (!lastName || !/^[A-Za-z\s]+$/.test(lastName)) {
		errors.lastName = 'Last name is required and should contain only letters';
	  } else {
		delete errors.lastName;
	  }
	}
  
	if (!fieldName || fieldName === 'email') {
	  if (!email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
		errors.email = 'Please enter a valid email address';
	  } else {
		delete errors.email;
	  }
	}
  if (!fieldName || fieldName === 'currentEmail') {
	  if (!currentEmail || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(currentEmail)) {
		errors.currentEmail = 'Please enter a valid current email address';
	  } else {
		delete errors.currentEmail;
	  }
	}
  if (!fieldName || fieldName === 'newEmail') {
	  if (!newEmail || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(newEmail)) {
		errors.newEmail = 'Please enter a valid new email address';
	  } else {
		delete errors.newEmail;
	  }
	}
  
	if (!fieldName || fieldName === 'phoneNumber') {
	  if (!country) {
		errors.phoneNumber = 'Please select the country before entering the phone number';
		return;
	  }
  
	  if (!phoneNumber || phoneNumber.trim() === '') {
		errors.phoneNumber = 'Required for the selected country';
	  } else {
		const countryDetails = getCountryByCode(country);
		if (!countryDetails) {
		  errors.phoneNumber = 'Invalid country selected';
		  errors.country = 'Invalid country selected';
		} else {
		  const phonePattern = getPhonePattern(country);
		  if (!phonePattern) {
			errors.phoneNumber = 'Phone number pattern for country not found';
		  } else {
			const phoneRegex = new RegExp(phonePattern);
			if (!phoneRegex.test(phoneNumber)) {
			  errors.phoneNumber = `Please enter a valid phone number for ${countryDetails.name}.`;
			} else {
			  delete errors.phoneNumber;
			}
		  }
		}
	  }
	}
	
  

  
	if (!fieldName || fieldName === 'country') {
	  if (!country) {
		errors.country = 'Location is required';
	  } else {
		delete errors.country;
	  }
	}
  
	if (!fieldName || fieldName === 'accountNumber') {
	  if (!accountNumber || !/^[a-zA-Z0-9]+$/.test(accountNumber)) {
		errors.accountNumber = 'Please enter a valid account number.';
	  } else {
		delete errors.accountNumber;
	  }
	}
	if (!fieldName || fieldName === 'companyName') {
	  if (!companyName || !/^[a-zA-Z0-9@*()#$]+$/.test(companyName)) {
		errors.companyName = 'Please enter a valid Company name ';
	  } else {
		delete errors.companyName;
	  }
	}



  
  if (!fieldName || fieldName === 'assistance') {
  if (!assistance || 
      !/^[A-Za-z0-9\s&-.,!@():;""'']+$/.test(assistance) || 
      /<script.*?>.*?<\/script>/i.test(assistanceMessage) || 
      /<[^>]*>/i.test(assistance)
  ) {
    errors.assistance = 'Comments is required and must not contain HTML tags or scripts.';
  } else {
    delete errors.assistance;
  }
}
  

  
  

  
	if (!fieldName || fieldName === 'poNumber') {
	  if (!poNumber && !/^[A-Za-z0-9-]+$/.test(poNumber)) {
		errors.poNumber = 'PO Number number should contain only alphanumeric characters and dashes';
	  } else {
		delete errors.poNumber;
	  }
	}
  };
  
  function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			showDropdown = false;
			
		}
	}
	onMount(() => {
    document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
  });
  
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
	function selectCountry(selectedCountry) {
		  country = selectedCountry.name;
		  // filteredCountries = countries;
		  searchTerm = `${selectedCountry.name} `;
		  showDropdown = false;
		  validateField('country');
		  validatePhoneNumber(country, phoneNumber);
  
		  delete errors.country;
		  // console.log('Selected Country:', country);
	  }
	function toggleDropdown() {
		  showDropdown = !showDropdown;
	  }
	function filterCountries() {
		  filteredCountries = countries.filter(
			  (country) =>
				  country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				  country.code.replace('+', '').includes(searchTerm.replace('+', '').toLowerCase())
		  );
		  if (
			  filteredCountries.length === 1 &&
			  (filteredCountries[0].name.toLowerCase() === searchTerm.toLowerCase() ||
				  filteredCountries[0].code.replace('+', '').toLowerCase() ===
					  searchTerm.replace('+', '').toLowerCase())
		  ) {
			  selectCountry(filteredCountries[0]);
		  } else {
			  showDropdown = filteredCountries.length > 0; // Show dropdown only if results exist
		  }
	  }
	
	  function handleInputChange(event) {
		  searchTerm = event.target.value;
		  filterCountries();
	  }
  
	let filteredCountries = countries;
	  let showDropdown = false;
	function getCountryByCode(name) {
		  const country = countries.find((c) => c.name === name);
  
		  return country ? country.name : null;
	  }
  
	  function getPhonePattern(countryCode) {
		  const countryName = getCountryByCode(countryCode);
		  if (!countryName) return '^[0-9]+$';
		  const regex = phoneNumberPatterns[countryName];
		  return regex || '^[0-9]+$';
	  }
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
	function validatePhoneNumber(countryCode, phoneNumber) {
		  if (!phoneNumber || !countryCode || phoneNumber.trim() === '') {
			  // errors.contactNumber = `*Required`;
			  return false;
		  }
  
		  const country = getCountryByCode(countryCode);
  
		  // console.log('Validating phone number for country:', country);
  
		  if (!country) {
			  errors.phoneNumber = 'Invalid country selected';
			  errors.phoneNumber = 'Invalid country selected';
			  return false;
		  }
  
		  const phonePattern = getPhonePattern(countryCode);
		  if (!phonePattern) {
			  errors.phoneNumber = 'Phone number pattern for country not found';
			  return false;
		  }
  
		  const phoneRegex = new RegExp(phonePattern);
  
		  if (!phoneRegex.test(phoneNumber)) {
			  errors.phoneNumber = `Please enter a valid phone number for ${country}.`;
			  return false;
		  } else {
			  errors.phoneNumber = '';
			  return true;
		  }
	  }
  

  
  function formValid() {
	if (formLoading) {
	  return false;
	}
  
	errors = {};
  
	validateField('firstName');
	validateField('lastName');
	validateField('email');
	validateField('phoneNumber');
	validateField('companyName');
	validateField('country');
	validateField('accountNumber');

	validateField('assistance');
  validateField('currentEmail');
  validateField('newEmail')
  
  
  
  
	const isValid =
	  Object.keys(errors).length === 0 
  
	return isValid;
  }

const handlesubmit = async (data) => {
	if (!formValid()) {
            cancel();
            return;
        }
    try {
   
        const result = await submitForm(data);
        console.log(result, "result");

        return async ({ result, update }) => {
            if (result.type === 'success') {
                const status = result.data.status; 

                if (status === 1) {
                    form = result.data;
                    await update();
                
                    // thankYouMessageVisible = true;
                    showSuccesDiv = true;
                } else if (status === 2) {

                    form = result.data;
                    await update();
                    
                    showFailureDiv = true;
                } else {
                  
                    form = result.data;
                    await update();
					showSuccesDiv=true;
                }
            }
        };

    } catch (error) {
        console.error("Error submitting form:", error);
        // Handle failure actions
        // loading = false;
        showFailureDiv = true;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
};
  

const submitForm = async (data) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ type: 'success', data: { success: true } });
			});
		});
	};
	let showSuccesDiv=false;
	let showFailureDiv=false;
</script>


{#if showSuccesDiv}
<div class="h-4/5 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl">
	<div
		class="w-10/12 md:w-8/12 bg-gradient-to-r from-green-100 via-green-50 to-green-100 p-8 rounded-lg shadow-lg text-center"
	>
	<h3 class="text-2xl font-semibold text-green-600 mb-4">
	  Customer Support Form Submission
	</h3>
	<p class="text-lg text-gray-700 mb-6">
	  Thank you for reaching out to our customer support team! We have received your request and will get back to you as soon as possible.
	</p>

		<div class="w-10/12 mx-auto my-6 border-t-2 border-green-300"></div>
		<div>
			<a
				href="/"
				class="bg-white text-primary-500 border border-primary-500 px-4 py-2 rounded-md hover:bg-primary-500 hover:text-white transition"
			>
				Return to Home
			</a>
		</div>
	</div>
</div>
{:else if showFailureDiv}
<div class="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
	<p class="font-semibold mb-4">
		There was a problem submitting the form. Please try again after some time.
	</p>
	<a
		href="/contact-us"
		class="bg-white w-fit border text-black border-gray-500 px-4 py-2 rounded-md transition block"
	>
		Report Issue
	</a>
</div>
{:else}



<div class="w-full p-4">
  <form
    method="POST"
    action="?/contact"
    bind:this={form}
    use:enhance={handlesubmit}
  >
    <div class=" w-full pb-6 h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-6">
        Update Email Address
      </h2>
      <input hidden name="issueName" value="Update Email Address" />
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="text-base"
        >*Current Email address (From online account)</label
      >
      <input
        type="email"
        name="currentEmail"
        bind:value={currentEmail}
        class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full mb-4 mt-2"
        required
        on:input={() => validateField('currentEmail')}
      />
      {#if errors.currentEmail}
      <p class="text-red-500 text-xs ">{errors.currentEmail}</p>
      {/if}
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="text-base">*New Email address</label>
      <input
        type="email"
        name="newEmail"
        bind:value={newEmail}
        on:input={() => validateField('newEmail')}
        class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full mt-2"
        required
      />
      {#if errors.newEmail}
      <p class="text-red-500 text-xs mt-1">{errors.newEmail}</p>
      {/if}
      <div class="mt-4">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block text-base"
          >*Please share any comments that would help us complete your request</label
        >
        <textarea
          rows="5"
          name="assistance"
          bind:value={assistance}
          class="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm mt-2"
          required
          on:input={() => validateField('assistance')}
        ></textarea>
        {#if errors.assistance}
        <p class="text-red-500 text-xs mt-1">{errors.assistance}</p>
        {/if}
      </div>
    </div>
    <div class=" w-full pb-6 mx-auto h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-6">
        Please provide your contact information
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name Input -->
        <div class="flex flex-col">
          <input
          name="firstName"
          type="text"
          placeholder="First Name"
          bind:value={firstName}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
          on:input={() => validateField('firstName')}
          />
          {#if errors.firstName}
          <p class="text-red-500 text-xs mt-1">{errors.firstName}</p>
          {/if}
        </div>
        
        <!-- Last Name Input -->
        <div class="flex flex-col">
          <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          bind:value={lastName}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
          on:input={() => validateField('lastName')}
          />
          {#if errors.lastName}
          <p class="text-red-500 text-xs mt-1">{errors.lastName}</p>
          {/if}
        </div>
        
        <!-- Email Input -->
        <div class="flex flex-col">
          <input
          name="email"
          type="email"
          placeholder="Email"
          bind:value={email}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
          on:input={() => validateField('email')}
          />
          {#if errors.email}
          <p class="text-red-500 text-xs mt-1">{errors.email}</p>
          {/if}
        </div>
        

     
  
  
            <div class="flex flex-col">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name "
                bind:value={companyName}
                class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
                required
                on:input={() => validateField('companyName')}
              />
              {#if errors.companyName}
                <p class="text-red-500 text-xs mt-1">{errors.companyName}</p>
              {/if}
              </div>
        
        <div class="flex flex-col">
          <div class="relative dropdown-container">
          <input
            type="text"
            name="country"
            bind:value={country}
            placeholder="Search Country"
            on:input={handleInputChange}
            on:click={toggleDropdown}
            autocomplete="off"
            class="flex-1 outline-none w-full border border-gray-300 rounded focus:ring-0 focus:border-primary-400 p-2 text-sm"
            required
          />
          <Icon
            icon={showDropdown ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'}
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mr-1 text-2s font-bold cursor-pointer"
          />
          {#if showDropdown}
            <div class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <ul class="max-h-60 overflow-y-auto text-sm">
              {#each filteredCountries as country (country.name)}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <li
                on:click={() => selectCountry(country)}
                class="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {country.name} ({country.code})
              </li>
              {/each}
            </ul>
            </div>
          {/if}
          </div>
          {#if errors.country}
          <p class="text-red-500 text-xs mt-1">{errors.country}</p>
          {/if}
        </div>
        
             <!-- Phone Number Input -->
             <div class="flex flex-col">
              <input
              name="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              bind:value={phoneNumber}
              class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
              required
           
                              on:input={() => {
                        phoneNumber = phoneNumber.replace(/[^+\d]/g, '').trim();
                        validateField('phoneNumber')
                        validatePhoneNumber(country, phoneNumber);
    
                      }}
              />
              {#if errors.phoneNumber}
              <p class="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              {/if}
            </div>
        <div class="flex flex-col">
          <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          bind:value={accountNumber}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
          on:input={() => validateField('accountNumber')}
          />
          {#if errors.accountNumber}
          <p class="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
          {/if}
        </div>
        </div>
      
        <div class="flex justify-center col-span-2 mt-2">
        <button
          class="w-full bg-primary-400 text-white p-2 rounded hover:bg-primary-500 mt-4"
         on:click={(event) => {
           // event.preventDefault();
     
           // Check form validity
           if (!formValid()) {
             toast.error('Please fill all the required fields.');
			 event.preventDefault();
             return;
           }
     
  
     
  
  
           handlesubmit();
         }}
         on:keydown={(event) => {
           if (event.key === 'Enter') {
             event.preventDefault();
           }
         }}
       >
         Submit
       </button>
        </div>
    </div>
  </form>
  {#if message != ""}
    <h2
      class="text-center text-green-500 font-semibold text-base w-full"
    >
      {message}
    </h2>
  {:else if errormessage != ""}
    <h2
      class="text-center text-red-500 font-semibold text-base w-full"
    >
      {errormessage}
    </h2>
  {/if}
</div>
{/if}
