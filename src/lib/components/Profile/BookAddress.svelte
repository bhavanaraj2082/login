 <script>
	import { enhance } from '$app/forms';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher()
    export let recordId
    export let organizationAddress
    export let shippingAddress
    export let billingAddress
    import { onMount } from 'svelte';

onMount(() => {
    activeBook(2, 'shipping');
});
    let active = 2
    let activeAddressType ='shipping'
    let activeAddress
    let toggleEdit = false
    let errors = {}

    let dummy = {
        organizationName:'',
        attentionTo:'',
        street:'',
        city:'',
        state:'',
        location:'',
        department:'',
        postalCode:'',
        building:''
    }

    let states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Lakshadweep",
        "Delhi",
        "Puducherry"
    ];

    const countries = [
    { name: 'Afghanistan', code: '+93', postalRegex: /^\d{4}$/ },
    { name: 'Albania', code: '+355', postalRegex: /^\d{4}$/ },
    { name: 'Algeria', code: '+213', postalRegex: /^\d{5}$/ },
    { name: 'Andorra', code: '+376', postalRegex: /^\d{3}$/ },
    { name: 'Angola', code: '+244', postalRegex: /^\d{6}$/ },
    { name: 'Antigua and Barbuda', code: '+1-268', postalRegex: /^\d{4}$/ },
    { name: 'Argentina', code: '+54', postalRegex: /^\d{4}$/ },
    { name: 'Armenia', code: '+374', postalRegex: /^\d{4}$/ },
    { name: 'Australia', code: '+61', postalRegex: /^\d{4}$/ },
    { name: 'Austria', code: '+43', postalRegex: /^\d{4}$/ },
    { name: 'Azerbaijan', code: '+994', postalRegex: /^\d{4}$/ },
    { name: 'Bahamas', code: '+1-242', postalRegex: /^\d{5}$/ },
    { name: 'Bahrain', code: '+973', postalRegex: /^\d{3}$/ },
    { name: 'Bangladesh', code: '+880', postalRegex: /^\d{4}$/ },
    { name: 'Barbados', code: '+1-246', postalRegex: /^\d{5}$/ },
    { name: 'Belarus', code: '+375', postalRegex: /^\d{6}$/ },
    { name: 'Belgium', code: '+32', postalRegex: /^\d{4}$/ },
    { name: 'Belize', code: '+501', postalRegex: /^\d{5}$/ },
    { name: 'Benin', code: '+229', postalRegex: /^\d{2}$/ },
    { name: 'Bhutan', code: '+975', postalRegex: /^\d{5}$/ },
    { name: 'Bolivia', code: '+591', postalRegex: /^\d{4}$/ },
    { name: 'Bosnia and Herzegovina', code: '+387', postalRegex: /^\d{5}$/ },
    { name: 'Botswana', code: '+267', postalRegex: /^\d{3}$/ },
    { name: 'Brazil', code: '+55', postalRegex: /^\d{5}-\d{3}$/ },
    { name: 'Brunei', code: '+673', postalRegex: /^\d{4}$/ },
    { name: 'Bulgaria', code: '+359', postalRegex: /^\d{4}$/ },
    { name: 'Burkina Faso', code: '+226', postalRegex: /^\d{4}$/ },
    { name: 'Burundi', code: '+257', postalRegex: /^\d{5}$/ },
    { name: 'Cabo Verde', code: '+238', postalRegex: /^\d{4}$/ },
    { name: 'Cambodia', code: '+855', postalRegex: /^\d{5}$/ },
    { name: 'Cameroon', code: '+237', postalRegex: /^\d{5}$/ },
    { name: 'Canada', code: '+1', postalRegex: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/ },
    { name: 'Central African Republic', code: '+236', postalRegex: /^\d{5}$/ },
    { name: 'Chad', code: '+235', postalRegex: /^\d{5}$/ },
    { name: 'Chile', code: '+56', postalRegex: /^\d{7}$/ },
    { name: 'China', code: '+86', postalRegex: /^\d{6}$/ },
    { name: 'Colombia', code: '+57', postalRegex: /^\d{6}$/ },
    { name: 'Comoros', code: '+269', postalRegex: /^\d{5}$/ },
    { name: 'Congo, Republic of the', code: '+242', postalRegex: /^\d{5}$/ },
    { name: 'Congo, Democratic Republic of the', code: '+243', postalRegex: /^\d{5}$/ },
    { name: 'Costa Rica', code: '+506', postalRegex: /^\d{4}$/ },
    { name: 'Croatia', code: '+385', postalRegex: /^\d{5}$/ },
    { name: 'Cuba', code: '+53', postalRegex: /^\d{5}$/ },
    { name: 'Cyprus', code: '+357', postalRegex: /^\d{4}$/ },
    { name: 'Czech Republic', code: '+420', postalRegex: /^\d{5}$/ },
    { name: 'Denmark', code: '+45', postalRegex: /^\d{4}$/ },
    { name: 'Djibouti', code: '+253', postalRegex: /^\d{5}$/ },
    { name: 'Dominica', code: '+1-767', postalRegex: /^\d{4}$/ },
    { name: 'Dominican Republic', code: '+1-809', postalRegex: /^\d{5}$/ },
    { name: 'Ecuador', code: '+593', postalRegex: /^\d{6}$/ },
    { name: 'Egypt', code: '+20', postalRegex: /^\d{5}$/ },
    { name: 'El Salvador', code: '+503', postalRegex: /^\d{4}$/ },
    { name: 'Equatorial Guinea', code: '+240', postalRegex: /^\d{5}$/ },
    { name: 'Eritrea', code: '+291', postalRegex: /^\d{4}$/ },
    { name: 'Estonia', code: '+372', postalRegex: /^\d{5}$/ },
    { name: 'Eswatini', code: '+268', postalRegex: /^\d{4}$/ },
    { name: 'Ethiopia', code: '+251', postalRegex: /^\d{4}$/ },
    { name: 'Fiji', code: '+679', postalRegex: /^\d{4}$/ },
    { name: 'Finland', code: '+358', postalRegex: /^\d{5}$/ },
    { name: 'France', code: '+33', postalRegex: /^\d{5}$/ },
    { name: 'Gabon', code: '+241', postalRegex: /^\d{5}$/ },
    { name: 'Gambia', code: '+220', postalRegex: /^\d{4}$/ },
    { name: 'Georgia', code: '+995', postalRegex: /^\d{4}$/ },
    { name: 'Germany', code: '+49', postalRegex: /^\d{5}$/ },
    { name: 'Ghana', code: '+233', postalRegex: /^\d{5}$/ },
    { name: 'Greece', code: '+30', postalRegex: /^\d{5}$/ },
    { name: 'Grenada', code: '+1-473', postalRegex: /^\d{4}$/ },
    { name: 'Guatemala', code: '+502', postalRegex: /^\d{5}$/ },
    { name: 'Guinea', code: '+224', postalRegex: /^\d{4}$/ },
    { name: 'Guinea-Bissau', code: '+245', postalRegex: /^\d{4}$/ },
    { name: 'Guyana', code: '+592', postalRegex: /^\d{5}$/ },
    { name: 'Haiti', code: '+509', postalRegex: /^\d{4}$/ },
    { name: 'Honduras', code: '+504', postalRegex: /^\d{5}$/ },
    { name: 'Hungary', code: '+36', postalRegex: /^\d{4}$/ },
    { name: 'Iceland', code: '+354', postalRegex: /^\d{3}$/ },
    { name: 'India', code: '+91', postalRegex: /^\d{6}$/ },
    { name: 'Indonesia', code: '+62', postalRegex: /^\d{5}$/ },
    { name: 'Iran', code: '+98', postalRegex: /^\d{5}$/ },
    { name: 'Iraq', code: '+964', postalRegex: /^\d{5}$/ },
    { name: 'Ireland', code: '+353', postalRegex: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/ },
    { name: 'Israel', code: '+972', postalRegex: /^\d{5}$/ },
    { name: 'Italy', code: '+39', postalRegex: /^\d{5}$/ },
    { name: 'Jamaica', code: '+1-876', postalRegex: /^\d{5}$/ },
    { name: 'Japan', code: '+81', postalRegex: /^\d{3}-\d{4}$/ },
    { name: 'Jordan', code: '+962', postalRegex: /^\d{5}$/ },
    { name: 'Kazakhstan', code: '+7', postalRegex: /^\d{6}$/ },
    { name: 'Kenya', code: '+254', postalRegex: /^\d{5}$/ },
    { name: 'Kiribati', code: '+686', postalRegex: /^\d{4}$/ },
    { name: 'Kuwait', code: '+965', postalRegex: /^\d{5}$/ },
    { name: 'Kyrgyzstan', code: '+996', postalRegex: /^\d{6}$/ },
    { name: 'Laos', code: '+856', postalRegex: /^\d{5}$/ },
    { name: 'Latvia', code: '+371', postalRegex: /^\d{4}$/ },
    { name: 'Lebanon', code: '+961', postalRegex: /^\d{5}$/ },
    { name: 'Lesotho', code: '+266', postalRegex: /^\d{4}$/ },
    { name: 'Liberia', code: '+231', postalRegex: /^\d{4}$/ },
    { name: 'Libya', code: '+218', postalRegex: /^\d{5}$/ },
    { name: 'Liechtenstein', code: '+423', postalRegex: /^\d{4}$/ },
    { name: 'Lithuania', code: '+370', postalRegex: /^\d{5}$/ },
    { name: 'Luxembourg', code: '+352', postalRegex: /^\d{4}$/ },
    { name: 'Madagascar', code: '+261', postalRegex: /^\d{5}$/ },
    { name: 'Malawi', code: '+265', postalRegex: /^\d{5}$/ },
    { name: 'Malaysia', code: '+60', postalRegex: /^\d{5}$/ },
    { name: 'Maldives', code: '+960', postalRegex: /^\d{5}$/ },
    { name: 'Mali', code: '+223', postalRegex: /^\d{5}$/ },
    { name: 'Malta', code: '+356', postalRegex: /^\d{4}$/ },
    { name: 'Marshall Islands', code: '+692', postalRegex: /^\d{5}$/ },
    { name: 'Mauritania', code: '+222', postalRegex: /^\d{5}$/ },
    { name: 'Mauritius', code: '+230', postalRegex: /^\d{5}$/ },
    { name: 'Mexico', code: '+52', postalRegex: /^\d{5}$/ },
    { name: 'Micronesia', code: '+691', postalRegex: /^\d{5}$/ },
    { name: 'Moldova', code: '+373', postalRegex: /^\d{5}$/ },
    { name: 'Monaco', code: '+377', postalRegex: /^\d{5}$/ },
    { name: 'Mongolia', code: '+976', postalRegex: /^\d{5}$/ },
    { name: 'Montenegro', code: '+382', postalRegex: /^\d{5}$/ },
    { name: 'Morocco', code: '+212', postalRegex: /^\d{5}$/ },
    { name: 'Mozambique', code: '+258', postalRegex: /^\d{5}$/ },
    { name: 'Myanmar', code: '+95', postalRegex: /^\d{5}$/ },
    { name: 'Namibia', code: '+264', postalRegex: /^\d{4}$/ },
    { name: 'Nauru', code: '+674', postalRegex: /^\d{4}$/ },
    { name: 'Nepal', code: '+977', postalRegex: /^\d{5}$/ },
    { name: 'Netherlands', code: '+31', postalRegex: /^\d{4} ?[A-Za-z]{2}$/ },
    { name: 'New Zealand', code: '+64', postalRegex: /^\d{4}$/ },
    { name: 'Nicaragua', code: '+505', postalRegex: /^\d{5}$/ },
    { name: 'Niger', code: '+227', postalRegex: /^\d{5}$/ },
    { name: 'Nigeria', code: '+234', postalRegex: /^\d{6}$/ },
    { name: 'North Macedonia', code: '+389', postalRegex: /^\d{4}$/ },
    { name: 'Norway', code: '+47', postalRegex: /^\d{4}$/ },
    { name: 'Oman', code: '+968', postalRegex: /^\d{3}$/ },
    { name: 'Pakistan', code: '+92', postalRegex: /^\d{5}$/ },
    { name: 'Palau', code: '+680', postalRegex: /^\d{5}$/ },
    { name: 'Panama', code: '+507', postalRegex: /^\d{5}$/ },
    { name: 'Papua New Guinea', code: '+675', postalRegex: /^\d{3}$/ },
    { name: 'Paraguay', code: '+595', postalRegex: /^\d{5}$/ },
    { name: 'Peru', code: '+51', postalRegex: /^\d{5}$/ },
    { name: 'Philippines', code: '+63', postalRegex: /^\d{4}$/ },
    { name: 'Poland', code: '+48', postalRegex: /^\d{2}-\d{3}$/ },
    { name: 'Portugal', code: '+351', postalRegex: /^\d{4}-\d{3}$/ },
    { name: 'Qatar', code: '+974', postalRegex: /^\d{5}$/ },
    { name: 'Romania', code: '+40', postalRegex: /^\d{6}$/ },
    { name: 'Russia', code: '+7', postalRegex: /^\d{6}$/ },
    { name: 'Rwanda', code: '+250', postalRegex: /^\d{5}$/ },
    { name: 'Saint Kitts and Nevis', code: '+1-869', postalRegex: /^\d{5}$/ },
    { name: 'Saint Lucia', code: '+1-758', postalRegex: /^\d{5}$/ },
    { name: 'Saint Vincent and the Grenadines', code: '+1-784', postalRegex: /^\d{5}$/ },
    { name: 'Samoa', code: '+685', postalRegex: /^\d{5}$/ },
    { name: 'San Marino', code: '+378', postalRegex: /^\d{5}$/ },
    { name: 'Sao Tome and Principe', code: '+239', postalRegex: /^\d{5}$/ },
    { name: 'Saudi Arabia', code: '+966', postalRegex: /^\d{5}$/ },
    { name: 'Senegal', code: '+221', postalRegex: /^\d{5}$/ },
    { name: 'Serbia', code: '+381', postalRegex: /^\d{5}$/ },
    { name: 'Seychelles', code: '+248', postalRegex: /^\d{5}$/ },
    { name: 'Sierra Leone', code: '+232', postalRegex: /^\d{5}$/ },
    { name: 'Singapore', code: '+65', postalRegex: /^\d{6}$/ },
    { name: 'Slovakia', code: '+421', postalRegex: /^\d{5}$/ },
    { name: 'Slovenia', code: '+386', postalRegex: /^\d{4}$/ },
    { name: 'Solomon Islands', code: '+677', postalRegex: /^\d{5}$/ },
    { name: 'Somalia', code: '+252', postalRegex: /^\d{5}$/ },
    { name: 'South Africa', code: '+27', postalRegex: /^\d{4}$/ },
    { name: 'South Korea', code: '+82', postalRegex: /^\d{5}$/ },
    { name: 'South Sudan', code: '+211', postalRegex: /^\d{5}$/ },
    { name: 'Spain', code: '+34', postalRegex: /^\d{5}$/ },
    { name: 'Sri Lanka', code: '+94', postalRegex: /^\d{5}$/ },
    { name: 'Sudan', code: '+249', postalRegex: /^\d{5}$/ },
    { name: 'Suriname', code: '+597', postalRegex: /^\d{5}$/ },
    { name: 'Sweden', code: '+46', postalRegex: /^\d{5}$/ },
    { name: 'Switzerland', code: '+41', postalRegex: /^\d{4}$/ },
    { name: 'Syria', code: '+963', postalRegex: /^\d{5}$/ },
    { name: 'Taiwan', code: '+886', postalRegex: /^\d{5}$/ },
    { name: 'Tajikistan', code: '+992', postalRegex: /^\d{6}$/ },
    { name: 'Tanzania', code: '+255', postalRegex: /^\d{5}$/ },
    { name: 'Thailand', code: '+66', postalRegex: /^\d{5}$/ },
    { name: 'Togo', code: '+228', postalRegex: /^\d{5}$/ },
    { name: 'Trinidad and Tobago', code: '+1-868', postalRegex: /^\d{6}$/ },
    { name: 'Tunisia', code: '+216', postalRegex: /^\d{5}$/ },
    { name: 'Turkey', code: '+90', postalRegex: /^\d{5}$/ },
    { name: 'Turkmenistan', code: '+993', postalRegex: /^\d{6}$/ },
    { name: 'Tuvalu', code: '+688', postalRegex: /^\d{5}$/ },
    { name: 'Uganda', code: '+256', postalRegex: /^\d{5}$/ },
    { name: 'Ukraine', code: '+380', postalRegex: /^\d{5}$/ },
    { name: 'United Arab Emirates', code: '+971', postalRegex: /^\d{5}$/ },
    { name: 'United Kingdom', code: '+44', postalRegex: /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/ },
    { name: 'United States', code: '+1', postalRegex: /^\d{5}(-\d{4})?$/ },
    { name: 'Uruguay', code: '+598', postalRegex: /^\d{5}$/ },
    { name: 'Uzbekistan', code: '+998', postalRegex: /^\d{6}$/ },
    { name: 'Vanuatu', code: '+678', postalRegex: /^\d{4}$/ },
    { name: 'Vatican City', code: '+379', postalRegex: /^\d{5}$/ },
    { name: 'Venezuela', code: '+58', postalRegex: /^\d{5}$/ },
    { name: 'Vietnam', code: '+84', postalRegex: /^\d{5}$/ },
    { name: 'Yemen', code: '+967', postalRegex: /^\d{5}$/ },
    { name: 'Zambia', code: '+260', postalRegex: /^\d{5}$/ },
    { name: 'Zimbabwe', code: '+263', postalRegex: /^\d{5}$/ }
];

