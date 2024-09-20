<script>
    export let form;
    // console.log(form.body);
    let successMessage = '';
    if (form && form.status === 200) {
        successMessage = form.body; // Get the success message
    }
   
    
    let enquiryTypes = [
        "Account enquiry",
        "Delivery/shipping enquiry",
        "Document enquiry",
        "Order enquiry",
        "Password enquiry",
        "Payment enquiry",
        "Price request",
        "Product enquiry",
        "Quotation request",
        "Stock enquiry"
    ];

    let languages = [
        "Chinese",
        "English",
        "French",
        "German",
        "Italian",
        "Polish",
        "Portuguese",
        "Russian",
        "Spanish"
    ];

    let titles = [
        "Dr",
        "Miss",
        "Mr",
        "Mrs",
        "Ms",
        "Mx",
        "Prof"
    ];

    let countryCodes = [
    { code: "+93", country: "Afghanistan" },
    { code: "+355", country: "Albania" },
    { code: "+213", country: "Algeria" },
    { code: "+1", country: "American Samoa" },
    { code: "+376", country: "Andorra" },
    { code: "+244", country: "Angola" },
    { code: "+1", country: "Anguilla" },
    { code: "+0", country: "Antarctica" },
    { code: "+1", country: "Antigua and Barbuda" },
    { code: "+54", country: "Argentina" },
    { code: "+374", country: "Armenia" },
    { code: "+297", country: "Aruba" },
    { code: "+61", country: "Australia" },
    { code: "+43", country: "Austria" },
    { code: "+994", country: "Azerbaijan" },
    { code: "+1", country: "Bahamas" },
    { code: "+973", country: "Bahrain" },
    { code: "+880", country: "Bangladesh" },
    { code: "+1", country: "Barbados" },
    { code: "+375", country: "Belarus" },
    { code: "+32", country: "Belgium" },
    { code: "+501", country: "Belize" },
    { code: "+229", country: "Benin" },
    { code: "+1", country: "Bermuda" },
    { code: "+975", country: "Bhutan" },
    { code: "+591", country: "Bolivia" },
    { code: "+387", country: "Bosnia and Herzegovina" },
    { code: "+267", country: "Botswana" },
    { code: "+55", country: "Bouvet Island (Bouvetoya)" },
    { code: "+55", country: "Brazil" },
    { code: "+246", country: "British Indian Ocean Territory" },
    { code: "+1", country: "British VI/Territory" },
    { code: "+673", country: "Brunei Darussalam" },
    { code: "+359", country: "Bulgaria" },
    { code: "+226", country: "Burkina Faso" },
    { code: "+257", country: "Burundi" },
    { code: "+855", country: "Cambodia" },
    { code: "+237", country: "Cameroon" },
    { code: "+1", country: "Canada" },
    { code: "+34", country: "Canary Islands" },
    { code: "+238", country: "Cape Verde" },
    { code: "+1", country: "Cayman Islands" },
    { code: "+236", country: "Central African Republic" },
    { code: "+235", country: "Chad" },
    { code: "+56", country: "Chile" },
    { code: "+86", country: "China Mainland" },
    { code: "+61", country: "Christmas Island" },
    { code: "+61", country: "Cocos (Keeling) Islands" },
    { code: "+57", country: "Colombia" },
    { code: "+269", country: "Comoros" },
    { code: "+242", country: "Congo, Democratic Republic of the" },
    { code: "+243", country: "Congo, Republic of the" },
    { code: "+682", country: "Cook Islands" },
    { code: "+506", country: "Costa Rica" },
    { code: "+225", country: "Cote d'Ivoire" },
    { code: "+385", country: "Croatia" },
    { code: "+599", country: "Curacao" },
    { code: "+357", country: "Cyprus" },
    { code: "+420", country: "Czech Republic" },
    { code: "+45", country: "Denmark" },
    { code: "+253", country: "Djibouti" },
    { code: "+1", country: "Dominica" },
    { code: "+1", country: "Dominican Republic" },
    { code: "+670", country: "East Timor" },
    { code: "+593", country: "Ecuador" },
    { code: "+20", country: "Egypt" },
    { code: "+503", country: "El Salvador" },
    { code: "+240", country: "Equatorial Guinea" },
    { code: "+291", country: "Eritrea" },
    { code: "+372", country: "Estonia" },
    { code: "+251", country: "Ethiopia" },
    { code: "+500", country: "Falkland Islands" },
    { code: "+298", country: "Faroe Islands" },
    { code: "+679", country: "Fiji" },
    { code: "+358", country: "Finland" },
    { code: "+33", country: "France" },
    { code: "+594", country: "French Guiana" },
    { code: "+689", country: "French Polynesia" },
    { code: "+262", country: "French Southern Territories" },
    { code: "+241", country: "Gabon" },
    { code: "+220", country: "Gambia" },
    { code: "+995", country: "Georgia" },
    { code: "+49", country: "Germany" },
    { code: "+233", country: "Ghana" },
    { code: "+350", country: "Gibraltar" },
    { code: "+30", country: "Greece" },
    { code: "+299", country: "Greenland" },
    { code: "+1", country: "Grenada" },
    { code: "+590", country: "Guadeloupe" },
    { code: "+1", country: "Guam" },
    { code: "+502", country: "Guatemala" },
    { code: "+44", country: "Guernsey" },
    { code: "+224", country: "Guinea" },
    { code: "+245", country: "Guinea-Bissau" },
    { code: "+592", country: "Guyana" },
    { code: "+509", country: "Haiti" },
    { code: "+0", country: "Heard and Mac Islands" },
    { code: "+379", country: "Holy See (Vatican City State)" },
    { code: "+504", country: "Honduras" },
    { code: "+852", country: "Hong Kong" },
    { code: "+36", country: "Hungary" },
    { code: "+354", country: "Iceland" },
    { code: "+91", country: "India" },
    { code: "+62", country: "Indonesia" },
    { code: "+353", country: "Ireland" },
    { code: "+972", country: "Israel" },
    { code: "+39", country: "Italy" },
    { code: "+1", country: "Jamaica" },
    { code: "+81", country: "Japan" },
    { code: "+44", country: "Jersey" },
    { code: "+962", country: "Jordan" },
    { code: "+7", country: "Kazakhstan" },
    { code: "+254", country: "Kenya" },
    { code: "+686", country: "Kiribati (Christmas Island)" },
    { code: "+383", country: "Kosovo" },
    { code: "+965", country: "Kuwait" },
    { code: "+996", country: "Kyrgyzstan" },
    { code: "+856", country: "Laos" },
    { code: "+371", country: "Latvia" },
    { code: "+961", country: "Lebanon" },
    { code: "+266", country: "Lesotho" },
    { code: "+231", country: "Liberia" },
    { code: "+423", country: "Liechtenstein" },
    { code: "+370", country: "Lithuania" },
    { code: "+352", country: "Luxembourg" },
    { code: "+853", country: "Macau" },
    { code: "+389", country: "Macedonia" },
    { code: "+261", country: "Madagascar" },
    { code: "+265", country: "Malawi" },
    { code: "+60", country: "Malaysia" },
    { code: "+960", country: "Maldives" },
    { code: "+223", country: "Mali" },
    { code: "+356", country: "Malta" },
    { code: "+692", country: "Marshall Islands" },
    { code: "+596", country: "Martinique" },
    { code: "+222", country: "Mauritania" },
    { code: "+230", country: "Mauritius" },
    { code: "+262", country: "Mayotte" },
    { code: "+52", country: "Mexico" }
   ]

    let locations = countryCodes.map(item => item.country);

