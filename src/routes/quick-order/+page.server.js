import Papa from 'papaparse'; // Importing PapaParse instead of csv-parse
import { uploadFile, quicksearch, quickcheck } from '$lib/server/mongoActions';

export const actions = {
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
  quicksearch: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const { quickSearch } = data;

    if (quickSearch && quickSearch.length >= 0) {
      try {
        const results = await quicksearch({ query: quickSearch });
        const processedResults = results.map(product => {
          if (product.pricing && Array.isArray(product.pricing)) {
            product.pricing = product.pricing.map(item => ({
              break: item.break || 'N/A',
              price: item.INR || 'N/A', 
            }));
          }
      return {
            id: product.id,
            image: product.image,
            description: product.description,
            productName: product.productName,
            productNumber: product.productNumber,
            stock: product.stock || 0,
            pricing: product.pricing,
          };
        });
     return processedResults;
      } catch (error) {
        console.error('Error in quicksearch action:', error);
        return { error: 'An error occurred while fetching search results.' };
      }
    } else {
      return { error: 'Search query must be at least 2 characters.' };
    }
  },
 
uploadFile: async ({ request }) => {
  try {

    const data = await request.formData();

    const file = data.get('file');
    if (!file || file.size === 0) {
      return {
        error: 'No file uploaded or file is empty',
      };
    }

    const fileData = Buffer.from(await file.arrayBuffer());
    let fileContent = '';
    if (file.type === 'text/csv' || file.type === 'text/plain') {
      fileContent = fileData.toString('utf8');
} else {
      throw new Error('Unsupported file type');
    }
    const results = Papa.parse(fileContent, { header: false, skipEmptyLines: true });
    const records = results.data;  
    const validationResults = await uploadFile({
      query: records,  
      uploadedQuantities: {}, 
    });
   return validationResults;

  } catch (error) {
    console.error('File upload error:', error);
    return {
      error: 'Error processing the file',
    };
  }
},
};
