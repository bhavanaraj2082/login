<script>
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { onMount, onDestroy } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';
  const dispatch = createEventDispatcher();
	export let formdata;
	export let actionName;
  export let isShowbox ;
  export let billing
  export let shipping ;
  let message="At least one address must be default";
  // export let accounttype;
	export let handlePopupAddress;
  let showErrors = false;
	let email='';
	let phone='';
	let postalCode='';
  // let gst='';
	let city='';
	let state='';
	let street='';
	let building='';
	let location='';
	let attentionTo='';
	let organizationName='';
	let department='';
	let errors = {};
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleAddress = (type,checked)=>{
    if(checked === true){
      if(type === "billing"){
        email= billing?.email || email ,
        phone= billing?.phone || phone ,
        postalCode= billing?.postalCode || postalCode ,
        city= billing?.city || city ,
        state= billing?.state || state ,
        organizationName= billing?.organizationName || organizationName ,
        attentionTo= billing?.attentionTo || attentionTo ,
        street= billing?.street || street ,
        location= capitalize(billing?.location) || location ,
        building= billing?.building || building ,
        department= billing?.department || department
      }
      else if(type === "shipping"){
        email= shipping?.email || email ,
        phone= shipping?.phone || phone ,
        postalCode= shipping?.postalCode || postalCode ,
        city= shipping?.city || city ,
        state= shipping?.state || state ,
        organizationName= shipping?.organizationName || organizationName ,
        attentionTo= shipping?.attentionTo || attentionTo ,
        street= shipping?.street || street ,
        location= capitalize(shipping?.location) || location ,
        building= shipping?.building || building ,
        department= shipping?.department || department
      }else{
        email= formdata?.email || email ,
        phone= formdata?.phone || phone ,
        postalCode= formdata?.postalCode || postalCode ,
        city= formdata?.city || city ,
        state= formdata?.state || state ,
        organizationName= formdata?.organizationName || organizationName ,
        attentionTo= formdata?.attentionTo || attentionTo ,
        street= formdata?.street || street ,
        location= formdata?.country ?capitalize(formdata?.country) : location  ,
        building= formdata?.building || building ,
        department= formdata?.department || department
      }
    }else{
      email= formdata?.email || email ,
        phone= formdata?.phone || phone ,
        postalCode= formdata?.postalCode || postalCode ,
        city= formdata?.city || city ,
        state= formdata?.state || state ,
        organizationName= formdata?.organizationName || organizationName ,
        attentionTo= formdata?.attentionTo || attentionTo ,
        street= formdata?.street || street ,
        location= formdata?.country ?capitalize(formdata?.country) : location ,
        building= formdata?.building || building ,
        department= formdata?.department || department
    }
  }
  handleAddress()
   // gst=formdata?.gst || gst,
  
  location= formdata?.location || location ;
	let name;
	let errorMessage = '';
	actionName == 'billingaddress' ? (name = 'Billing') : (name = 'Shipping');
	const handleCheckbox = (checked, Default) => {
		if (Default === true) {
			if (checked !== Default) {
				errorMessage = 'One address has to be Default';
			}
			if (checked === Default) {
				errorMessage = '';
			}
			console.log(errorMessage);
		} else {
			formdata.isDefault = true;
		}
	};

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
  "India": /^[6-9]\d{9}$/,
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
function selectCountry(selectedCountry) {
        location = selectedCountry.name; // Set the selected location name
        filteredCountries = countries; // Reset the filtered list
        showDropdown = false; // Hide dropdown after selection
        validateForm('location');
		    validatePhoneNumber(location, phone); 
		    validatePostalCode(location, postalCode); 
        delete errors.location; // Clear any existing errors
}

	function toggleDropdown() {
		showDropdown = !showDropdown; // Toggle the dropdown visibility
	}


	function filterCountries(event) {
		const searchTerm = event.target.value.toLowerCase();
		filteredCountries = countries.filter(country => 
			country.name.toLowerCase().includes(searchTerm) || 
			country.code.toLowerCase().includes(searchTerm)
		);
		location = searchTerm; // Update the bound value with the search term
	}