const postalCodePatterns = {
  "Afghanistan": /^\d{4}$/,               // Example: 1001
  "Algeria": /^\d{5}$/,                   // Example: 16000
  "Andorra": /^\d{3}$/,                   // Example: AD100
  "Angola": /^\d{6}$/,                    // Example: 00100
  "Antigua and Barbuda": /^\d{4}$/,       // Example: 1234
  "Argentina": /^\d{4}$/,                 // Example: C1000
  "Armenia": /^\d{4}$/,                   // Example: 0001
  "Australia": /^\d{4}$/,                 // Example: 2000
  "Austria": /^\d{4}$/,                   // Example: 1010
  "Azerbaijan": /^\d{4}$/,                // Example: 1000
  "Bahamas": /^\d{5}$/,                   // Example: 1020
  "Bahrain": /^\d{3}$/,                   // Example: 100
  "Bangladesh": /^\d{4}$/,                // Example: 1212
  "Barbados": /^\d{4}$/,                  // Example: 1234
  "Belarus": /^\d{6}$/,                   // Example: 220000
  "Belgium": /^\d{4}$/,                   // Example: 1000
  "Belize": /^\d{6}$/,                    // Example: 123456
  "Benin": /^\d{4}$/,                     // Example: 1234
  "Bhutan": /^\d{5}$/,                    // Example: 11001
  "Bolivia": /^\d{4}$/,                   // Example: 1010
  "Bosnia and Herzegovina": /^\d{5}$/,    // Example: 71000
  "Botswana": /^\d{5}$/,                  // Example: 10101
  "Brazil": /^\d{5}-\d{3}$/,              // Example: 01000-000
  "Brunei": /^\d{6}$/,                    // Example: 123456
  "Bulgaria": /^\d{4}$/,                  // Example: 1000
  "Burkina Faso": /^\d{5}$/,              // Example: 12345
  "Burundi": /^\d{5}$/,                   // Example: 12345
  "Cambodia": /^\d{5}$/,                  // Example: 12345
  "Cameroon": /^\d{5}$/,                  // Example: 12345
  "Canada": /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, // Example: K1A 0B1
  "Cape Verde": /^\d{4}$/,                // Example: 1234
  "Cayman Islands": /^\d{5}$/,            // Example: KY1-1000
  "Central African Republic": /^\d{5}$/,  // Example: 12345
  "Chad": /^\d{5}$/,                      // Example: 12345
  "Chile": /^\d{7}$/,                     // Example: 1234567
  "China": /^\d{6}$/,                     // Example: 100000
  "Colombia": /^\d{6}$/,                  // Example: 110001
  "Comoros": /^\d{5}$/,                   // Example: 12345
  "Congo (Republic of the)": /^\d{5}$/,   // Example: 12345
  "Congo (Democratic Republic of the)": /^\d{5}$/, // Example: 12345
  "Costa Rica": /^\d{5}$/,                // Example: 10101
  "Croatia": /^\d{5}$/,                   // Example: 10000
  "Cuba": /^\d{5}$/,                      // Example: 10100
  "Cyprus": /^\d{4}$/,                    // Example: 2300
  "Czech Republic": /^\d{5}$/,            // Example: 11000
  "Denmark": /^\d{4}$/,                   // Example: 1000
  "Djibouti": /^\d{5}$/,                  // Example: 12345
  "Dominica": /^\d{4}$/,                  // Example: 1234
  "Dominican Republic": /^\d{5}$/,        // Example: 10101
  "Ecuador": /^\d{6}$/,                   // Example: 170001
  "Egypt": /^\d{5}$/,                     // Example: 11511
  "El Salvador": /^\d{4}$/,               // Example: 1101
  "Equatorial Guinea": /^\d{5}$/,         // Example: 12345
  "Eritrea": /^\d{4}$/,                   // Example: 1234
  "Estonia": /^\d{5}$/,                   // Example: 10123
  "Eswatini": /^\d{4}$/,                  // Example: 1234
  "Ethiopia": /^\d{4}$/,                  // Example: 1234
  "Fiji": /^\d{4}$/,                      // Example: 1234
  "Finland": /^\d{5}$/,                   // Example: 00100
  "France": /^\d{5}$/,                    // Example: 75001
  "Gabon": /^\d{5}$/,                     // Example: 12345
  "Gambia": /^\d{5}$/,                    // Example: 10000
  "Georgia": /^\d{4}$/,                   // Example: 0101
  "Germany": /^\d{5}$/,                   // Example: 10115
  "Ghana": /^\d{5}$/,                     // Example: 12345
  "Greece": /^\d{5}$/,                    // Example: 10558
  "Grenada": /^\d{4}$/,                   // Example: 1234
  "Guatemala": /^\d{5}$/,                 // Example: 01010
  "Guinea": /^\d{4}$/,                    // Example: 1234
  "Guinea-Bissau": /^\d{4}$/,             // Example: 1234
  "Guyana": /^\d{5}$/,                    // Example: 12345
  "Haiti": /^\d{4}$/,                     // Example: 1234
  "Honduras": /^\d{5}$/,                  // Example: 11101
  "Hungary": /^\d{4}$/,                   // Example: 1012
  "Iceland": /^\d{3}$/,                   // Example: 101
  "India": /^\d{6}$/,                     // Example: 110001
  "Indonesia": /^\d{5}$/,                 // Example: 10220
  "Iran": /^\d{5}$/,                      // Example: 12345
  "Iraq": /^\d{5}$/,                      // Example: 12345
  "Ireland": /^\d{4}$/,                   // Example: 1234
  "Israel": /^\d{5}$/,                    // Example: 10000
  "Italy": /^\d{5}$/,                     // Example: 00100
  "Jamaica": /^\d{5}$/,                   // Example: 00000
  "Japan": /^\d{3}-\d{4}$/,               // Example: 100-0001
  "Jordan": /^\d{5}$/,                    // Example: 11822
  "Kazakhstan": /^\d{6}$/,                // Example: 100000
  "Kenya": /^\d{5}$/,                     // Example: 00100
  "Kiribati": /^\d{4}$/,                  // Example: 1234
  "Korea (North)": /^\d{5}$/,             // Example: 12345
  "Korea (South)": /^\d{5}$/,             // Example: 12345
  "Kuwait": /^\d{5}$/,                    // Example: 12345
  "Kyrgyzstan": /^\d{6}$/,                // Example: 720000
  "Laos": /^\d{5}$/,                      // Example: 12345
  "Latvia": /^\d{4}$/,                    // Example: 1001
  "Lebanon": /^\d{4}$/,                   // Example: 1234
  "Lesotho": /^\d{4}$/,                   // Example: 1234
  "Liberia": /^\d{5}$/,                   // Example: 12345
  "Libya": /^\d{5}$/,                     // Example: 12345
  "Liechtenstein": /^\d{4}$/,             // Example: 9490
  "Lithuania": /^\d{5}$/,                 // Example: 1000
  "Luxembourg": /^\d{4}$/,                // Example: 1234
  "Madagascar": /^\d{5}$/,                // Example: 101
  "Malawi": /^\d{5}$/,                    // Example: 12345
  "Malaysia": /^\d{5}$/,                  // Example: 50000
  "Maldives": /^\d{5}$/,                  // Example: 2030
  "Mali": /^\d{5}$/,                      // Example: 12345
  "Malta": /^\d{4}$/,                     // Example: 1234
  "Marshall Islands": /^\d{5}$/,          // Example: 12345
  "Mauritania": /^\d{5}$/,                // Example: 12345
  "Mauritius": /^\d{3}$/,                 // Example: 123
  "Mexico": /^\d{5}$/,                    // Example: 01000
  "Micronesia": /^\d{5}$/,                // Example: 12345
  "Moldova": /^\d{4}$/,                   // Example: 1234
  "Monaco": /^\d{5}$/,                    // Example: 98000
  "Mongolia": /^\d{5}$/,                  // Example: 01000
  "Montenegro": /^\d{5}$/,                // Example: 81000
  "Morocco": /^\d{5}$/,                   // Example: 10000
  "Mozambique": /^\d{5}$/,                // Example: 12345
  "Myanmar": /^\d{5}$/,                   // Example: 12345
  "Namibia": /^\d{4}$/,                   // Example: 1234
  "Nauru": /^\d{4}$/,                     // Example: 1234
  "Nepal": /^\d{5}$/,                     // Example: 44600
  "Netherlands": /^\d{4}\s?[A-Za-z]{2}$/, // Example: 1000 AB
  "New Zealand": /^\d{4}$/,               // Example: 6011
  "Nicaragua": /^\d{5}$/,                 // Example: 11000
  "Niger": /^\d{4}$/,                     // Example: 1234
  "Nigeria": /^\d{6}$/,                   // Example: 110001
  "North Macedonia": /^\d{4}$/,            // Example: 1000
  "Norway": /^\d{4}$/,                    // Example: 0150
  "Oman": /^\d{3}$/,                      // Example: 100
  "Pakistan": /^\d{5}$/,                  // Example: 11000
  "Palau": /^\d{5}$/,                     // Example: 12345
  "Panama": /^\d{4}$/,                    // Example: 0801
  "Papua New Guinea": /^\d{3}$/,          // Example: 100
  "Paraguay": /^\d{4}$/,                  // Example: 1234
  "Peru": /^\d{5}$/,                      // Example: 15073
  "Philippines": /^\d{4}$/,               // Example: 1000
  "Poland": /^\d{5}$/,                    // Example: 00-001
  "Portugal": /^\d{4}-\d{3}$/,            // Example: 1000-001
  "Qatar": /^\d{5}$/,                     // Example: 12345
  "Romania": /^\d{6}$/,                   // Example: 100000
  "Russia": /^\d{6}$/,                    // Example: 101000
  "Rwanda": /^\d{5}$/,                    // Example: 10000
  "Saint Kitts and Nevis": /^\d{5}$/,     // Example: 12345
  "Saint Lucia": /^\d{4}$/,               // Example: 1234
  "Saint Vincent and the Grenadines": /^\d{4}$/, // Example: 1234
  "Samoa": /^\d{5}$/,                     // Example: 12345
  "San Marino": /^\d{5}$/,                // Example: 47890
  "Sao Tome and Principe": /^\d{5}$/,     // Example: 12345
  "Saudi Arabia": /^\d{5}$/,              // Example: 12345
  "Senegal": /^\d{5}$/,                   // Example: 12345
  "Serbia": /^\d{5}$/,                    // Example: 11000
  "Seychelles": /^\d{4}$/,                // Example: 1234
  "Sierra Leone": /^\d{5}$/,              // Example: 12345
  "Singapore": /^\d{6}$/,                 // Example: 123456
  "Slovakia": /^\d{5}$/,                  // Example: 01001
  "Slovenia": /^\d{4}$/,                  // Example: 1000
  "Solomon Islands": /^\d{4}$/,           // Example: 1234
  "Somalia": /^\d{5}$/,                   // Example: 12345
  "South Africa": /^\d{4}$/,              // Example: 2000
  "South Sudan": /^\d{5}$/,               // Example: 12345
  "Spain": /^\d{5}$/,                     // Example: 28001
  "Sri Lanka": /^\d{5}$/,                 // Example: 10100
  "Sudan": /^\d{5}$/,                     // Example: 12345
  "Suriname": /^\d{5}$/,                  // Example: 10000
  "Sweden": /^\d{3}\s?\d{2}$/,            // Example: 123 45
  "Switzerland": /^\d{4}$/,               // Example: 8000
  "Syria": /^\d{5}$/,                     // Example: 12345
  "Taiwan": /^\d{5}$/,                    // Example: 100
  "Tajikistan": /^\d{6}$/,                // Example: 100000
  "Tanzania": /^\d{5}$/,                  // Example: 12345
  "Thailand": /^\d{5}$/,                  // Example: 10100
  "Togo": /^\d{5}$/,                      // Example: 12345
  "Tonga": /^\d{4}$/,                     // Example: 1234
  "Trinidad and Tobago": /^\d{6}$/,       // Example: 10101
  "Tunisia": /^\d{4}$/,                   // Example: 1000
  "Turkey": /^\d{5}$/,                    // Example: 34000
  "Turkmenistan": /^\d{6}$/,              // Example: 744000
  "Tuvalu": /^\d{5}$/,                    // Example: 12345
  "Uganda": /^\d{5}$/,                    // Example: 12345
  "Ukraine": /^\d{5}$/,                   // Example: 01000
  "United Arab Emirates": /^\d{5}$/,      // Example: 12345
  "United Kingdom": /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/, // Example: SW1A 1AA
  "United States": /^\d{5}(-\d{4})?$/,    // Example: 90210 or 90210-1234
  "Uruguay": /^\d{5}$/,                   // Example: 11000
  "Uzbekistan": /^\d{6}$/,                // Example: 100000
  "Vanuatu": /^\d{4}$/,                   // Example: 1234
  "Vatican City": /^\d{5}$/,              // Example: 00120
};


