import { quick } from '$lib/server/mongoLoads.js';
import { quickcheck ,quicksearch} from '$lib/server/mongoActions.js';

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
import { quicksearch } from '../../lib/server/mongoActions';
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

  export async function quickcheck(data) {
    const { ProductId, quantity } = data;
  
    console.log("ProductId from actions:", ProductId);
  
    if (!ProductId || !quantity) {
      return {
        type: 'error',
        message: 'Product ID and Quantity are required.',
      };
    }
  
    const requestedQuantity = parseInt(quantity, 10);
  
    try {
      // Add a debug log for the query being run
      console.log(`Querying stock with ProductId: ${ProductId}`);
  
      // Remove populate for simplicity
      const stockRecord = await Stock.findOne({ productNumber: ProductId }).exec();
  
      console.log("Stock Record:", stockRecord);
  
      if (!stockRecord) {
        console.log(`No stock record found for ProductId: ${ProductId}`);
        return {
          message: 'Out of stock',
          stock: 'Unavailable',
          type: 'error',
        };
      }
  
      const stockQuantity = stockRecord.stock;
  
      if (stockQuantity > 0) {
        if (requestedQuantity <= stockQuantity) {
          return {
            message: 'In Stock',
            stock: 'Available',
            type: 'success',
          };
        } else {
          return {
            message: `Only ${stockQuantity} units available.`,
            stock: 'Limited Availability',
            type: 'error',
          };
        }
      } else {
        return {
          message: 'Out of Stock',
          stock: 'Unavailable',
          type: 'error',
        };
      }
    } catch (error) {
      console.error('Error during stock check:', error);
      return {
        message: 'Something went wrong with the stock check.',
        stock: 'Unavailable',
        type: 'error',
      };
    }
  }
  quicksearch: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    console.log('Request body:', data);

    const { quickSearch } = data;

    if (quickSearch && quickSearch.length >= 2) {

      const results = await quicksearch({ query: quickSearch });
      console.log(results, 'Results from database');

    
      return results ;
    }

   
  },
};







