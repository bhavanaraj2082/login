<script>
	import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher()
    export let recordId
    export let contact
    export let isEmailVerified
    let {
        email,
        firstName,
        lastName,
        country,
        cellPhone,
        alternatePhone,
        gstNumber,
        needsPasswordSetup,
        companyName,
        tanNumber,
        jobtitle,
        companytype
    } = contact
    let toggleEdit = false;
    let errors
    $:console.log(errors);


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

const phoneNumberPatterns = {
  "Afghanistan": /^[7-9]\d{8}$/,
  "Algeria": /^[5-9]\d{8}$/,
  "Andorra": /^\+376[0-9]{6}$/,
  "Angola": /^(\+244|0)9\d{8}$/,
  "Antigua and Barbuda": /^\+1[2689]\d{7}$/,
  "Armenia": /^(\+374|0)(10|20|30|40|50|60|70|80)\d{6}$/,
  "Austria": /^\+43\d{1,12}$/,
  "Azerbaijan": /^(\+994|0)5[0-9]\d{7}$/,
  "Bahamas": /^\+1[242]\d{7}$/,
  "Bangladesh": /^(\+8801|01)\d{9}$/,
  "Belarus": /^(\+375|0)29\d{7}$/,
  "Belgium": /^(\+32|0)4\d{8}$/,
  "Belize": /^(\+501|0)\d{7}$/,
  "Benin": /^(\+229|0)\d{8}$/,
  "Bolivia": /^(\+591|0)\d{8}$/,
  "Bosnia and Herzegovina": /^(\+387|0)\d{8}$/,
  "Burkina Faso": /^(\+226|0)\d{8}$/,
  "Burundi": /^(\+257|0)\d{8}$/,
  "Cabo Verde": /^(\+238|0)\d{7}$/,
  "Cambodia": /^(\+855|0)\d{8,9}$/,
  "Cameroon": /^(\+237|0)\d{8}$/,
  "Central African Republic": /^(\+236|0)\d{8}$/,
  "Chad": /^(\+235|0)\d{8}$/,
  "Comoros": /^(\+269|0)\d{7}$/,
  "Congo, Republic of the": /^(\+242|0)\d{7}$/,
  "Congo, Democratic Republic of the": /^(\+243|0)\d{9}$/,
  "Costa Rica": /^(\+506|0)\d{8}$/,
  "Croatia": /^(\+385|0)9\d{8}$/,
  "Cyprus": /^(\+357|0)\d{8}$/,
  "Czech Republic": /^(\+420|0)\d{9}$/,
  "Djibouti": /^(\+253|0)\d{7}$/,
  "Dominica": /^(\+1[7678]|0)\d{7}$/,
  "Dominican Republic": /^(\+1[809]|0)\d{7}$/,
  "Ecuador": /^(\+593|0)\d{9}$/,
  "El Salvador": /^(\+503|0)\d{8}$/,
  "Equatorial Guinea": /^(\+240|0)\d{8}$/,
  "Eritrea": /^(\+291|0)\d{7}$/,
  "Estonia": /^(\+372|0)\d{7}$/,
  "Eswatini": /^(\+268|0)\d{8}$/,
  "Finland": /^(\+358|0)\d{9}$/,
  "France": /^(\+33|0)\d{9}$/,
  "Gabon": /^(\+241|0)\d{7}$/,
  "Gambia": /^(\+220|0)\d{7}$/,
  "Georgia": /^(\+995|0)\d{9}$/,
  "Germany": /^(\+49|0)\d{10}$/,
  "Greece": /^(\+30|0)\d{10}$/,
  "Grenada": /^(\+1[473]|0)\d{7}$/,
  "Guatemala": /^(\+502|0)\d{8}$/,
  "Guinea": /^(\+224|0)\d{9}$/,
  "Guinea-Bissau": /^(\+245|0)\d{7}$/,
  "Guyana": /^(\+592|0)\d{7}$/,
  "Honduras": /^(\+504|0)\d{8}$/,
  "Iran": /^(\+98|0)\d{10}$/,
  "Iraq": /^(\+964|0)\d{9}$/,
  "Ireland": /^(\+353|0)\d{9}$/,
  "Italy": /^(\+39|0)\d{10}$/,
  "Jamaica": /^(\+1[876]|0)\d{7}$/,
  "Kenya": /^(\+254|0)\d{9}$/,
  "Kiribati": /^(\+686|0)\d{4}$/,
  "Laos": /^(\+856|0)\d{8}$/,
  "Latvia": /^(\+371|0)\d{8}$/,
  "Lebanon": /^(\+961|0)\d{8}$/,
  "Lesotho": /^(\+266|0)\d{8}$/,
  "Liechtenstein": /^(\+423|0)\d{7}$/,
  "Lithuania": /^(\+370|0)\d{8}$/,
  "Luxembourg": /^(\+352|0)\d{6}$/,
  "Malawi": /^(\+265|0)\d{9}$/,
  "Maldives": /^(\+960|0)\d{7}$/,
  "Mali": /^(\+223|0)\d{8}$/,
  "Malta": /^(\+356|0)\d{8}$/,
  "Marshall Islands": /^(\+692|0)\d{7}$/,
  "Mauritania": /^(\+222|0)\d{8}$/,
  "Micronesia": /^(\+691|0)\d{7}$/,
  "Monaco": /^(\+377|0)\d{8}$/,
  "Mongolia": /^(\+976|0)\d{8}$/,
  "Montenegro": /^(\+382|0)\d{8}$/,
  "Mozambique": /^(\+258|0)\d{9}$/,
  "Myanmar": /^(\+95|0)\d{9}$/,
  "Nauru": /^(\+674|0)\d{4}$/,
  "Netherlands": /^(\+31|0)\d{9}$/,
  "New Zealand": /^(\+64|0)\d{9}$/,
  "Niger": /^(\+227|0)\d{8}$/,
  "Nigeria": /^(\+234|0)\d{10}$/,
  "North Macedonia": /^(\+389|0)\d{9}$/,
  "Oman": /^(\+968|0)\d{8}$/,
  "Palau": /^(\+680|0)\d{7}$/,
  "Palestine": /^(\+970|0)\d{9}$/,
  "Panama": /^(\+507|0)\d{7}$/,
  "Papua New Guinea": /^(\+675|0)\d{7}$/,
  "Paraguay": /^(\+595|0)\d{9}$/,
  "Poland": /^(\+48|0)\d{9}$/,
  "Portugal": /^(\+351|0)\d{9}$/,
  "Romania": /^(\+40|0)\d{9}$/,
  "Saint Kitts and Nevis": /^(\+1[869]|0)\d{7}$/,
  "Saint Lucia": /^(\+1[758]|0)\d{7}$/,
  "Saint Vincent and the Grenadines": /^(\+1[784]|0)\d{7}$/,
  "Samoa": /^(\+685|0)\d{5}$/,
  "San Marino": /^(\+378|0)\d{7}$/,
  "Sao Tome and Principe": /^(\+239|0)\d{7}$/,
  "Saudi Arabia": /^(\+966|0)\d{9}$/,
  "Senegal": /^(\+221|0)\d{9}$/,
  "Seychelles": /^(\+248|0)\d{7}$/,
  "Sierra Leone": /^(\+232|0)\d{8}$/,
  "Slovakia": /^(\+421|0)\d{9}$/,
  "Slovenia": /^(\+386|0)\d{8}$/,
  "Solomon Islands": /^(\+677|0)\d{5}$/,
  "Somalia": /^(\+252|0)\d{8}$/,
  "South Africa": /^(\+27|0)\d{9}$/,
  "South Korea": /^(\+82|0)\d{9}$/,
  "Spain": /^(\+34|0)\d{9}$/,
  "Sri Lanka": /^(\+94|0)\d{9}$/,
  "Syria": /^(\+963|0)\d{9}$/,
  "Togo": /^(\+228|0)\d{8}$/,
  "Trinidad and Tobago": /^(\+1[868]|0)\d{7}$/,
  "Tuvalu": /^(\+688|0)\d{4}$/,
  "Uganda": /^(\+256|0)\d{9}$/,
  "Ukraine": /^(\+380|0)\d{9}$/,
  "United Arab Emirates": /^(\+971|0)\d{9}$/,
  "United Kingdom": /^(\+44|0)\d{10}$/,
  "United States": /^(\+1|0)\d{10}$/,
  "Uruguay": /^(\+598|0)\d{8}$/,
  "Uzbekistan": /^(\+998|0)\d{9}$/,
  "Vanuatu": /^(\+678|0)\d{5}$/,
  "Vatican City": /^(\+379|0)\d{7}$/,
  "Venezuela": /^(\+58|0)\d{10}$/,
  "Yemen": /^(\+967|0)\d{9}$/,
  "Zimbabwe": /^(\+263|0)\d{9}$/,

  "Albania": /^\d{9}$/,
  "USA": /^[2-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
  "UK": /^\d{4}[\s-]?\d{6}$/,
  "Eurozone": /^\d{8,15}$/,
  "Japan": /^\d{10,11}$/,
  "Canada": /^[2-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
  "Australia": /^[4-5]\d{8}$/,
  "Switzerland": /^\d{9}$/,
  "China": /^[1-9]\d{10}$/,
  "Sweden": /^\d{6,13}$/,
  "NewZealand": /^[2-9]\d{7,9}$/,
  "Singapore": /^[8-9]\d{7}$/,
  "HongKong": /^[5-9]\d{7}$/,
  "Norway": /^\d{8}$/,
  "Mexico": /^\d{10}$/,
  "India": /^\d{10}$/,
  "Brazil": /^\d{10,11}$/,
  "Russia": /^[1-9]\d{9}$/,
  "SouthAfrica": /^\d{10}$/,
  "Israel": /^[5-7]\d{8}$/,
  "Thailand": /^[6-9]\d{8}$/,
  "Malaysia": /^[1-9]\d{7,9}$/,
  "Philippines": /^[8-9]\d{9}$/,
  "UAE": /^[5-9]\d{8}$/,
  "Colombia": /^\d{10}$/,
  "Pakistan": /^[3-9]\d{9}$/,
  "CzechRepublic": /^\d{9}$/,
  "Argentina": /^\d{10,11}$/,
  "Denmark": /^\d{8}$/,
  "Hungary": /^\d{9}$/,
  "Turkey": /^[5-9]\d{9}$/,
  "Chile": /^\d{9}$/,
  "SaudiArabia": /^[5-9]\d{8}$/,
  "Taiwan": /^[9]\d{8}$/,
  "Indonesia": /^[8-9]\d{9,10}$/,
  "Vietnam": /^[3-9]\d{8,9}$/,
  "Egypt": /^[1-9]\d{9}$/,
  "Bahrain": /^\d{8}$/,
  "Qatar": /^\d{8}$/,
  "Kuwait": /^\d{8}$/,
  "Morocco": /^[5-9]\d{8}$/,
  "Jordan": /^\d{8,9}$/,
  "Kazakhstan": /^\d{10}$/,
  "Serbia": /^\d{9}$/,
  "Peru": /^\d{9}$/,
  "Tunisia": /^\d{8}$/,
  "WestAfrica": /^\d{8}$/,
  "CentralAfrica": /^\d{8}$/,
  "Zambia": /^\d{9}$/,
  "Nepal": /^[9]\d{9}$/,
  "SriLanka": /^[7]\d{8}$/,
  "Turkmenistan": /^\d{8}$/,
  "Moldova": /^\d{8}$/,
  "Ethiopia": /^\d{9}$/,
  "Tanzania": /^\d{9}$/,
  "Ghana": /^[2-9]\d{8}$/,
  "Nicaragua": /^\d{8}$/,
  "Bulgaria": /^\d{8,10}$/,
  "BosniaHerzegovina": /^\d{8,9}$/,
  "Namibia": /^\d{9}$/,
  "CaymanIslands": /^\d{7}$/,
  "Fiji": /^\d{7}$/,
  "Macau": /^\d{8}$/,
  "Mauritius": /^\d{8}$/,
  "Tajikistan": /^\d{9}$/,
  "Aruba": /^\d{7}$/,
  "Suriname": /^\d{7}$/,
  "Iceland": /^\d{7}$/,
  "SierraLeone": /^\d{8}$/,
  "Madagascar": /^\d{8,9}$/,
  "EastCaribbean": /^\d{7}$/,
  "Barbados": /^\d{7}$/,
  "CFPFranc": /^\d{6,9}$/,
  "PapuaNewGuinea": /^\d{8}$/,
  "ElSalvador": /^\d{8}$/,
  "Gibraltar": /^\d{8}$/,
  "Liberia": /^\d{7}$/,
  "Rwanda": /^\d{9}$/,
  "Botswana": /^\d{7,8}$/,
  "Kyrgyzstan": /^\d{9}$/,
  "Brunei": /^\d{7}$/,
  "Sudan": /^\d{9}$/,
  "Libya": /^\d{8,9}$/,
  "Cuba": /^\d{8}$/,
  "Bhutan": /^\d{8}$/,
  "DominicanRepublic": /^\d{10}$/,
  "Haiti": /^\d{8}$/,
  "Tonga": /^\d{7}$/
};

    let filteredCountries = countries;
let showDropdown = false;
let autoSelectedOnce = false; 

function selectCountry(selectedCountry) {
    country = selectedCountry.name;
    filteredCountries = countries; 
    showDropdown = false; 
    validateForm('country');
    validatealterphoneNumber(country, alterphone); 
    validatePhoneNumber(country, phone); 
    validateZipCode(country, postalcode); 
    delete errors.country; 
    autoSelectedOnce = false; 
}

    function toggleDropdown() {
    showDropdown = !showDropdown; 
}

let previousSearchTerm = '';

function filterCountries(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const isDialCode = /^\d+$/.test(searchTerm);
    showDropdown = true;

    // Disable auto-selection when shortening input
    const isTypingForward = searchTerm.length > previousSearchTerm.length;
    previousSearchTerm = searchTerm;

    autoSelectedOnce = searchTerm.length < 3 ? false : autoSelectedOnce;

    if (isDialCode) {
        filteredCountries = countries.filter(country =>
            country.code.replace('+', '') === searchTerm
        );
        if (filteredCountries.length === 0) {
            filteredCountries = countries.filter(country =>
                country.code.replace('+', '').endsWith(searchTerm) &&
                country.code.replace('+', '').length === searchTerm.length + 1
            );
        }
    } else {
        filteredCountries = countries.filter(country =>
            country.name.toLowerCase().startsWith(searchTerm) ||
            country.code.toLowerCase().includes(searchTerm)
        );
    }

    // Only auto-select if typing forward and not previously auto-selected
    if (filteredCountries.length === 1 && searchTerm.length >= 2 && !autoSelectedOnce && isTypingForward) {
        const autoSelectedCountry = filteredCountries[0];
        setTimeout(() => {
            country = autoSelectedCountry.name;
            selectCountry(autoSelectedCountry);
            autoSelectedOnce = true;
        }, 200);
    } else {
        country = searchTerm;
    }
}



function handleKeyDown(event) {
    if (event.key === "Enter" && country.length >= 3 && filteredCountries.length > 0) {
        selectCountry(filteredCountries[0]);
        event.preventDefault();
    }
}

const validateField = (name, value) => {
    let message = "";
    const pattern = phoneNumberPatterns[country] || /^\d{10}$/;
    switch(name) {
        case "firstName":
            if (!value) {
                message = "First name is required";
            } else if (value.length < 3) {
                message = "First name must be at least 3 characters";
            } else if (value.length > 10) {
                message = "First name must not exceed 10 characters";
            } else if (!/^[A-Za-z\s]+$/.test(value)) {
                message = "First name must contain only letters";
            }
            break;

        case "lastName":
            if (value) {
                if (value.length < 3) {
                    message = "Last name must be at least 3 characters";
                } else if (value.length > 10) {
                    message = "Last name must not exceed 10 characters";
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    message = "Last name must contain only letters";
                }
            }
            break;

            case "country":
            if (!value) {
                message = "Country is required";  // Country must be selected
            } else if (!countries.some(c => c.name.toLowerCase() === value.toLowerCase())) {
                message = "Please select a country from the list";  // Check if country is in the list
            }
            break;

            case "cellPhone":
            if (!value) message = "Primary phone is required";
            else if (pattern && !pattern.test(value)) message = `Primary phone is invalid for ${country}`;
            break;

        case "alternatePhone":
            if (value && pattern && !pattern.test(value)) {
                message = `Alternate phone is invalid for ${country}`;
            }
            break;

            case "companyName":
    if (value) {
        if (value.length < 3) message = "Company name must be at least 3 characters";
        else if (value.length > 35) message = "Company name must not exceed 35 characters";
        else if (!/^[\w\s.,&()-]+$/.test(value)) message = "Company name contains invalid characters";
    }
    break;

case "companytype":
    if (value) {
        if (value.length < 3) message = "Company type must be at least 3 characters";
        else if (value.length > 25) message = "Company type must not exceed 25 characters";
        else if (!/^[A-Za-z\s]+$/.test(value)) message = "Company type should contain only letters";
    }
    break;

case "jobtitle":
    if (value) {
        if (value.length < 3) message = "Job title must be at least 3 characters";
        else if (value.length > 30) message = "Job title must not exceed 30 characters";
        else if (!/^[A-Za-z\s]+$/.test(value)) message = "Job title should contain only letters";
    }
    break;


        case "gstNumber":
            if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/.test(value)) message = "Invalid GST number format (e.g, 12ABCDE1234F4Z5)";
            break;

       

        case "tanNumber":
            if (value && !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(value)) message = "Invalid TAN format (e.g., ABCD12345E)";
            break;
    }

    errors = { ...errors, [name]: message };
}

function checkcount() {
    if (!country) {
        errors.alternatePhone = "Select country before entering number"; 

}
}

function checkcountry() {
    if (!country) {
        errors.cellPhone = "Select country before entering number"; 

}
}

function otherstr() {
  const found = countries.find(
    c => c.name.toLowerCase().trim() === country.toLowerCase().trim()
  );
  if (!found && country.length!==0) {
    errors.country = "Please select a valid country from the dropdown";
    return false;
  } else {
    delete errors.country;
    return true;
  }
}
const validateForm = () => {
    errors = {};
    validateField("firstName", firstName);
    validateField("lastName", lastName);
    validateField("cellPhone", cellPhone);
    validateField("alternatePhone", alternatePhone);
    validateField("companyName", companyName);
    validateField("companytype", companytype);
    validateField("gstNumber", gstNumber);
    validateField("jobtitle", jobtitle);
    validateField("tanNumber", tanNumber);
    validateField("country", country);

    return Object.values(errors).every(error => !error);
}





const handleSubmit =({cancel})=>{
    // const isCountryValid = otherstr();
    

        if(!validateForm()){
            cancel()
        }
    return async({result,update})=>{
        console.log('form result==>',result)
        if(result.type === "success"){
            toggleEdit = false
            dispatch("onSuccess",result.data)
            await update()
        }
    }
}

</script>
<div class="shadow max-w-7xl rounded p-5 bg-white">
    {#if toggleEdit}
    <div class="">
        <h1 class=" text-xl font-bold"> Edit Contact Information <span class=" text-xs font-normal"> <span class=" text-sm font-bold text-red-500">*</span>Represent required fields</span></h1>
        <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-3 px-2"
        method="POST" action="?/editContact" use:enhance={handleSubmit}>
            <input type="hidden" name="recordId" value={recordId}>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="firstName">
                        <span class=" text-sm font-bold text-red-500">*</span>First Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500"
                     type="text" name="firstName" bind:value={firstName} on:input={()=>{firstName=firstName.trimStart();validateField("firstName", firstName);}}/>
                     {#if errors?.firstName}
					<span class="text-red-600 text-xs">{errors.firstName}</span>
				     {/if}
                </div>


                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="lastName">
                        Last Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="lastName" bind:value={lastName} on:input={()=>{lastName=lastName.trimStart();validateField("lastName", lastName);}}/>
                    {#if errors?.lastName}
					<span class="text-red-600 text-xs">{errors.lastName}</span>
				     {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <!-- <label class="w-full text-xs md:text-sm font-medium mt-1" for="country">Country</label> -->
                    <label class=" text-xs md:text-sm font-medium" for="country">
                        <span class=" text-sm font-bold text-red-500">*</span>Country</label><br>
                    <div class="relative z-10">
                      <div class="flex items-center border border-gray-300 rounded my-1 overflow-hidden">
                          <input
                            type="text"
                            name="country"
                            bind:value={country}
                            placeholder="Search Country"
                      on:click={toggleDropdown}
                            on:input={toggleDropdown}
                            on:input={filterCountries}
                      on:input={otherstr}
                      on:input={delete errors.country}
                      on:keydown={handleKeyDown}
                      on:input={() => {
                        country = country.trimStart(); 
                        validateField("country", country);
                      }}
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
                  
                        {#if errors?.country}
                          <p class="text-red-500 text-xs mt-1">{errors.country}</p>
                        {/if}
                </div>
            <div class=" w-full">
                <label class=" text-xs md:text-sm font-medium" for="cellPhone"><span class=" text-sm font-bold text-red-500">*</span>Primary Phone</label><br>
                <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                type="text" name="cellPhone" bind:value={cellPhone} on:input={()=>{cellPhone=cellPhone.trimStart();validateField("cellPhone", cellPhone);checkcountry();}}/>
                {#if errors?.cellPhone}
				    <span class="text-red-600 text-xs">{errors.cellPhone}</span>
			    {/if}
            </div>
                       
            </div>
            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="alternatePhone"><span class=" text-sm font-bold text-red-500"></span>Alternative Phone </label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="alternatePhone" bind:value={alternatePhone} on:input={()=>{alternatePhone=alternatePhone.trimStart();validateField("alternatePhone", alternatePhone);checkcount();}}/>
                    {#if errors?.alternatePhone}
                        <span class="text-red-600 text-xs">{errors.alternatePhone}</span>
                    {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="companyName">Company Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="companyName" bind:value={companyName} on:input={()=>{companyName=companyName.trimStart();validateField("companyName", companyName);}}/>
                    {#if errors?.companyName}
                        <span class="text-red-600 text-xs">{errors.companyName}</span>
                    {/if}
                </div>
               
            </div>

            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="companytype">Company Type</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="companytype" bind:value={companytype} on:input={()=>{companytype=companytype.trimStart();validateField("companytype", companytype);}}/>
                    {#if errors?.companytype}
                        <span class="text-red-600 text-xs">{errors.companytype}</span>
                    {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="gstNumber">GST Number</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="gstNumber" bind:value={gstNumber} on:input={()=>{gstNumber=gstNumber.trimStart();validateField("gstNumber", gstNumber);}}/>
                    {#if errors?.gstNumber}
                        <span class="text-red-600 text-xs">{errors.gstNumber}</span>
                    {/if}
                </div>
              
            </div>

            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="jobtitle">Job Title</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="jobtitle" bind:value={jobtitle} on:input={()=>{jobtitle=jobtitle.trimStart();validateField("jobtitle", jobtitle);}}/>
                    {#if errors?.jobtitle}
                        <span class="text-red-600 text-xs">{errors.jobtitle}</span>
                    {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="tanNumber">TAN Number</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="tanNumber" bind:value={tanNumber} on:input={()=>{tanNumber=tanNumber.trimStart();validateField("tanNumber", tanNumber);}}/>
                    {#if errors?.tanNumber}
                        <span class="text-red-600 text-xs">{errors.tanNumber}</span>
                    {/if}
                </div>
            </div>

            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <button type="button" on:click={()=>{
                    toggleEdit = false
                    window.location.reload()
                }} class=" w-full rounded-md py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
                <button type="submit" class=" w-full rounded-md py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Submit</button>
            </div>

        </form>
     </div>
    {/if}

    {#if !toggleEdit}
    <div class="overflow-hidden">
        <h1 class=" font-bold text-4s md:text-lg mb-2">
            Manage Your Personal Information
        </h1>
        <div class="mt-4 px-2">
            <div class=" flex items-center justify-between border-b-1 mt-2 pb-2">
                <h2 class=" font-semibold text-4s">Contact Information</h2>
                <button on:click={()=>toggleEdit = true} class=" w-20 rounded-md py-1.5 font-medium text-xs md:text-sm text-white bg-primary-500 hover:bg-primary-600">Edit</button>
            </div>
            <section class=" w-full flex flex-col sm:flex-row flex-wrap gap-y-4 py-3">
                <div class="flex sm:flex-row items-center text-sm md:text-4s w-full sm:w-1/2">
                    <h4 class="font-medium">Name :</h4>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    {#if !firstName}
                    <a on:click={() => toggleEdit = true} class="text-primary-500 font-medium ml-2 text-sm hover:underline cursor-pointer">
                        Update Name
                    </a>
                    {:else}
                        <p class="ml-2 text-sm">{firstName || "Update Name"} {lastName || ""}</p>
                    {/if}
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2">
                    <label class="text-xs md:text-sm font-semibold" for="cellPhone">
                        Primary Phone :
                    </label><br>
                    {#if !cellPhone && (firstName && lastName && email || email)}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a on:click={() => toggleEdit = true} class="text-primary-500 font-medium ml-2 text-sm hover:underline cursor-pointer">
                            Update Phone Number
                        </a>
                    {:else}
                    <p class=" text-sm ml-2">{cellPhone || "N/A"}</p>
                        {#if errors?.cellPhone}
                            <span class="text-red-600 text-xs">{errors.cellPhone}</span>
                        {/if}
                    {/if}
                </div>
                <div class=" w-full flex sm:flex-row items-center sm:w-1/2">
                    <h4 class="font-medium">Alternative Phone :</h4>
                    <p class=" text-sm ml-2">{alternatePhone || "--"}</p>
                </div>
                <div class=" w-full flex sm:flex-row items-center sm:w-1/2">
                    <div class="flex items-center gap-2">
                    <h4 class="font-medium">Email:</h4>
                </div>
                <p class=" text-sm ml-2">{email || "N/A"}</p>
                <Icon icon="tdesign:verified-filled" class=" text-xl ml-2 {isEmailVerified ? "text-green-500":"text-gray-400"}"/>
                </div>
                {#if needsPasswordSetup}
                <div class="w-full flex items-center bg-primary-50 border border-primary-200 rounded-lg p-2">
                    <p class="text-xs text-primary-600">
                        We noticed you haven’t set up a password yet. To keep your account safe, please create one now. 
                        <a href="/reset-password" class="text-primary-600 text-xs font-medium hover:underline hover:text-primary-500">Click here to setup your password</a>
                    </p>
                </div>
                {:else}
                <div class=" w-full flex sm:flex-row items-center sm:w-1/2">
                    <h4 class="font-medium">Password :</h4>
                    <a href="/reset-password" class="text-xs text-primary-500 font-semibold ml-2">Reset Password</a>
                    <div class=" flex items-center gap-2 -mt-1.5">
                    </div>
                </div>
                {/if}
            </section>
            <div class="mt-4">
                <h2 class="font-semibold text-4s border-b-1 pb-2 pt-5">Business Information</h2>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class="font-normal text-sm">Company Name:</h4>
                    <p class=" text-sm ml-2 font-semibold">{companyName || "__"}</p>
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class=" font-normal text-sm">Company Type:</h4>
                    <p class=" text-sm ml-2 font-semibold">{companytype || "__"}</p>
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class=" font-normal text-sm">Job Title:</h4>
                    <p class=" text-sm ml-2 font-semibold">{jobtitle || "__"}</p>
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class=" font-normal text-sm">GST Number:</h4>
                    <p class=" text-sm ml-2 font-semibold">{gstNumber || "__"}</p>
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class=" font-normal text-sm">TAN Number:</h4>
                    <p class=" text-sm ml-2 font-semibold">{tanNumber || "__"}</p>
                </div>
            </div>
        </div>
    </div>
    {/if}
</div>