let showDropdown = false;
let filteredCountries = countries;
let autoSelectedOnce = false;
let previousSearchTerm = '';

function selectCountry(selectedCountry) {
   let country = selectedCountry.name;
    filteredCountries = countries; 
    showDropdown = false; 
    validateForm('location');
    delete errors.location; 
    autoSelectedOnce = false; 
}

function handleInput(event) {
  const searchTerm = activeAddress.location.toLowerCase().trim();
  const isDialCode = /^\d+$/.test(searchTerm);
  showDropdown = true;
  activeAddress.location=activeAddress.location.trim();


  const isTypingForward = searchTerm.length > previousSearchTerm.length;
  previousSearchTerm = searchTerm;
  autoSelectedOnce = searchTerm.length < 3 ? false : autoSelectedOnce;

  if (isDialCode) {
    filteredCountries = countries.filter(c => c.code.replace('+', '') === searchTerm);
    if (filteredCountries.length === 0) {
      filteredCountries = countries.filter(c =>
        c.code.replace('+', '').endsWith(searchTerm) &&
        c.code.replace('+', '').length === searchTerm.length + 1
      );
    }
  } else {
    filteredCountries = countries.filter(c =>
      c.name.toLowerCase().startsWith(searchTerm) ||
      c.code.toLowerCase().includes(searchTerm)
    );
  }

  if (filteredCountries.length === 1 && searchTerm.length >= 2 && !autoSelectedOnce && isTypingForward) {
    const autoSelectedCountry = filteredCountries[0];
    setTimeout(() => {
      activeAddress.location = autoSelectedCountry.name;
      selectCountry(autoSelectedCountry);
      autoSelectedOnce = true;
      showDropdown = false; 
    }, 200);
  }

  validateLocation();
}

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // prevent form submission if inside a form
    if (filteredCountries.length > 0) {
      const autoSelectedCountry = filteredCountries[0];
      activeAddress.location = autoSelectedCountry.name;
      selectCountry(autoSelectedCountry);
      showDropdown = false;
    }
  }
}


