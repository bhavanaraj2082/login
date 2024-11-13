<script>
	import { Delivery } from '$lib/stores/solution_stores.js';
	// import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	export let tog;
	export let tog1;
	export let tog2;
	export let tog3;
	export let tog4;
	export let tog5;

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
	let errorMessage = '';

	onMount(() => {
		const storedDetails = JSON.parse(localStorage.getItem('Delivery'));
		if (storedDetails) {
			Object.assign($Delivery, storedDetails);
		}
	});
	$: iscomplete =
		$Delivery.Address1 &&
		$Delivery.Address2 &&
		$Delivery.City &&
		$Delivery.Country &&
		$Delivery.County &&
		$Delivery.Post;
	const sub = () => {
		if (!iscomplete) {
			errorMessage = 'Please fill all the details';
			console.log(errorMessage);
		} else {
			errorMessage = '';
			tog5();
		}
	};
</script>

<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 1: Select custom solution type</h1>
	<button type="button" class="font-semibold text-primary-500" on:click={tog()}>Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 2: Select custom format</h1>
	<button type="button" class="font-semibold text-primary-500" on:click={tog1()}>Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 3: Configure custom solution</h1>
	<button type="button" class="font-semibold text-primary-500" on:click={tog2()}>Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 4: Additional notes</h1>
	<button type="button" class="font-semibold text-primary-500" on:click={tog3()}>Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 5: Customer details</h1>
	<button type="button" class="font-semibold text-primary-500" on:click={tog4()}>Edit</button>
</div>
<hr />
<div class="ml-10">
	<div>
		<h1 class="font-bold text-2xl my-10">Step 6: Delivery information</h1>
		<hr />
		<h1 class="font-semibold my-5">Address</h1>
		<div class="">
			<label for="" class="text-sm">Address line 1 *</label>
			<br />
			<input
				type="text"
				name="Address"
				bind:value={$Delivery.Address1}
				id=""
				class="block w-2/5 lg:w-1/2 p-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
			/>
		</div>
		<div class="mt-2 mb-2">
			<label for="" class="text-sm">Address line 2 *</label>
			<br />
			<input
				type="text"
				name="Address2"
				bind:value={$Delivery.Address2}
				id=""
				class="block w-2/5 lg:w-1/2 p-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
			/>
		</div>
		<div class="mt-2 mb-2">
			<label for="" class="text-sm">Country *</label>
			<br />
			<select
				class="block w-2/5 lg:w-1/2 p-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
				name="Country"
				id="country"
				bind:value={$Delivery.Country}
			>
				<option value="" disabled selected>Select your country</option>
				{#each countries as country}
					<option value={`${country.name},${country.code}`}>{country.name} ({country.code})</option>
				{/each}
			</select>
		</div>
		<div class="mt-2 mb-2">
			<label for="" class="text-sm">County</label><br />
			<input
				type="text"
				class="block w-2/5 lg:w-1/2 p-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
				name="County"
				id=""
				bind:value={$Delivery.County}
			/>
		</div>
		<div class="mt-2 mb-2">
			<label for="" class="text-sm">City *</label>
			<br />
			<input
				type="text"
				name="City"
				id=""
				class="block w-2/5 lg:w-1/2 p-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
				bind:value={$Delivery.City}
			/>
		</div>
		<div class="mt-2 mb-2">
			<label for="text1" class="text-sm">Post code *</label>
			<br />
			<input
				type="text"
				name="postcode"
				id="text1"
				class="block w-2/5 lg:w-1/2 p-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
				bind:value={$Delivery.Post}
			/>
		</div>
	</div>
	<div class="flex space-x-4 mt-5">
		<button
			type="button"
			on:click={sub}
			class="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-500 focus:outline-none dark:focus:ring-primary-500 px-20 my-5"
			>Save & View Summary</button
		>
		{#if errorMessage}
			<div class="text-red-500 ml-5 mt-7">{errorMessage}</div>
			<!-- Display the error message -->
		{/if}
	</div>
</div>
<hr />
