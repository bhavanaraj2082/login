<script>
    // export let data;
    const data = {
    "_id": { "$oid": "67ac36362c5faed0aa65d948" },
    "Custom_solution_type": "Organic",
    "Custom_format": "Neat",
    "Configure_custom_solution": {
      "components": [
        { "CasNumber": 8788, "Component Name": "sodium", "Concentration": 5 },
        { "CasNumber": 456543, "Component Name": "potassium", "Concentration": 10 }
      ],
      "solvent": "No",
      "packagingType": "Ampoule",
      "volume": "10ml",
      "units": "3",
      "qualityLevel": "ISO 17034",
      "analyticalTechnique": "LC"
    },
    "Customer_details": {
      "Title": "Miss",
      "Firstname": "guyunjh",
      "Lastname": "gbbhjb",
      "organisation": "edtrfdtr",
      "country": "India",
      "invoiceNumber": "123",
      "email": "rukhiyasameen@gmail.com",
      "number": "9393044516"
    },
    "Delivery_information": {
      "Address1": "sertfy",
      "Address2": "d5tfyuhi",
      "State": "Haryana",
      "GST": "12ABCDE1234F4Z5",
      "City": "e45rgyu",
      "PostalCode": "212121"
    },
    "Additional_notes": "fyt",
    "status": "unread",
    "createdAt": { "$date": "2025-02-12T05:48:38.240Z" },
    "updatedAt": { "$date": "2025-02-12T05:48:38.240Z" },
    "__v": 0,
    "userId": "3c8r5nhb42bthm5"
  };
  </script>
  
  <div class="max-w-7xl mx-auto p-4">
    <div class="space-y-8">
      <section class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-900">Customer Details</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div>
            <p class="font-medium text-gray-600">Name:</p>
            <p>{data.Customer_details.Title} {data.Customer_details.Firstname} {data.Customer_details.Lastname}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Organisation:</p>
            <p>{data.Customer_details.organisation}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Email:</p>
            <p>{data.Customer_details.email}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Phone:</p>
            <p>{data.Customer_details.number}</p>
          </div>
        </div>
      </section>
      <section class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-900">Delivery Information</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div>
            <p class="font-medium text-gray-600">Address:</p>
            <p>{data.Delivery_information.Address1}, {data.Delivery_information.Address2}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">City:</p>
            <p>{data.Delivery_information.City}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">State:</p>
            <p>{data.Delivery_information.State}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Postal Code:</p>
            <p>{data.Delivery_information.PostalCode}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">GST:</p>
            <p>{data.Delivery_information.GST}</p>
          </div>
        </div>
      </section>
      <section class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-900">Custom Solution Details</h2>
        <div class="mt-4">
          <p class="font-medium text-gray-600">Solution Type: {data.Custom_solution_type}</p>
          <p class="font-medium text-gray-600">Format: {data.Custom_format}</p>
        </div>
        <div class="mt-4">
          <h3 class="font-semibold text-gray-700">Components:</h3>
          <ul class="list-disc pl-5">
            {#each data.Configure_custom_solution.components as component}
              <li>{component["Component Name"]} (CAS {component.CasNumber}) - {component.Concentration}%</li>
            {/each}
          </ul>
        </div>
        <div class="mt-4">
          <p class="font-medium text-gray-600">Solvent: {data.Configure_custom_solution.solvent}</p>
          <p class="font-medium text-gray-600">Packaging Type: {data.Configure_custom_solution.packagingType}</p>
          <p class="font-medium text-gray-600">Volume: {data.Configure_custom_solution.volume}</p>
          <p class="font-medium text-gray-600">Units: {data.Configure_custom_solution.units}</p>
          <p class="font-medium text-gray-600">Quality Level: {data.Configure_custom_solution.qualityLevel}</p>
          <p class="font-medium text-gray-600">Analytical Technique: {data.Configure_custom_solution.analyticalTechnique}</p>
        </div>
      </section>
      <section class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-900">Additional Notes</h2>
        <p>{data.Additional_notes}</p>
      </section>
    </div>
  </div>
  