function validatePhoneNumber(countryCode, phone) {
    if (!countryCode) {
        delete errors.phone;  
        return true;  
    }

    if (!phone || phone.trim() === '') {
        errors.phone = ``;
        delete errors.phone
        return false;
    }

    const location = getCountryByCode(countryCode);
    if (!location) {
        errors.phone = 'Invalid country selected';
        errors.location = 'Invalid country selected';
        return false;
    }

    const phonePattern = getPhonePattern(countryCode);
    if (!phonePattern) {
        errors.phone = 'Phone number pattern for country not found';
        return false;
    } 

    const phoneRegex = new RegExp(phonePattern);
    if (!phoneRegex.test(phone)) {
        errors.phone = `Please enter a valid phone number for ${location}.`;
        return false;
    } else {
        delete errors.phone;  
        return true;
    }
}

	function getCountryByCode(name) {
    const location = countries.find(c => c.name === name);
  
    return location ? location.name : null; 
}

    function getPhonePattern(countryCode) {
        const countryName = getCountryByCode(countryCode);
        if (!countryName) return '^[0-9]+$'; 
        const regex = phoneNumberPatterns[countryName];
        return regex || '^[0-9]+$'; 
    }

	let isValid = true;
  	
 function validateForm(fieldName) {

  if (!fieldName || fieldName === 'street') {
    if (!street || !/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(street)) {
      errors.street = 'Address is required and can contain only letters, numbers, and a few special characters.';
    } else {
      delete errors.street;
    }
  }

  if (!organizationName || !/^[A-Za-z ]+$/.test(organizationName)) {
      console.log('object');
      errors.organizationName = 'Company name is required and can contain only letters';
    } else {
      delete errors.organizationName;
    }

    if (!department || !/^[A-Za-z ]+$/.test(department)) {
      errors.department = 'Department name is required and can contain only letters';
    } else {
      delete errors.department;
    }

    if (!attentionTo || !/^[A-Za-z ]+$/.test(attentionTo)) {
      errors.attentionTo = 'Person name is required and can contain only letters';
    } else {
      delete errors.attentionTo;
    }

//   if (!fieldName || fieldName === 'phone') {
//     if (!country) {
//         delete errors.phone; 
//     } else {
//         if (!phone || phone.trim() === '') {
//             errors.phone = 'Required'; 
//         } else {
//             const countryDetails = getCountryByCode(country);
//             if (!countryDetails) {
//                 errors.phone = 'Invalid country selected';
//                 errors.country = 'Invalid country selected';
//             } else {
//                 const phonePattern = getPhonePattern(country);
//                 if (!phonePattern) {
//                     errors.phone = 'Phone number pattern for country not found'; 
//                 } else {
//                     const phoneRegex = new RegExp(phonePattern); 
//                     if (!phoneRegex.test(phone)) {
//                         errors.phone = `Please enter a valid phone number for ${countryDetails.name}.`; 
//                     } else {
//                         delete errors.phone;  // Valid phone number, so remove error
//                     }
//                 }
//             }
//         }
//     }
// }

if (!fieldName || fieldName === 'country') {
	if (!location || location === 'country') {
      errors.location = 'Please select a country';
    } else {
      delete errors.location;
    }
  }
  if (!fieldName || fieldName === 'state') {
    if (!state || !/^[a-zA-Z\s.'-]+$/.test(state)) {
      errors.state = 'State is required and can only contain letters and spaces.';
    } else {
      delete errors.state;
    }
  }

  if (!fieldName || fieldName === 'postalCode') {
    if (!postalCode || !/^\d{6}$|^\d{5}(-\d{4})?$|^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$|^\d{5}$|^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$|^\d{4} [A-Za-z]{2}$|^\d{4}$|^\d{5}-\d{3}$|^\d{3} \d{2}$|^\d{3}-\d{4}$|^[A-Z]{1,2}\d{1,2}[A-Z]? ?\d[A-Z]{2}$/.test(postalCode)) {
      errors.postalCode = 'Please enter a valid postal code';
    } else {
      delete errors.postalCode;
    }
  }

if (Object.keys(errors).length > 0) {
   console.log(errors);
    return false; 
  }

  return true; 

}

	function validatePostalCode(countryCode, postalCode) {
    const selectedCountry = countries.find(country => country.name === countryCode);
    // console.log('Selected Country:', selectedCountry); 
    
    if (selectedCountry && selectedCountry.postalRegex && postalCode) {
        const regex = selectedCountry.postalRegex;
        if (!regex.test(postalCode)) {
            errors.postalCode = 'Please enter a valid postal code for the selected country';
        } else {
            delete errors.postalCode;
        }
    }
}

function handleSubmit(event) {
  if (!validateForm()) {
    showErrors = true;
    event.preventDefault();
  }
}
$: show= isShowbox ? `Edit ${name} Address` : `Add ${name} Address`;

$:console.log(location,"location");

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class=" w-full h-screen fixed top-0 left-0 z-50 modal-wrapper" on:click={handlePopupAddress}>
	<div class=" absolute w-full inset-0 backdrop-blur-sm bg-gray-500 bg-opacity-50 h-screen"></div>
	<div class=" relative w-full h-full">
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<form
			method="POST"
			action={`?/${actionName}`}
			on:click|stopPropagation
      use:enhance={({cancel}) => {
        if (!validateForm()) {
            console.log(validateForm(),"kkk");
            cancel()
        }
        return async({ result , update}) => {
          console.log(result,"uytrewq");
          if (result.type === 'success') {
				handlePopupAddress();
				await update();
				dispatch('onSubmit', result.data);
			  }
        };
      }}			
      class=" bg-white max-w-96 sm:max-w-96 md:max-w-md lg:max-w-lg h-5/6 md:h-5/6 overflow-y-scroll scroll rounded mx-auto my-12 px-5 pb-6 sm:px-6 md:px-8 lg:px-10">
			
      <h1 class="text-center text-md sm:text-lg md:text-xl font-semibold pt-6 md:pt-8 bg-white sticky top-0 z-20">
        {show}
    </h1>
        <!-- <h1>{isShowbox}</h1> -->
			<input type="hidden" name="userId" value={formdata.userId} />
			<input type="hidden" name="actionType" value={actionName} />
			<input type="hidden" name="addressId" value={formdata.addressId} />
			<input type="hidden" name="addAlternate" value={formdata.addAlternate} />
      <div class=" text-sm flex items-center gap-2 py-2.5">
        {#if actionName === 'billingaddress'}
        {#if shipping}
          <input class=" focus:ring-0 outline-none text-primary-500" on:change={(e)=>handleAddress("shipping",e.target.checked)} type="checkbox"> same as shipping address
        {/if}
      {:else}
      {#if billing}
       <input class=" focus:ring-0 outline-none text-primary-500" on:change={(e)=>handleAddress("billing",e.target.checked)} type="checkbox"> same as billing address
      {/if}
      {/if}
      </div>
			<label class="w-full text-xs md:text-sm font-medium mt-1 bg-red" for="firstname">Attention To</label>
			<input
				class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text"
				name="attentionTo"
        minlength="5"
        maxlength="50"
				bind:value={attentionTo}/>
        <p class="{!errors?.attentionTo ? "hidden" : ""} text-red-500 text-xs">{errors?.attentionTo}</p>
			<label class="w-full text-xs md:text-sm font-medium mt-1" for="lastname">Company Name</label>
			<input
				class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text"
				name="organizationName"
        minlength="10"
        maxlength="50"
				bind:value={organizationName}/>
        <p class="{!errors?.organizationName ? "hidden" : ""} text-red-500 text-xs">{errors?.organizationName}</p>
				<!-- <label class="w-full text-xs md:text-sm font-medium mt-1 block" for="email">Email</label>
		             <input type="email" name="email" required
			         class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
			         bind:value={email}/>
                     {#if email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                        <span class="text-red-500 text-xs block">Please enter a valid email</span>
                     {/if}
                     {#if showErrors && email.length === 0}
				        <span class="text-red-500 text-xs block">Email is required</span>
		             {/if}
                     {#if errors?.email}
		              <p class="text-xs text-red-500">{errors.email}</p>
	                 {/if} -->

                     <!-- <label class="w-full text-xs md:text-sm font-medium mt-1" for="phone">Phone</label>
						<input
						  class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
						  type="tel" name="phone" bind:value={phone}
						  title="Please enter a valid phone number"
						  on:input={() => validateForm('phone')}
						  on:input={() => validatePhoneNumber(country, phone)} 
                          on:input={delete errors.phone}/> 
						{#if errors?.phone}
				            <p class="text-red-500 text-xs mt-1">{errors.phone}</p>
			            {/if}
                        {#if showErrors && phone.length === 0}
				            <span class="text-red-500 text-xs block">Phone is required</span>
		                {/if} -->
			
        <label class="w-full text-xs md:text-sm font-medium mt-1 block" for="address">Department</label>
        <input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
          type="text" name="department" minlength="5" maxlength="40"
          bind:value={department}/>
          <p class="{!errors?.department ? "hidden" : ""} text-red-500 text-xs">{errors?.department}</p>
      <label class="w-full text-xs md:text-sm font-medium mt-1 block" for="address">Building</label>
			<input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text" name="building" minlength="10" maxlength="60"
		    bind:value={building}/>
            {#if building.length > 0 && !/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(building)}
				<span class="text-red-500 text-xs block">Please enter a valid building name</span>
			{/if}
            {#if showErrors && building.length === 0}
				<span class="text-red-500 text-xs block">Address is required</span>
		    {/if}

        <label class="w-full text-xs md:text-sm font-medium mt-1 block" for="address">Street</label>
			<input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text" name="street" minlength="10" maxlength="60"
		    bind:value={street}/>
            {#if street.length > 0 && !/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(street)}
				<span class="text-red-500 text-xs block">Please enter a valid street name</span>
			{/if}
            {#if showErrors && street.length === 0}
				<span class="text-red-500 text-xs block">Address is required</span>
		    {/if}

    
            <label class="w-full text-xs md:text-sm font-medium mt-1" for="country">Country</label>
            <div class="relative z-10">
            <div class="flex items-center border border-gray-300 rounded my-1 overflow-hidden">
            <input type="text" name="location" bind:value={location} maxlength="30" placeholder="Search Country"
            on:input={toggleDropdown} on:click={toggleDropdown} on:input={filterCountries} on:input={delete errors.country}
            class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-none"
            required/>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500 transition-transform duration-200 cursor-pointer mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    style:transform={showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}
                    on:click={toggleDropdown}>
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
                            <li on:click|stopPropagation={() => selectCountry({ name, code })} 
                            class="cursor-pointer px-2 py-1 hover:bg-gray-200">
                                <option value={name}>{name} ({code})</option>
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
            
            <label class="w-full text-xs md:text-sm font-medium mt-1" for="city">City</label>
			<input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text" name="city" minlength="3" maxlength="30"
			bind:value={city}/>
			{#if city.length > 0 && !/^[a-zA-Z\s.'-]+$/.test(city)}
				<span class="text-red-500 text-xs block">Please enter a valid city Name</span>
			{/if}
            {#if showErrors && city.length === 0}
				<span class="text-red-500 text-xs block">City is required</span>
		    {/if}


		    <label class="w-full text-xs md:text-sm font-medium mt-1" for="state">State</label>
            {#if location === 'India' || location === 'india' }
            <select class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
            name="state" bind:value={state}>
                <option value="" disabled selected>Select a State</option>
                {#each states as s}
                    <option value={s}>{s}</option>
                {/each}
            </select>
            {#if state.length > 0 && !/^[a-zA-Z\s.'-]+$/.test(state)}
				<span class="text-red-500 text-xs block">Please enter a valid state Name</span>
			{/if}
            {#if showErrors && state.length === 0}
			    <span class="text-red-500 text-xs block">State is required</span>
		    {/if}
            {:else}

            <input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text" name="state" maxlength="20" minlength="3"
			bind:value={state}/>
	        {#if state.length > 0 && !/^[a-zA-Z\s.'-]+$/.test(state)}
				<span class="text-red-500 text-xs block">Please enter a valid state Name</span>
			{/if}
            {#if showErrors && state.length === 0}
				<span class="text-red-500 text-xs block">State is required</span>
		    {/if}
            {/if}


			<label class="w-full text-xs md:text-sm font-medium mt-1" for="postalCode">Postal code</label>
			<input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
			type="text" name="postalCode" bind:value={postalCode} minlength="3" maxlength="12"
			on:input={() => {
				validateForm('postalCode'); 
				validatePostalCode(location, postalCode);  // Validate postal code as user types
			}}
            on:input={delete errors.postalCode}/>
			{#if errors?.postalCode}
			    <p class="text-red-500 text-xs mt-1">{errors.postalCode}</p>
		    {/if}

			    <!--<div class=" flex items-center mt-4 mb-2">
				 <input type="checkbox" name="isDefault" class="focus:ring-0 text-primary-400" 
                   on:change={(e) => {
                       if (!e.target.checked) {
                           e.preventDefault(); 
                           e.target.checked = true; 
                           e.target.style.cursor = 'not-allowed'; 
                           e.target.style.borderColor = 'red';
                           toast.error(message);
                       } else {
                            handleCheckbox(true, formdata.isDefault); 
                       }
                    }}
                    checked={formdata.isDefault} value={formdata.isDefault}/>
				<label class="w-full text-xs md:text-sm font-medium ml-2" for="isDefault">Set this address as default</label>
			    </div> -->
                <div class="my-2 flex flex-row gap-2">
                <button on:click={handlePopupAddress} type="button"
                class="px-4 py-2 bg-gray-200 text-description rounded hover:bg-gray-300 focus:outline-none focus:ring-0 w-1/2">
                    Cancel
                </button>
                <button type="submit" 
                  class="font-roboto font-medium py-2 px-2 w-1/2 text-xs sm:text-sm rounded bg-primary-600 hover:bg-primary-800 text-white"  
                  >
                     Submit
                </button>
            </div>
		</form>
	</div>
</div>
<Toaster position="bottom-right" richColors/>