function validateLocation() {
  const found = countries.find(
    c => c.name.toLowerCase().trim() === activeAddress.location.toLowerCase().trim()
  );
  if (!found && activeAddress.location.length !== 0) {
    errors.location = "Please select a country from the list";
    return false;
  } else {
    delete errors.location;
    return true;
  }
}

let state = '';

let stateSearch = '';
  let showStateDropdown = false;
  let autoSelectedStateOnce = false;



  // Reactive filteredStates: filter states by search input
  $: filteredStates = stateSearch
    ? states.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()))
    : states;

  // Function to select a state from the dropdown
  function selectState(selected) {
    state = selected;
    stateSearch = selected;
    activeAddress.state = selected;
    showStateDropdown = false;
    autoSelectedStateOnce = true;
  }

  // Auto select if exactly one match after typing 2+ chars and not auto selected before
  $: {
    if (
      filteredStates.length === 1 &&
      stateSearch.length >= 2 &&
      !autoSelectedStateOnce
    ) {
      const autoSelected = filteredStates[0];
      setTimeout(() => {
        selectState(autoSelected);
        autoSelectedStateOnce = true;
      }, 200);
    }
    if (stateSearch.length < 2) {
      autoSelectedStateOnce = false;
    }
  }


let stateDropdownRef;






