<script>
    import {PUBLIC_POCKETBASE_DB} from '$env/static/public'
   import Icon from '@iconify/svelte';
    import Pocketbase from 'pocketbase'
    const pb = new Pocketbase(PUBLIC_POCKETBASE_DB)
   import { onMount } from 'svelte';
   import * as XLSX from 'xlsx';
   let jsonData = [];
   let fileError = '';
   let dropArea;

   function handleDrop(event) {
       event.preventDefault();
       const files = event.dataTransfer.files;
       if (files.length > 0) {
           handleFileUpload(files[0]);
       }
   }

   function handleDragOver(event) {
       event.preventDefault(); // Prevent default to allow drop
   }
    function handleFileInputChange(event) {
   const files = event.target.files;
   if (files.length > 0) {
     handleFileUpload(files[0]);
   }
 }
   function handleFileUpload(selectedfile) {
       const file = selectedfile
       fileError = '';

       if (file) {
           const reader = new FileReader();
           reader.onload = (e) => {
               const data = new Uint8Array(e.target.result);
               const workbook = XLSX.read(data, { type: 'array' });
               const worksheet = workbook.Sheets[workbook.SheetNames[0]];

               try {
                   jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                   //console.log("logs",jsonData);
                   const keys = jsonData[0];
                   jsonData = jsonData.slice(1).map((row) => {
                       return row.reduce((obj, value, index) => {
                           obj[keys[index]] = value; 
                           return obj;
                       }, {});
                   });
                   console.log(jsonData);
               } catch (err) {
                   fileError = 'Error parsing the file.';
               }
           };
           reader.readAsArrayBuffer(file);
       }
   }

   async function submitData() {
       if (jsonData.length === 0) {
           fileError = 'No data to upload.';
           return;
       }

       try {
                 const data ={
                   userId:"12345djfj",
                   itemslist:jsonData
                 }
                  //const auth = await pb.admins.authWithPassword("yusuf@partskeys.com","yusuf@123")
                  //console.log(auth);
               const response = await pb.collection("bulkorder").create(data)
                  console.log("res",response);
               if (!response) {
                 throw new Error('Failed to upload data');
               }
               // Optionally handle success response
               alert('Data uploaded successfully!');
               jsonData = []; // Reset data after upload
       } catch (err) {
           fileError = err.message;
       }
   }

   onMount(() => {
       dropArea.addEventListener('drop', handleDrop);
       dropArea.addEventListener('dragover', handleDragOver);
   });
</script>

<main class="w-[80%] mx-auto">
   <h1 class=" py-2 font-black text-2xl">Bulk Order</h1>
   <div
       bind:this={dropArea}
       class=" flex flex-col justify-center items-center space-y-2 py-10 border-2 border-gray-400 border-dashed"
   >
       <h5 class=" font-bold text-center">
           Upload an Excel file with 2 column <span class=" font-medium italic">productname</span> and
           <span class=" font-medium italic">packsize</span>
       </h5>
       <p class="text-sm">That you wish to add to your cart</p>
       <p class=" text-sm font-medium">Maximum of 400 parts per order</p>
       <Icon icon="uil:upload" class=" text-5xl" />
       <label for="bulkupload" class=" text-sm"
           >Drag and drop or <span class="font-medium text-blue-700">Browse</span>
           <input
               id="bulkupload"
               class="hidden"
               type="file"
               accept=".xlsx, .xls, .csv"
               on:change={handleFileInputChange}
           />
       </label>
   </div>

   {#if fileError}
       <p class=" text-red-600 py-4">{fileError}</p>
   {/if}
   {#if jsonData.length}
       <h2 class=" font-bold text-xl my-5">Product Data Preview</h2>
            <table class=" border-collapse text-center">
              <tr>
                   <th class='border-2 w-60 md:w-[24rem] bg-black text-white py-2'>productname</th>
                   <th class='border-2 w-60 md:w-[24rem] bg-black text-white py-2'>packsize</th>
              </tr>
              {#each jsonData as data}
                   <tr>
                        <td class='border-2 w-60 md:w-[24rem] py-2'>{data.productname || "adapter"}</td>
                        <td class='border-2 w-60 md:w-[24rem] py-2'>{data.packsize || "38"}</td>
                   </tr>                 
              {/each}
         </table>
       <!-- <pre>{JSON.stringify(jsonData, null, 2)}</pre> -->
       <button on:click={submitData} class="px-24 md:px-32 py-2 my-5 text-sm font-medium text-white bg-black rounded-md">Upload Data</button>
   {/if}
</main>
