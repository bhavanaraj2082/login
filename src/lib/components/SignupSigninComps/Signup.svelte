<script>
  import { enhance, applyAction } from "$app/forms";
  import { toast } from "svelte-sonner";
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  let username = "";
  let email = "";
  let country = "";
  let companyName = "";
  let jobTitle = "";
  let companyType = "";
  let currency = "";
  let isAccountSelected = false;
  let password = "";
  let passwordConfirm = "";
  let searchTerm = "";
  let phone = "";
  let form5;
  let errors = {};
  let termsAccepted = false;
  let isLoading = false;
  let emailSent = false;
  let verificationMessage = "";
  let ProfileEmailVerified = false;
  let isOtpVerified = false;
  let displayMessage = "";
  let enteredOtp = "";
  let errorCount = "";
  let tanNumber = "";
  let gstNumber = "";
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const callbackUrl = import.meta.env.VITE_LINKEDIN_CALLBACK_URL;
  const scope = import.meta.env.VITE_LINKEDIN_SCOPE;
  const baseUrl = import.meta.env.VITE_LINKEDIN_BASE_URL;
  const linkedinUrl = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=${scope}`;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%_\-*])[A-Za-z\d!@#$%_\-*]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^[A-Za-z]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  function validateUsername() {
    if (!username) {
      errors.username = "*Required";
    } else if (username.length < 3) {
      errors.username = "Please enter at least 3 characters";
    } else if (/^[^a-zA-Z]/.test(username)) {
      errors.username = "Username must start with a letter";
    } else if (/[^a-zA-Z0-9_]/.test(username)) {
      errors.username =
        "Username can include only letters, numbers, and underscore ( _ )";
    } else if (/^[0-9]+$/.test(username)) {
      errors.username = "Username cannot contain only numbers";
    } else if (/^[_]+$/.test(username)) {
      errors.username = "Username cannot contain only underscores ( _ )";
    } else if (!/^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9_]+$/.test(username.trim())) {
      errors.username = "Username must contain at least 3 letters";
    } else {
      delete errors.username;
    }
  }

  function validateEmail() {
    if (!email) {
      errors.email = "*Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email.";
    } else {
      delete errors.email;
    }
  }

  function validatePhone() {
    if (!phone) {
      errors.phone = "*Required";
    } else {
      const phonePattern = getPhonePattern(country);
      const phoneRegex = new RegExp(phonePattern);

      if (!phoneRegex.test(phone)) {
        errors.phone = `Please enter a valid phone number for ${country}.`;
      } else {
        delete errors.phone;
      }
    }
  }

  function validatePassword() {
    if (!password) {
      errors.password = "*Required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(
        password
      )
    ) {
      errors.password =
        "Ensure your password matches the format outlined below.";
    } else {
      delete errors.password;
    }
  }

  function validateConfirmPassword() {
    if (!passwordConfirm) {
      errors.passwordConfirm = "*Required";
    } else if (passwordConfirm !== password) {
      errors.passwordConfirm = "Passwords do not match";
    } else {
      delete errors.passwordConfirm;
    }
  }

  const handleResendemailOtp = () => {
    form5.requestSubmit();
  };
  let typing = false;
  function handleInput() {
    typing = true;
    enteredOtp = enteredOtp.trim();
  }

  const countryCurrencyMap = {
    Afghanistan: "AFN",
    Albania: "ALL",
    Algeria: "DZD",
    Andorra: "EUR",
    Angola: "AOA",
    "Antigua and Barbuda": "XCD",
    Argentina: "ARS",
    Armenia: "AMD",
    Australia: "AUD",
    Austria: "EUR",
    Azerbaijan: "AZN",
    Bahamas: "BSD",
    Bahrain: "BHD",
    Bangladesh: "BDT",
    Barbados: "BBD",
    Belarus: "BYN",
    Belgium: "EUR",
    Belize: "BZD",
    Benin: "XOF",
    Bhutan: "BTN",
    Bolivia: "BOB",
    "Bosnia and Herzegovina": "BAM",
    Botswana: "BWP",
    Brazil: "BRL",
    Brunei: "BND",
    Bulgaria: "BGN",
    "Burkina Faso": "XOF",
    Burundi: "BIF",
    "Cabo Verde": "CVE",
    Cambodia: "KHR",
    Cameroon: "XAF",
    Canada: "CAD",
    "Central African Republic": "XAF",
    Chad: "XAF",
    Chile: "CLP",
    China: "CNY",
    Colombia: "COP",
    Comoros: "KMF",
    "Congo, Democratic Republic of the": "CDF",
    "Congo, Republic of the": "XAF",
    "Costa Rica": "CRC",
    Croatia: "HRK",
    Cuba: "CUP",
    Cyprus: "EUR",
    "Czech Republic": "CZK",
    Denmark: "DKK",
    Djibouti: "DJF",
    Dominica: "XCD",
    "Dominican Republic": "DOP",
    Ecuador: "USD",
    Egypt: "EGP",
    "El Salvador": "USD",
    "Equatorial Guinea": "XAF",
    Eritrea: "ERN",
    Estonia: "EUR",
    Eswatini: "SZL",
    Ethiopia: "ETB",
    Fiji: "FJD",
    Finland: "EUR",
    France: "EUR",
    Gabon: "XAF",
    Gambia: "GMD",
    Georgia: "GEL",
    Germany: "EUR",
    Ghana: "GHS",
    Greece: "EUR",
    Grenada: "XCD",
    Guatemala: "GTQ",
    Guinea: "GNF",
    "Guinea-Bissau": "XOF",
    Guyana: "GYD",
    Haiti: "HTG",
    Honduras: "HNL",
    Hungary: "HUF",
    Iceland: "ISK",
    India: "INR",
    Indonesia: "IDR",
    Iran: "IRR",
    Iraq: "IQD",
    Ireland: "EUR",
    Israel: "ILS",
    Italy: "EUR",
    Jamaica: "JMD",
    Japan: "JPY",
    Jordan: "JOD",
    Kazakhstan: "KZT",
    Kenya: "KES",
    Kiribati: "AUD",
    Kuwait: "KWD",
    Kyrgyzstan: "KGS",
    Laos: "LAK",
    Latvia: "EUR",
    Lebanon: "LBP",
    Lesotho: "LSL",
    Liberia: "LRD",
    Libya: "LYD",
    Liechtenstein: "CHF",
    Lithuania: "EUR",
    Luxembourg: "EUR",
    Madagascar: "MGA",
    Malawi: "MWK",
    Malaysia: "MYR",
    Maldives: "MVR",
    Mali: "XOF",
    Malta: "EUR",
    "Marshall Islands": "USD",
    Mauritania: "MRU",
    Mauritius: "MUR",
    Mexico: "MXN",
    Micronesia: "USD",
    Moldova: "MDL",
    Monaco: "EUR",
    Mongolia: "MNT",
    Montenegro: "EUR",
    Morocco: "MAD",
    Mozambique: "MZN",
    Myanmar: "MMK",
    Namibia: "NAD",
    Nauru: "AUD",
    Nepal: "NPR",
    Netherlands: "EUR",
    "New Zealand": "NZD",
    Nicaragua: "NIO",
    Niger: "XOF",
    Nigeria: "NGN",
    "North Macedonia": "MKD",
    Norway: "NOK",
    Oman: "OMR",
    Pakistan: "PKR",
    Palau: "USD",
    Palestine: "ILS",
    Panama: "PAB",
    "Papua New Guinea": "PGK",
    Paraguay: "PYG",
    Peru: "PEN",
    Philippines: "PHP",
    Poland: "PLN",
    Portugal: "EUR",
    Qatar: "QAR",
    Romania: "RON",
    Russia: "RUB",
    Rwanda: "RWF",
    "Saint Kitts and Nevis": "XCD",
    "Saint Lucia": "XCD",
    "Saint Vincent and the Grenadines": "XCD",
    Samoa: "WST",
    "San Marino": "EUR",
    "Sao Tome and Principe": "STN",
    "Saudi Arabia": "SAR",
    Senegal: "XOF",
    Serbia: "RSD",
    Seychelles: "SCR",
    "Sierra Leone": "SLL",
    Singapore: "SGD",
    Slovakia: "EUR",
    Slovenia: "EUR",
    "Solomon Islands": "SBD",
    Somalia: "SOS",
    "South Africa": "ZAR",
    "South Korea": "KRW",
    Spain: "EUR",
    "Sri Lanka": "LKR",
    Sudan: "SDG",
    Suriname: "SRD",
    Sweden: "SEK",
    Switzerland: "CHF",
    Syria: "SYP",
    Taiwan: "TWD",
    Tajikistan: "TJS",
    Tanzania: "TZS",
    Thailand: "THB",
    Togo: "XOF",
    Tonga: "TOP",
    "Trinidad and Tobago": "TTD",
    Tunisia: "TND",
    Turkey: "TRY",
    Turkmenistan: "TMT",
    Tuvalu: "AUD",
    Uganda: "UGX",
    Ukraine: "UAH",
    "United Arab Emirates": "AED",
    "United Kingdom": "GBP",
    "United States": "USD",
    Uruguay: "UYU",
    Uzbekistan: "UZS",
    Vanuatu: "VUV",
    "Vatican City": "EUR",
    Venezuela: "VES",
    Vietnam: "VND",
    Yemen: "YER",
    Zambia: "ZMW",
    Zimbabwe: "ZWL",
  };

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

  let currencies = [
    "AFN",
    "ALL",
    "DZD",
    "EUR",
    "AOA",
    "XCD",
    "ARS",
    "AMD",
    "AUD",
    "EUR",
    "AZN",
    "BSD",
    "BHD",
    "BDT",
    "BBD",
    "BYN",
    "EUR",
    "BZD",
    "XOF",
    "BTN",
    "BOB",
    "BAM",
    "BWP",
    "BRL",
    "BND",
    "BGN",
    "XOF",
    "BIF",
    "CVE",
    "KHR",
    "XAF",
    "CAD",
    "XAF",
    "XAF",
    "CLP",
    "CNY",
    "COP",
    "KMF",
    "CDF",
    "XAF",
    "CRC",
    "HRK",
    "CUP",
    "EUR",
    "CZK",
    "DKK",
    "DJF",
    "XCD",
    "DOP",
    "USD",
    "EGP",
    "USD",
    "XAF",
    "ERN",
    "EUR",
    "SZL",
    "ETB",
    "FJD",
    "EUR",
    "EUR",
    "XAF",
    "GMD",
    "GEL",
    "EUR",
    "GHS",
    "EUR",
    "XCD",
    "GTQ",
    "GNF",
    "XOF",
    "GYD",
    "HTG",
    "HNL",
    "HUF",
    "ISK",
    "INR",
    "IDR",
    "IRR",
    "IQD",
    "EUR",
    "ILS",
    "EUR",
    "JMD",
    "JPY",
    "JOD",
    "KZT",
    "KES",
    "AUD",
    "KWD",
    "KGS",
    "LAK",
    "EUR",
    "LBP",
    "LSL",
    "LRD",
    "LYD",
    "CHF",
    "EUR",
    "EUR",
    "MGA",
    "MWK",
    "MYR",
    "MVR",
    "XOF",
    "EUR",
    "USD",
    "MRU",
    "MUR",
    "MXN",
    "USD",
    "MDL",
    "EUR",
    "MNT",
    "EUR",
    "MAD",
    "MZN",
    "MMK",
    "NAD",
    "AUD",
    "NPR",
    "EUR",
    "NZD",
    "NIO",
    "XOF",
    "NGN",
    "MKD",
    "NOK",
    "OMR",
    "PKR",
    "USD",
    "ILS",
    "PAB",
    "PGK",
    "PYG",
    "PEN",
    "PHP",
    "PLN",
    "EUR",
    "QAR",
    "RON",
    "RUB",
    "RWF",
    "XCD",
    "XCD",
    "XCD",
    "WST",
    "EUR",
    "STN",
    "SAR",
    "XOF",
    "RSD",
    "SCR",
    "SLL",
    "SGD",
    "EUR",
    "EUR",
    "SBD",
    "SOS",
    "ZAR",
    "KRW",
    "EUR",
    "LKR",
    "SDG",
    "SRD",
    "SEK",
    "CHF",
    "SYP",
    "TWD",
    "TJS",
    "TZS",
    "THB",
    "XOF",
    "TOP",
    "TTD",
    "TND",
    "TRY",
    "TMT",
    "AUD",
    "UGX",
    "UAH",
    "AED",
    "GBP",
    "USD",
    "UYU",
    "UZS",
    "VUV",
    "EUR",
    "VES",
    "VND",
    "YER",
    "ZMW",
    "ZWL",
  ];

  function updateCurrency(country) {
    const normalizedCountry = country.trim().toLowerCase();
    const selectedCurrency = Object.keys(countryCurrencyMap).find(
      (key) => key.toLowerCase() === normalizedCountry
    );

    if (selectedCurrency) {
      currency = countryCurrencyMap[selectedCurrency];
    } else {
      currency = "";
    }
  }

  currencies = currencies.sort();

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

  function getCountryByCode(code) {
    const country = countries.find((c) => c.code === code || c.name === code);
    return country ? country.name : null;
  }

  function getPhonePattern(countryCode) {
    const countryName = getCountryByCode(countryCode);
    if (!countryName) return "^[0-9]+$";
    const regex = phoneNumberPatterns[countryName];
    if (!regex) return "^[0-9]+$";
    return regex.source;
  }

  function validatePhoneNumber(countryName, phone) {
    if (!phone) {
      errors.phone = "*Required";
      return;
    } else {
      errors.phone = "";
    }

    if (!countryName) {
      errors.phone = "Select a country before entering your phone number";
      return;
    } else {
      errors.phone = "";
    }

    const countryCode = countries.find((c) => c.name === countryName)?.code;
    const phonePattern = getPhonePattern(countryCode);
    const phoneRegex = new RegExp(phonePattern);

    if (!phoneRegex.test(phone)) {
      errors.phone = `Please enter a valid phone number for ${countryName}.`;
    } else {
      errors.phone = "";
    }
  }

  const countriesLength = countries.length;
  const phoneNumberPatternsLength = Object.keys(phoneNumberPatterns).length;
  const cur = currencies.length;
  const mapLength = Object.keys(countryCurrencyMap).length;
  const countryNames = countries.map((country) => country.name);
  const missingPatterns = countryNames.filter(
    (name) => !phoneNumberPatterns.hasOwnProperty(name)
  );
  function validateCountry() {
    if (!country) {
      errors.country = "*Required";
    } else {
      delete errors.country;
    }
  }
  let filteredCountries = countries;
  let showDropdown = false;
  function selectCountry(selectedCountry) {
    country = selectedCountry.name;
    searchTerm = `${selectedCountry.name} `;
    showDropdown = false;
    validateCountry();
    validatePhoneNumber(country, phone);
    updateCurrency(country);
    delete errors.country;
    localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry));
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function handleSearchChange() {
    filteredCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    showDropdown = filteredCountries.length > 0 && searchTerm !== "";
  }

  function handleInputChange(event) {
    searchTerm = event.target.value;
    filterCountries();
  }

  function filterCountries() {
    filteredCountries = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code
          .replace("+", "")
          .includes(searchTerm.replace("+", "").toLowerCase())
    );
    if (
      filteredCountries.length === 1 &&
      (filteredCountries[0].name.toLowerCase() === searchTerm.toLowerCase() ||
        filteredCountries[0].code.replace("+", "").toLowerCase() ===
          searchTerm.replace("+", "").toLowerCase())
    ) {
      selectCountry(filteredCountries[0]);
    } else {
      showDropdown = filteredCountries.length > 0 || searchTerm.length > 0;
    }
  }

  function validateGstNumber() {
    // if (!gstNumber) {
    //   errors.gstNumber = '*Required';
    // } else if (!/^[0-9]{2}[A-Z0-9]+$/.test(gstNumber)) {
    //   errors.gstNumber = 'Please provide a valid GST Number.';
    // } else {
    //   delete errors.gstNumber;
    // }

    if (gstNumber) {
      if (!/^[0-9]{2}[A-Z0-9]+$/.test(gstNumber)) {
        errors.gstNumber = "Please provide a valid GST Number.";
      } else {
        delete errors.gstNumber;
      }
    } else {
      delete errors.gstNumber;
    }
  }

  function validateTanNumber() {
    if (tanNumber) {
      if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tanNumber)) {
        errors.tanNumber = "Please provide a valid TAN Number.";
      } else {
        delete errors.tanNumber;
      }
    } else {
      delete errors.tanNumber;
    }
  }

  // function validateForm() {
  //   errors = {};
  //   if (!username) {
  //     errors.username = "*Required";
  //   } else if (username.length < 3) {
  //     errors.username = "Please enter at least 3 characters";
  //   } else if (/^[^a-zA-Z]/.test(username)) {
  //     errors.username = "Username must start with a letter";
  //   } else if (/[^a-zA-Z0-9_]/.test(username)) {
  //     errors.username =
  //       "Username can include only letters, numbers, and underscore ( _ )";
  //   } else if (/^[0-9]+$/.test(username)) {
  //     errors.username = "Username cannot contain only numbers";
  //   } else if (/^[_]+$/.test(username)) {
  //     errors.username = "Username cannot contain only underscores ( _ )";
  //   } else if (!/^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9_]+$/.test(username.trim())) {
  //     errors.username = "Username must contain at least 3 letters";
  //   } else {
  //     delete errors.username;
  //   }

  //   if (!email) {
  //     errors.email = "*Required";
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  //     errors.email = "Please enter a valid email.";
  //   } else {
  //     delete errors.email;
  //   }

  //   if (!phone) {
  //     errors.phone = "*Required";
  //   } else {
  //     const phonePattern = getPhonePattern(country);
  //     const phoneRegex = new RegExp(phonePattern);

  //     if (!phoneRegex.test(phone)) {
  //       errors.phone = `Please enter a valid phone number for ${country}.`;
  //     } else {
  //       delete errors.phone;
  //     }
  //   }

  //   if (!country) {
  //     errors.phone =
  //       "Please select the country before entering the phone number";
  //   } else {
  //     delete errors.phone;
  //   }

  //   if (!country) {
  //     errors.country = "*Required";
  //   } else {
  //     delete errors.country;
  //   }

  //   if (!password) {
  //     errors.password = "*Required";
  //   } else if (
  //     !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(
  //       password
  //     )
  //   ) {
  //     errors.password =
  //       "Ensure your password matches the format outlined below.";
  //   } else {
  //     delete errors.password;
  //   }

  //   if (!passwordConfirm) {
  //     errors.passwordConfirm = "*Required";
  //   } else if (passwordConfirm !== password) {
  //     errors.passwordConfirm = "Passwords do not match";
  //   } else {
  //     delete errors.passwordConfirm;
  //   }

  //   if (!termsAccepted) {
  //     errors.termsAndConditions =
  //       "You need to agree to the Terms of Service and Privacy Policy to proceed";
  //   }

  //   if (gstNumber) {
  //     if (!/^[0-9]{2}[A-Z0-9]+$/.test(gstNumber)) {
  //       errors.gstNumber = "Please provide a valid GST Number.";
  //     } else {
  //       delete errors.gstNumber;
  //     }
  //   } else {
  //     delete errors.gstNumber;
  //   }

  //   if (tanNumber) {
  //     if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tanNumber)) {
  //       errors.tanNumber = "Please provide a valid TAN Number";
  //     } else {
  //       delete errors.tanNumber;
  //     }
  //   } else {
  //     delete errors.tanNumber;
  //   }

  //   if (!(isOtpVerified === true)) {
  //     // toast.error('Please verify your email or phone number to proceed');
  //     toast.error("Please verify your email to proceed");
  //   }

  //   console.log(isOtpVerified, "isOtpVerified");
  //   console.log("Error object:", errors);
  //   errorCount = Object.keys(errors).length;
  //   console.log("Number of errors:", errorCount);

  //   return (
  //     Object.keys(errors).length === 0 && isOtpVerified === true
  //     // (isOtpVerified === true || isEmailVerified || isOtpPhoneVerified || ProfilePhoneVerified)
  //   );
  // }

  function validateForm() {
    errors = {};

    // Validate business fields if account type is "For a Business"
    if (account === "For a Business") {
      if (!companyName) {
        errors.companyName = "*Required";
      } else if (!/^[a-zA-Z\s]+$/.test(companyName)) {
        errors.companyName = "Company name can only contain letters and spaces";
      } else {
        delete errors.companyName;
      }

      if (!companyType) {
        errors.companyType = "*Required";
      } else if (!/^[a-zA-Z\s]+$/.test(companyType)) {
        errors.companyType = "Company type can only contain letters and spaces";
      } else {
        delete errors.companyType;
      }

      if (!jobTitle) {
        errors.jobTitle = "*Required";
      } else if (!/^[a-zA-Z\s]+$/.test(jobTitle)) {
        errors.jobTitle = "Job title can only contain letters and spaces";
      } else {
        delete errors.jobTitle;
      }

      // Make only GST required for business accounts
      if (!gstNumber) {
        errors.gstNumber = "*Required";
      } else if (!/^[0-9]{2}[A-Z0-9]+$/.test(gstNumber)) {
        errors.gstNumber = "Please provide a valid GST Number.";
      } else {
        delete errors.gstNumber;
      }

      // TAN is optional even for business accounts
      if (tanNumber) {
        if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tanNumber)) {
          errors.tanNumber = "Please provide a valid TAN Number";
        } else {
          delete errors.tanNumber;
        }
      } else {
        delete errors.tanNumber;
      }
    } else {
      // For non-business accounts, GST and TAN are optional but validate if provided
      if (gstNumber) {
        if (!/^[0-9]{2}[A-Z0-9]+$/.test(gstNumber)) {
          errors.gstNumber = "Please provide a valid GST Number.";
        } else {
          delete errors.gstNumber;
        }
      } else {
        delete errors.gstNumber;
      }

      if (tanNumber) {
        if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tanNumber)) {
          errors.tanNumber = "Please provide a valid TAN Number";
        } else {
          delete errors.tanNumber;
        }
      } else {
        delete errors.tanNumber;
      }
    }

    // Continue with existing validation logic
    if (!username) {
      errors.username = "*Required";
    } else if (username.length < 3) {
      errors.username = "Please enter at least 3 characters";
    } else if (/^[^a-zA-Z]/.test(username)) {
      errors.username = "Username must start with a letter";
    } else if (/[^a-zA-Z0-9_]/.test(username)) {
      errors.username =
        "Username can include only letters, numbers, and underscore ( _ )";
    } else if (/^[0-9]+$/.test(username)) {
      errors.username = "Username cannot contain only numbers";
    } else if (/^[_]+$/.test(username)) {
      errors.username = "Username cannot contain only underscores ( _ )";
    } else if (!/^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9_]+$/.test(username.trim())) {
      errors.username = "Username must contain at least 3 letters";
    } else {
      delete errors.username;
    }

    if (!email) {
      errors.email = "*Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email.";
    } else {
      delete errors.email;
    }

    if (!phone) {
      errors.phone = "*Required";
    } else {
      const phonePattern = getPhonePattern(country);
      const phoneRegex = new RegExp(phonePattern);

      if (!phoneRegex.test(phone)) {
        errors.phone = `Please enter a valid phone number for ${country}.`;
      } else {
        delete errors.phone;
      }
    }

    if (!country) {
      errors.phone =
        "Please select the country before entering the phone number";
    } else {
      delete errors.phone;
    }

    if (!country) {
      errors.country = "*Required";
    } else {
      delete errors.country;
    }

    if (!password) {
      errors.password = "*Required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(
        password
      )
    ) {
      errors.password =
        "Ensure your password matches the format outlined below.";
    } else {
      delete errors.password;
    }

    if (!passwordConfirm) {
      errors.passwordConfirm = "*Required";
    } else if (passwordConfirm !== password) {
      errors.passwordConfirm = "Passwords do not match";
    } else {
      delete errors.passwordConfirm;
    }

    if (!termsAccepted) {
      errors.termsAndConditions =
        "You need to agree to the Terms of Service and Privacy Policy to proceed";
    }

    if (!(isOtpVerified === true)) {
      toast.error("Please verify your email to proceed");
    }

    console.log(isOtpVerified, "isOtpVerified");
    console.log("Error object:", errors);
    errorCount = Object.keys(errors).length;
    console.log("Number of errors:", errorCount);

    return Object.keys(errors).length === 0 && isOtpVerified === true;
  }
  async function handleFormSubmission({ cancel }) {
    if (!validateForm()) {
      cancel();
    }
    // if (!validateForm()) {
    //   cancel();
    //   return;
    // }
    return async ({ result, update }) => {
      console.log("result", result);

      if (result.type === "redirect") {
        await applyAction(result);
      }

      if (result.type === "success") {
        if (result.data.success) {
          await update();
          toast.success(result.data.message);

          await goto("/dashboard");
          location.reload();
        } else {
          toast.error(result.data.message);
        }
      }
    };
  }

  let showBusinessDetails = false;
  let account;

  function toggleFields(event) {
    account = event.target.value;
    showBusinessDetails = event.target.value === "For a Business";
    showBusinessDetails = showBusinessDetails;
    isAccountSelected = true;
  }
</script>

<div
  class="flex flex-col w-11/12 md:flex-row justify-center items-start shadow-md my-12 rounded-lg max-w-5xl bg-white mx-auto border-gray-300 border"
>
  <div class="image-container w-full md:w-1/2 flex items-center justify-center">
    <img
      src="/image.jpg"
      alt="Signup"
      class="w-full transform scale-x-[-1] object-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
    />
  </div>

  <div
    class="content w-full md:w-2/3 p-4 md:p-6 flex flex-col justify-center rounded-tr-lg rounded-b-lg md:rounded-l-lg md:rounded-tl-none"
  >
    <h2 class="text-2xl font-bold text-primary-500">Sign Up</h2>
    <p class="text-gray-500 mb-5">
      Already have an account? <a
        href="/login"
        class="underline text-primary-500 hover:text-primary-600">Login.</a
      >
    </p>

    <form method="POST" action="?/register" use:enhance={handleFormSubmission}>
      <div class="flex items-center gap-3 mx text-md mt-2 mb-5">
        <label class="flex items-center md:gap-2 font-medium">
          For a Business
          <input
            type="radio"
            name="account"
            value="For a Business"
            class="peer hidden"
            on:change={toggleFields}
          />
          <span
            class="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:border-primary-600 peer-checked:bg-primary-600"
          >
            <span class="w-2 h-2 rounded-full bg-white peer-checked:bg-white"
            ></span>
          </span>
        </label>
        <label class="flex items-center gap-2 font-medium">
          For Myself
          <input
            type="radio"
            name="account"
            value="For Myself"
            checked
            class="peer hidden"
            on:change={toggleFields}
          />
          <span
            class="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:border-primary-600 peer-checked:bg-primary-600"
          >
            <span class="w-2 h-2 rounded-full bg-white peer-checked:bg-white"
            ></span>
          </span>
        </label>
      </div>
      {#if showBusinessDetails}
        <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div class="flex-1 mb-2 md:mb-0">
            <label
              for="companyname"
              class="block text-sm font-medium text-gray-600"
              >Company Name</label
            >
            <input
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
              type="text"
              name="companyname"
              bind:value={companyName}
              placeholder="Company Name"
              on:input={() => {
                errors.companyName = !companyName
                  ? "*Required"
                  : !/^[a-zA-Z\s]+$/.test(companyName)
                    ? "Company name can only contain letters and spaces"
                    : "";
              }}
            />
            <p class=" text-red-500 text-left text-xs">
              {errors?.companyName || ""}
            </p>
          </div>
          <div class="flex-1 mb-2 md:mb-0">
            <label
              for="companytype"
              class="block text-sm font-medium text-gray-600"
              >Company Type
            </label>
            <input
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
              type="text"
              name="companytype"
              bind:value={companyType}
              placeholder="Company Type"
              on:input={() => {
                errors.companyType = !companyType
                  ? "*Required"
                  : !/^[a-zA-Z\s]+$/.test(companyType)
                    ? "Company type can only contain letters and spaces"
                    : "";
              }}
            />
            <p class=" text-red-500 text-left text-xs">
              {errors?.companyType || ""}
            </p>
          </div>
        </div>
        <div class="flex-1 mb-4">
          <label
            for="jobTitle"
            class="block md:mt-5 text-sm font-medium text-gray-600"
            >Job Title
          </label>
          <input
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
            type="text"
            name="jobTitle"
            bind:value={jobTitle}
            placeholder="Job Title"
            on:input={() => {
              errors.jobTitle = !jobTitle
                ? "*Required"
                : !/^[a-zA-Z\s]+$/.test(jobTitle)
                  ? "Job title can only contain letters and spaces"
                  : "";
            }}
          />
          <p class=" text-red-500 text-left text-xs">
            {errors?.jobTitle || ""}
          </p>
        </div>
      {/if}
      <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
        <div class="flex-1 mb-2 md:mb-0">
          <label for="username" class="block text-sm font-medium text-gray-600"
            >Username</label
          >
          <input
            type="text"
            id="username"
            name="username"
            bind:value={username}
            on:input={() => validateUsername()}
            placeholder="Enter your username"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
          />
          {#if errors.username}
            <div class="text-red-500 text-xs mt-1">{errors.username}</div>
          {/if}
        </div>
        <div class="flex-1 mb-2 md:mb-0 relative">
          <label for="email" class="block text-sm font-medium text-gray-600"
            >Email</label
          >
          <div class="relative">
            <form
              action="?/verifyemail"
              bind:this={form5}
              method="POST"
              use:enhance={({}) => {
                return async ({ result }) => {
                  console.log("result", result);

                  isLoading = false;
                  console.log(result);
                  if (result.data?.status === 200) {
                    toast.success(result.data.message);
                    ProfileEmailVerified = result.data.isEmailVerified;
                    verificationMessage = result.data.message;

                    if (
                      verificationMessage.includes(
                        "Verification email sent successfully. Please check your inbox."
                      )
                    ) {
                      displayMessage = "Please check your inbox.";
                      emailSent = true;
                      isOtpVerified = false;
                    } else {
                      displayMessage = verificationMessage;
                      emailSent = false;
                      isOtpVerified = true;
                    }
                  } else {
                    ProfileEmailVerified = result.data.isEmailVerified;
                    toast.error(result.data.message);
                    emailSent = false;
                  }
                };
              }}
              on:submit={() => {
                isLoading = true;
              }}
            >
              <input
                type="email"
                id="email"
                name="email"
                bind:value={email}
                on:input={() => {
                  validateEmail();
                  ProfileEmailVerified = false;
                  emailSent = false;
                  isOtpVerified = false;
                }}
                placeholder="Enter your email"
                class="mt-1 block w-full p-2 pr-24 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm text-sm h-10"
              />

              {#if isLoading}
                <span
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-primary-600 flex items-center"
                >
                  <Icon icon="line-md:loading-alt-loop" class="w-4 h-4 mr-1" />
                  Sending...
                </span>
              {:else if !ProfileEmailVerified && !emailSent}
                <button
                  type="submit"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary-500 font-semibold text-2s pl-2 py-1 rounded hover:underline disabled:cursor-not-allowed"
                  disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                    email
                  ) || email.split("@")[1].includes("gamil")}
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
                      class="w-4 h-4 ml-1"
                    />
                  {:else}
                    <Icon
                      icon="fluent:mail-all-read-16-filled"
                      class="w-4 h-4 mr-1"
                    />
                    Check inbox
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
            </form>
          </div>
          <input type="hidden" name="email" bind:value={email} />
          {#if errors.email}
            <div class="text-red-500 text-xs mt-1">{errors.email}</div>
          {/if}
        </div>
      </div>

      <div class="mt-1 mb-4">
        {#if emailSent && isOtpVerified === false}
          <form
            action="?/verifyOtp"
            method="POST"
            use:enhance={() => {
              return async ({ result }) => {
                console.log(result);
                isOtpVerified = result.data.isEmailVerified;
                if (result.data?.status === 200) {
                  toast.success(result.data.message);
                  enteredOtp = "";
                  isOtpVerified = true;
                  ProfileEmailVerified = true;
                } else if (result.data?.status === 500) {
                  toast.error(result.data.message);
                }
                console.log(isOtpVerified, "isOtpVerified");
              };
            }}
          >
            <div class="relative w-full">
              <input type="hidden" name="email" bind:value={email} />
              <label
                for="enteredOtp"
                class="block text-sm font-medium text-gray-600"
                >Enter the Recieved 6-digit OTP</label
              >
              <input
                type="text"
                maxlength="6"
                name="enteredOtp"
                bind:value={enteredOtp}
                on:input={handleInput}
                placeholder="Enter 6-digit OTP"
                class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md
                    focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400
                    placeholder:text-sm h-10"
              />
              <button
                type="submit"
                class="absolute top-1/2 right-2 transform text-primary-500 font-bold text-2s py-1 rounded hover:underline"
              >
                Verify
              </button>
            </div>
          </form>
          <p class="mt-px text-2s text-right text-gray-600">
            Didn't receive the code?
            <button
              type="button"
              on:click={handleResendemailOtp}
              class="text-primary-500 font-medium hover:underline"
            >
              Get a new code
            </button>
          </p>
        {/if}
      </div>
      <input name="isEmailVerified" type="hidden" bind:value={isOtpVerified} />

      <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
        <div class="w-full sm:mx-auto grid">
          <label for="country" class="block text-sm font-medium text-gray-600"
            >Country</label
          >
          <div class="relative dropdown-container">
            <input
              type="text"
              name="country"
              bind:value={country}
              placeholder="Search Country"
              on:input={handleInputChange}
              on:click={toggleDropdown}
              class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md
                    focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400
                    placeholder:text-sm h-10"
            />
            <Icon
              icon={showDropdown ? "ep:arrow-up-bold" : "ep:arrow-down-bold"}
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mr-1 text-2s font-bold cursor-pointer"
            />
            {#if showDropdown}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <ul
                class="absolute z-10 w-full p-1.5 bg-white border border-gray-300 rounded-md text-sm max-h-60 overflow-auto"
                on:click|stopPropagation
              >
                {#each filteredCountries as { name, code }}
                  <li
                    on:click={() => selectCountry({ name, code })}
                    class="cursor-pointer px-2 py-1 text-gray-500 hover:bg-primary-50 text-xs font-medium text-left"
                  >
                    <option value={code}>{name} ({code})</option>
                  </li>
                {/each}
                {#if filteredCountries.length === 0}
                  <div class="flex items-center px-2 py-4">
                    <Icon
                      icon="tabler:info-square-rounded-filled"
                      class="text-red-500 text-base mr-1"
                    />
                    <li class="text-gray-500 text-xs font-medium">
                      No matching countries found!
                    </li>
                  </div>
                {/if}
              </ul>
            {/if}
            {#if errors.country}
              <div class="text-red-500 text-xs mt-1">{errors.country}</div>
            {/if}
          </div>
        </div>

        <div class="w-full sm:mx-auto grid">
          <label for="currency" class="block text-sm font-medium text-gray-600"
            >Currency</label
          >
          <select
            class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md
                    focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400
                    placeholder:text-sm h-10"
            name="currency"
            bind:value={currency}
            id="currency-select"
            disabled
          >
            <option class="Currency" disabled selected value="">Currency</option
            >
            {#each currencies as currency}
              <option class="bg-primary-50" value={currency}>{currency}</option>
            {/each}
          </select>
          <input type="hidden" name="currency" bind:value={currency} />
          {#if errors.country}
            <div class="text-red-500 text-xs mt-1">{errors.country}</div>
          {/if}
        </div>
      </div>

      <div class="mb-4">
        <label for="phone" class="block text-sm font-medium text-gray-600"
          >Phone Number</label
        >
        <input
          type="tel"
          id="phone"
          name="phone"
          bind:value={phone}
          on:input={() => validatePhoneNumber(country, phone)}
          placeholder="Enter your phone number"
          class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md
                    focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400
                    placeholder:text-sm h-10"
        />
        {#if errors.phone}
          <div class="text-red-500 text-xs mt-1">{errors.phone}</div>
        {/if}
      </div>
      {#if showBusinessDetails}
        <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div class="flex-1 mb-2 md:mb-0">
            <label
              for="gstNumber"
              class="block text-sm font-medium text-gray-600">GST Number</label
            >
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              placeholder="Enter your GST number"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
              bind:value={gstNumber}
              on:input={validateGstNumber}
            />
            {#if errors.gstNumber}
              <div class="text-red-500 text-xs mt-1">{errors.gstNumber}</div>
            {/if}
          </div>

          <div class="flex-1 mb-2 md:mb-0 relative">
            <label
              for="tanNumber"
              class="block text-sm font-medium text-gray-600">TAN Number</label
            >
            <div class="relative">
              <input
                type="text"
                id="tanNumber"
                name="tanNumber"
                placeholder="Enter your TAN number"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm text-sm h-10"
                on:input={validateTanNumber}
                bind:value={tanNumber}
              />
              {#if errors.tanNumber}
                <div class="text-red-500 text-xs mt-1">{errors.tanNumber}</div>
              {/if}
            </div>
          </div>
        </div>
      {/if}
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-600"
          >Password</label
        >
        <input
          type="password"
          id="password"
          name="password"
          bind:value={password}
          on:input={() => validatePassword()}
          placeholder="Enter your password"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 text-sm placeholder:text-sm h-10"
        />
        {#if errors.password}
          <div class="text-red-500 text-xs mt-1">{errors.password}</div>
        {/if}
        <div class="text-gray-400 text-sm mt-1">
          <p>*Contain at least 8 Characters</p>
          <p>*Cannot contain common or guessable text</p>
          <p>*Contain at least one number</p>
          <p>*Contain one of the following special characters !@#$%_-*</p>
        </div>
      </div>

      <div class="mb-4">
        <label
          for="passwordConfirm"
          class="block text-sm font-medium text-gray-600"
          >Confirm Password</label
        >
        <input
          type="password"
          id="passwordConfirm"
          name="confirmpassword"
          bind:value={passwordConfirm}
          on:input={() => validateConfirmPassword()}
          placeholder="Confirm your password"
          class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10"
        />
        {#if errors.passwordConfirm}
          <div class="text-red-500 text-xs mt-1">{errors.passwordConfirm}</div>
        {/if}
      </div>

      <div class="mb-4">
        <div class="text-primary-500 text-sm font-semibold">
          TERMS AND CONDITION:
        </div>
        <p class="text-gray-500 text-sm">
          We will occasionally contact you with relevant updates about your
          account and our products and services. You may manage your account
          preferences in your account or unsubscribe at any time. We are
          committed to protecting the privacy of your personal data.
        </p>
      </div>
      <div class="flex gap-2 {errors.termsAndConditions ? 'mb-1' : 'mb-4'}">
        <input
          type="checkbox"
          name="termsAndConditions"
          value={true}
          bind:checked={termsAccepted}
          on:change={validateForm}
          class="mt-0.5 text-primary-500 rounded focus:ring-0"
        />
        <div class=" text-sm">
          I have read and agreed to the
          <a
            class="font-medium text-primary-500 hover:underline"
            href="/terms/site-and-terms"
          >
            Terms of Service
          </a>
          and
          <a
            class="font-medium text-primary-500 hover:underline"
            href="/terms/privacy-notice">Privacy Policy</a
          >
        </div>
      </div>
      {#if errors.termsAndConditions}
        <div class="text-red-500 text-xs block mb-4">
          {errors.termsAndConditions}
        </div>
      {/if}

      <div class="mb-4 hidden md:block text-gray-500">
        <div class="flex flex-col md:flex-row items-start"></div>
      </div>

      <button
        type="submit"
        class="w-full bg-primary-400 text-white py-2 rounded-md hover:bg-primary-500 transition duration-200"
        >Create Account</button
      >
    </form>
    <div class="relative flex items-center my-4 w-full">
      <div class="flex-grow border-t border-gray-300"></div>
      <span class="px-2 text-sm text-gray-500 font-bold bg-white">OR</span>
      <div class="flex-grow border-t border-gray-300"></div>
    </div>
    <button
      class="w-full flex items-center justify-center py-2 px-4 text-white bg-blue-600 hover:bg-blue-600 rounded-md transition duration-200"
      ><a href={linkedinUrl} class="flex items-center space-x-2">
        <Icon icon="bi:linkedin" class="text-2xl" />
        <span class="text-sm font-medium">Continue with LinkedIn</span></a
      ></button
    >
  </div>
</div>
