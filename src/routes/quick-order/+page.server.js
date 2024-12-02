import { quick } from '$lib/server/mongoLoads.js';
import { quickcheck } from '$lib/server/mongoActions.js';
export async function load() {
    let data = [];
    try {
        const productNames = await quick();
        data = productNames;
        console.log('Data fetched from the server:', productNames.length);

        return { data };
    } catch (error) {
        console.error('Error fetching chemical products:', error);
        return { data };
    }
};

import { json } from '@sveltejs/kit';
import { handleFileUpload } from '$lib/server/mongoActions'; 
export const actions = {
  uploadFile: async ({ request }) => {
 
    const formData = await request.formData();
    const file = formData.get('file')


    if (!file) {
      return json({
        success: false,
        message: 'No file uploaded. Please upload a valid file.'
      });
    }

    try {
     
      const fileData = await file.text();
      const validationResults = await handleFileUpload(fileData);

   
      return json({
        success: true,
        validationMessages: validationResults
      });

    } catch (error) {
      console.error('Error during file processing:', error);
      return json({
        success: false,
        message: 'An error occurred while processing the file. Please try again later.'
      });
    }
  },

  quickcheck: async ({ request }) => {
    try {
      const formData = Object.fromEntries(await request.formData());
      const { ProductId, quantity } = formData;
      if (!ProductId || !quantity) {
        return {
          type: 'error',
          message: 'Product ID and Quantity are required.',
        };
      }
      const record = await quickcheck({ ProductId, quantity });
      return {
        record,
      };
    } catch (error) {
      console.error('Error in quickcheck action:', error);

      return {
        type: 'error',
        message: 'An error occurred while processing the request.',
      };
    }
  },
};