function handleFormClick(event) {
    const isState = stateDropdownRef?.contains(event.target);
    if (!isState) {
      showStateDropdown = false;
    }
  
  }

function toggleDropdown() {
    showDropdown = !showDropdown; 
    showStateDropdown = !showStateDropdown;

}

import {  onDestroy } from 'svelte';

let containerRef;

let handleClickOutside;

onMount(() => {
  handleClickOutside = (event) => {
    if (containerRef && !containerRef.contains(event.target)) {
      showDropdown = false;
    }
  };

  document.addEventListener('click', handleClickOutside);
});

onDestroy(() => {
  document.removeEventListener('click', handleClickOutside);
});





    activeAddress = organizationAddress === null ? activeAddress = dummy : activeAddress = organizationAddress
     
    if(!toggleEdit){
       organizationAddress === null ? activeAddress = dummy : activeAddress = organizationAddress
    }

    const activeBook = (val,addressType)=>{
      active = val
      activeAddressType = addressType
      console.log('form dummy',dummy);
      if(activeAddressType === "shipping"){
        shippingAddress === null ? activeAddress = dummy : activeAddress = shippingAddress
      }
      if(activeAddressType === "billing"){
        billingAddress === null ? activeAddress = dummy : activeAddress = billingAddress
      }
    }

    const validateField = (field) => {
        const country = activeAddress.location;
const pattern = postalCodePatterns[country] || /^\d{6}$/;
    switch (field) {
        case 'street':
            if (!activeAddress.street) {
                errors.street = "Street is required";
            } else if (activeAddress.street.length < 3 || activeAddress.street.length > 100) {
                errors.street = "Street must be between 3 and 100 characters";
            } else if (!/^[A-Za-z0-9\s]+$/.test(activeAddress.street)) {
                errors.street = "Street must contain only letters, numbers, and spaces";
            } else {
                delete errors.street;
            }
            break;

        case 'building':
            if (activeAddress.building) {
                if (activeAddress.building.length < 1 || activeAddress.building.length > 50) {
                    errors.building = "Building must be between 1 and 50 characters";
                } else if (!/^[A-Za-z0-9\s]+$/.test(activeAddress.building)) {
                    errors.building = "Building must contain only letters, numbers, and spaces";
                } else {
                    delete errors.building;
                }
            } else {
                delete errors.building;
            }
            break;

        case 'city':
            if (!activeAddress.city) {
                errors.city = "City is required";
            } else if (activeAddress.city.length < 2 || activeAddress.city.length > 50) {
                errors.city = "City must be between 2 and 50 characters";
            } else if (!/^[A-Za-z\s]+$/.test(activeAddress.city)) {
                errors.city = "City must contain only letters and spaces";
            } else {
                delete errors.city;
            }
            break;

        case 'state':
            if (!activeAddress.state) {
                errors.state = "State is required";
            } else if (activeAddress.state.length < 2 || activeAddress.state.length > 50) {
                errors.state = "State must be between 2 and 50 characters";
            } else if (!/^[A-Za-z\s]+$/.test(activeAddress.state)) {
                errors.state = "State must contain only letters and spaces";
            } else {
                delete errors.state;
            }
            break;

        case 'location':
        if (!activeAddress.location) {
                errors.location = "Country is required";  // Country must be selected
            } else if (!countries.some(c => c.name.toLowerCase() === value.toLowerCase())) {
                errors.location = "Please select a country from the list";  // Check if country is in the list
            }else {
                delete errors.location;
            }
            break;
        case "postalCode":
  if (!activeAddress.postalCode) {
    errors.postalCode = "Postal Code is required";
  } else if (pattern && !pattern.test(activeAddress.postalCode)) {
    errors.postalCode = `Postal Code is invalid for ${country}`;
  }
  else {
                delete errors.postalCode;
            }
  break;

    }
};

