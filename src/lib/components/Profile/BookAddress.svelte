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
        "Chhattisgarh",
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

let countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", 
  "Congo (Democratic Republic of the Congo)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", 
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", 
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
  "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", 
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", 
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", 
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", 
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
  "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", 
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", 
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
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
                errors.location = "Location is required";
            } else if (!/^[A-Za-z\s]+$/.test(activeAddress.location)) {
                errors.location = "Location must contain only letters and spaces";
            } else {
                delete errors.location;
            }
            break;

        // case 'postalCode':
        //     if (!activeAddress.postalCode) {
        //         errors.postalCode = "Postal Code is required";
        //     } else if (!/^[0-9\s]+$/.test(activeAddress.postalCode)) {
        //         errors.postalCode = "Postal Code must contain only numbers and spaces";
        //     } else {
        //         delete errors.postalCode;
        //     }
        //     break;
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
        errors.location = "Location is required";
    } else if (!/^[A-Za-z\s]+$/.test(activeAddress.location)) {
        errors.location = "Location must contain only letters and spaces";
    }

    // if (!activeAddress.postalCode) {
    //     errors.postalCode = "Postal Code is required";
    // } else if (!/^[0-9\s]+$/.test(activeAddress.postalCode)) {
    //     errors.postalCode = "Postal Code must contain only numbers and spaces";
    // }

    if (!activeAddress.postalCode) {
    errors.postalCode = "Postal Code is required";
  } else if (pattern && !pattern.test(activeAddress.postalCode)) {
    errors.postalCode = `Postal Code is invalid for ${country}`;
  }


    

    return Object.keys(errors).length === 0;
};



     
const handleSubmit = ({ cancel }) => {
    if (!validateForm()) {
        cancel(); // prevent submission if form is invalid
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
 <div class="shadow  rounded-md p-5 bg-white">
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
                    <select name="location" bind:value={activeAddress.location } on:change={() => validateField('location')}
                    class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500">
                        {#each countries as country}
                            <option value={country}>{country}</option>
                        {/each}
                    </select>
                    {#if errors?.location}
                     <span class="text-red-600 text-xs">{errors.location}</span>
                     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="state"><span class=" text-sm font-bold text-red-500">*</span>State</label><br>
                    {#if activeAddress.location === 'India'}
                          <select name="state" id="" bind:value={activeAddress.state } on:change={() => validateField('state')}
                    class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500">
                        {#each states as state}
                            <option value={state}>{state}</option>
                        {/each}
                    </select>
                    {:else}
                         <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="state" bind:value={activeAddress.state } on:input={() => {validateField('state');activeAddress.state=activeAddress.state.trim();}}/>
                    {/if}
                   
                    {#if errors?.state}
                     <span class="text-red-600 text-xs">{errors.state}</span>
                     {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
              
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="city">
                        <span class=" text-sm font-bold text-red-500">*</span>City</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="city" bind:value={activeAddress.city } on:input={() => {validateField('city');activeAddress.city=activeAddress.city.trim()}}/>
                    {#if errors?.city}
                     <span class="text-red-600 text-xs">{errors.city}</span>
                     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="street">
                        <span class=" text-sm font-bold text-red-500">*</span>Street</label><br>
                        <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                        type="text" name="street" bind:value={activeAddress.street } on:input={() => {validateField('street');activeAddress.street=activeAddress.street.trim();}}/>
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
                    type="text" name="building" bind:value={activeAddress.building } on:input={() => {validateField('building');activeAddress.building=activeAddress.building.trim()}}/>
                    {#if errors?.building}
                     <span class="text-red-600 text-xs">{errors.building}</span>
                     {/if}
                </div>
               
                <!-- <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="postalCode">
                        <span class=" text-sm font-bold text-red-500">*</span>Postal Code</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="postalCode" bind:value={activeAddress.postalCode } on:input={() => {validateField('activeAddress.postalCode ');activeAddress.postalCode=activeAddress.postalCode.trim();}}/>
                    {#if errors?.postalCode}
                     <span class="text-red-600 text-xs">{errors.postalCode}</span>
                     {/if}
                </div> -->


                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="postalCode"><span class=" text-sm font-bold text-red-500">*</span>Postal Code</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="postalCode" bind:value={activeAddress.postalCode } on:input={()=>{activeAddress.postalCode =activeAddress.postalCode .trimStart();validateField("postalCode");}}/>
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