</script>

<div class="w-full">
    <div class="bg-white mx-auto rounded-lg shadow-lg p-8 w-1/2">
        <h2 class="text-2xl font-bold mb-6">Contact Us</h2>
          
        {#if successMessage}
            <div class="mb-4 text-green-600">
                {successMessage}
            </div>
        {/if}
        <form method="POST" action="?/contactusform">
            <!-- First Line: Type of Enquiry and Preferred Language -->
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium mb-1" for="type-of-enquiry">Type of Enquiry</label>
                    <select name="enquiryType" id="type-of-enquiry" class="block w-full border border-gray-300 rounded-lg p-2" required>
                        {#each enquiryTypes as type}
                            <option>{type}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="preferred-language">Preferred Language</label>
                    <select name="preferredLanguage" id="preferred-language" class="block w-full border border-gray-300 rounded-lg p-2" required>
                        <option disabled selected value>Select Language</option>
                        {#each languages as lang}
                            <option>{lang}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <!-- Second Line: Title, First Name, Last Name -->
            <div class="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium mb-1" for="title">Title</label>
                    <select name="title" id="title" class="block w-full border border-gray-300 rounded-lg p-2" required>
                        <option disabled selected value>Select Title</option>
                        {#each titles as title}
                            <option>{title}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="firstname">First Name</label>
                    <input type="text" name="firstName" id="firstname" class="block w-full border border-gray-300 rounded-lg p-2" required>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="lastname">Last Name</label>
                    <input type="text" name="lastName" id="lastname" class="block w-full border border-gray-300 rounded-lg p-2" required>
                </div>
            </div>

            <!-- Third Line: Email ID -->
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="email">Email ID</label>
                <input type="email" name="email" id="email" class="block w-full border border-gray-300 rounded-lg p-2" required>
            </div>

            <!-- Fourth Line: Country Code and Phone Number -->
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium mb-1" for="country-code">Country Code</label>
                    <select name="countryCode" id="country-code" class="block w-full border border-gray-300 rounded-lg p-2" required>
                        <option disabled selected value>Select Country Code</option>
                        {#each countryCodes as { code, country }}
                            <option>{code} ({country})</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="phone-number">Phone Number</label>
                    <input type="number" name="phoneNumber" id="phone-number" class="block w-full border border-gray-300 rounded-lg p-2" required>
                </div>
            </div>

            <!-- Fifth Line: Invoice Number and Organization Name -->
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium mb-1" for="invoice-number">Account/Invoice number</label>
                    <input type="text" name="invoiceNumber" id="invoice-number" class="block w-full border border-gray-300 rounded-lg p-2">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="organization-name">Organization Name</label>
                    <input type="text" name="organizationName" id="organization-name" class="block w-full border border-gray-300 rounded-lg p-2" required>
                </div>
            </div>

            <!-- Sixth Line: Location and Post Code -->
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium mb-1" for="location">Location</label>
                    <select name="location" id="location" class="block w-full border border-gray-300 rounded-lg p-2" required>
                        <option disabled selected value>Select Location</option>
                        {#each locations as location}
                            <option>{location}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="postcode">Post Code</label>
                    <input type="number" name="postCode" id="postcode" class="block w-full border border-gray-300 rounded-lg p-2">
                </div>
            </div>

            <!-- Seventh Line: Comment -->
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="comments">Details of your enquiry</label>
                <textarea name="comments" id="comments" class="block w-full border border-gray-300 rounded-lg p-2 h-24"></textarea>
            </div>

            <!-- Eighth Line: Consent Checkbox -->
            <div class="mb-4 flex items-center">
                <input type="checkbox" name="consent" id="consent" class="mr-2" required>
                <label for="consent" class="text-sm">I accept the Chemikart website privacy notice</label>
            </div>

            {#if successMessage}
            <div class="mb-4 text-green-600">
                {successMessage}
            </div>
        {/if}
            <!-- Last Line: Submit Button -->
            <button type="submit" class="w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600">Submit</button>
        </form>
       
    </div>
</div>