const validateForm = () => {
    errors = {};
    const country = activeAddress.location;
const pattern = postalCodePatterns[country] || /^\d{6}$/;

    if (!activeAddress.street) {
        errors.street = "Street is required";
    } else if (activeAddress.street.length < 3 || activeAddress.street.length > 25) {
        errors.street = "Street must be between 3 and 25 characters";
    } else if (!/^[A-Za-z0-9\s]+$/.test(activeAddress.street)) {
        errors.street = "Street must contain only letters, numbers, and spaces";
    }

    if (activeAddress.building) {
        if (activeAddress.building.length < 1 || activeAddress.building.length > 25) {
            errors.building = "Building must be between 1 and 25 characters";
        } else if (!/^[A-Za-z0-9\s]+$/.test(activeAddress.building)) {
            errors.building = "Building must contain only letters, numbers, and spaces";
        }
    }

    if (!activeAddress.city) {
        errors.city = "City is required";
    } else if (activeAddress.city.length < 2 || activeAddress.city.length > 25) {
        errors.city = "City must be between 2 and 25 characters";
    } else if (!/^[A-Za-z\s]+$/.test(activeAddress.city)) {
        errors.city = "City must contain only letters and spaces";
    }

    if (!activeAddress.state) {
        errors.state = "State is required";
    } else if (activeAddress.state.length < 2 || activeAddress.state.length > 25) {
        errors.state = "State must be between 2 and 25 characters";
    } else if (!/^[A-Za-z\s]+$/.test(activeAddress.state)) {
        errors.state = "State must contain only letters and spaces";
    }

    if (!activeAddress.location) {
    errors.location = "Country is required"; // Country must be selected
} else if (!countries.some(c => c.name.toLowerCase() === activeAddress.location.toLowerCase())) {
    errors.location = "Please select a country from the list"; // Check if country is in the list
}

    if (!activeAddress.postalCode) {
    errors.postalCode = "Postal Code is required";
  } else if (pattern && !pattern.test(activeAddress.postalCode)) {
    errors.postalCode = `Postal Code is invalid for ${country}`;
  }
    return Object.keys(errors).length === 0;
};

const handleSubmit = ({ cancel }) => {
    if (!validateForm()) {
        cancel(); 
        return;
    }
    return async ({ result, update }) => {
        if (result.type === "success") {
            await update();
            toggleEdit = false;
            dummy = Object.fromEntries(Object.keys(dummy).map(key => [key, ""]));
            activeBook(active, activeAddressType);
            dispatch("onSuccess", result.data);
        }
    };
};

 </script>
 
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
 <div class="shadow  rounded-md p-5 bg-white"  on:click={handleFormClick}>
    {#if toggleEdit}
      <!-- address edit form -->
        <div class=" max-w-2xl">
        <h1 class=" text-xl font-bold capitalize"> Edit Your {activeAddressType} Address <span class=" text-xs font-normal"> <span class=" text-sm font-bold text-red-500">*</span>Represent required fields</span></h1>
        <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-3 py-3"
        method="POST" action="?/editAddresses" use:enhance={handleSubmit}>
           <input type="hidden" name="recordId" value={recordId}>
           <input type="hidden" name="addressType" value={activeAddressType}>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="location">
                        <span class=" text-sm font-bold text-red-500">*</span>Country</label><br>
                     <div class="relative z-10" bind:this={containerRef}>
                        <div class="flex items-center border border-gray-300 rounded my-1 overflow-hidden">
                            <input
                            type="text"
                            name="location"
                            bind:value={activeAddress.location}
                            placeholder="Search Country"
                            on:click={toggleDropdown}
                            on:input={toggleDropdown}
                            on:input={handleInput}
                            on:keydown={handleKeyDown}
                        class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-none"
                            />
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-500 transition-transform duration-200 cursor-pointer mr-2"
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
                      <ul class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                        {#each filteredCountries as { name, code }}
                          <!-- svelte-ignore a11y-click-events-have-key-events -->
                          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                          <li on:click|stopPropagation={() => selectCountry({ name, code })} class="cursor-pointer px-1 py-0 sm:text-sm text-xs hover:bg-gray-200">
                            <option value={code}>{name} ({code})</option>
                          </li>
                        {/each}
                        {#if filteredCountries.length === 0}
                          <li class="px-2 py-1 text-gray-500">No results found</li>
                        {/if}
                      </ul>
                    {/if}
                    
                          </div>
                    
                          {#if errors?.location}
                            <p class="text-red-500 text-xs mt-1">{errors.location}</p>
                          {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="state"><span class=" text-sm font-bold text-red-500">*</span>State</label><br>
                    {#if activeAddress.location === 'India'}
                          <!-- <select name="state" id="" bind:value={activeAddress.state } on:change={() => validateField('state')}
                    class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500">
                        {#each states as state}
                            <option value={state}>{state}</option>
                        {/each}
                    </select> -->


                    <div class="relative w-full text-xs" bind:this={stateDropdownRef}>
                        <div class="flex items-center border border-gray-300 rounded my-1 overflow-hidden">
                        <input
                          class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-none "
                          type="text"
                          bind:value={stateSearch}
                          on:input={() => {
                            showStateDropdown = true;
                            if (stateSearch.length < 2) autoSelectedStateOnce = false;
                          }}
                          on:focus={() => (showStateDropdown = true)}
                          on:keydown={(e) => {
                            if (e.key === 'Enter' && filteredStates.length > 0) {
                              e.preventDefault();
                              selectState(filteredStates[0]);
                            }
                          }}
                          placeholder="Search state"
                          autocomplete="off"
                        />
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-500 transition-transform duration-200 cursor-pointer mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        style:transform={showStateDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}
                        on:click={toggleDropdown}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                        </div>
                        {#if showStateDropdown}
                          <ul
                            class="absolute z-10 bg-white border border-gray-200 w-full max-h-40 overflow-y-auto text-xs mt-1 shadow"
                          >
                            {#each filteredStates as option}
                              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                              <li
                                class="px-2 py-1 cursor-pointer sm:text-sm text-xs hover:bg-gray-200"
                                on:click={() => selectState(option)}
                              >
                                {option}
                              </li>
                            {/each}
                            {#if filteredStates.length === 0}
                              <li class="px-2 py-1 text-gray-500">No results</li>
                            {/if}
                          </ul>
                        {/if}
                      </div>
                      {#if  !state}
                      <span class="text-red-500 text-xs block">State is required</span>
                      {/if}
                    {:else}
                         <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="state" bind:value={activeAddress.state } on:input={() => {validateField('state');activeAddress.state=activeAddress.state.trimStart();}}/>
                    {#if errors?.state}
                    <span class="text-red-600 text-xs">{errors.state}</span>
                    {/if}
                    {/if}
                   
                   
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
              
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="city">
                        <span class=" text-sm font-bold text-red-500">*</span>City</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="city" bind:value={activeAddress.city } on:input={() => {validateField('city');activeAddress.city=activeAddress.city.trimStart()}}/>
                    {#if errors?.city}
                     <span class="text-red-600 text-xs">{errors.city}</span>
                     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="street">
                        <span class=" text-sm font-bold text-red-500">*</span>Street</label><br>
                        <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                        type="text" name="street" bind:value={activeAddress.street } on:input={() => {validateField('street');activeAddress.street=activeAddress.street.trimStart();}}/>
                        {#if errors?.street}
                     <span class="text-red-600 text-xs">{errors.street}</span>
                     {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="building">
                        Building/Room</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="building" bind:value={activeAddress.building } on:input={() => {validateField('building');activeAddress.building=activeAddress.building.trimStart()}}/>
                    {#if errors?.building}
                     <span class="text-red-600 text-xs">{errors.building}</span>
                     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="postalCode"><span class=" text-sm font-bold text-red-500">*</span>Postal Code</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="postalCode" bind:value={activeAddress.postalCode } on:input={()=>{activeAddress.postalCode =activeAddress.postalCode .trim();validateField("postalCode");}}/>
                    {#if errors?.postalCode}
                        <span class="text-red-600 text-xs">{errors.postalCode}</span>
                    {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full"></div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <button type="button" on:click={()=>toggleEdit = false} class=" w-full rounded-md py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
                <button type="submit" class=" w-full rounded-md py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Submit</button>
            </div>
        </form>
        </div>
    {:else}
     <div class=" space-y-5">
        <h1 class=" text-xl font-bold">Address Book</h1>
            <section class=" text-sm md:text-lg flex flex-1 items-center overflow-x-scroll scroll sm:overflow-x-hidden py-1">
                <!-- <button on:click={()=>activeBook(1,"organization")} class="{1 === active ? " border-b-2 border-primary-500 text-primary-500 transition duration-300 " :"border-white"} border-b-2 shrink-0 font-semibold px-4 py-1">Organization & Mailing</button> -->
                <button on:click={()=>activeBook(2,"shipping")} class="{2 === active ? " border-b-2 border-primary-500 text-primary-500 transition duration-300 " :"border-white"} border-b-2 shrink-0 font-semibold px-4 py-1">Shipping</button>
                <button on:click={()=>activeBook(3,"billing")} class="{3 === active ? " border-b-2 border-primary-500 text-primary-500 transition duration-300 " :"border-white"} border-b-2 shrink-0 font-semibold px-4 py-1">Billing</button>
            </section>
            <div class=" w-full flex flex-col gap-3">
                <div class=" w-full h-20 border-1 font-medium capitalize rounded-md border-gray-300 p-4 md:p-5 text-xs md:text-sm leading-5">
                    
                    <div class="text-gray-700 font-semibold">
                        Address:
                    </div>
                    {activeAddress?.location || ""}
                    {activeAddress?.state || ""}
                    {activeAddress?.city || ""} 
                    {activeAddress?.street || ""}
                    {activeAddress?.building || ""}
                    {activeAddress?.postalCode || ""}
                </div>
                <button on:click={()=>toggleEdit = true} class=" w-20 rounded-md py-2 self-end font-medium text-xs md:text-sm text-white bg-primary-400 hover:bg-primary-500">Edit</button>
            </div>
        </div>
        {/if}   
    </div>