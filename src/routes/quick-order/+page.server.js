
import { parse } from 'csv-parse/sync';
import { uploadFile ,quicksearch ,quickcheck} from '$lib/server/mongoActions';

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
quicksearch : async ({ request }) => {
  const data = Object.fromEntries(await request.formData());
  const { quickSearch } = data;
  if (quickSearch && quickSearch.length >= 2) {
      try {
          const results = await quicksearch({ query: quickSearch });
          const processedResults = results.map(product => {
              if (product.pricing && Array.isArray(product.pricing)) {
                  const formattedPricing = product.pricing.map(item => ({
                      break: item.break,
                      currency: item.currency || 'N/A', 
                      price: item.price || 'N/A' 
                  }));
                  product.pricing = formattedPricing;
              }
              
              return product;
          });
          // console.log("ia mfrom server",processedResults);
          return processedResults; 
      } catch (error) {
          console.error('Error in quicksearch:', error);
          return { error: 'An error occurred while fetching search results.' };
      }
  } else {
      return { error: 'Search query must be at least 2 characters.' };
  }
},


  uploadFile :async ({ request }) => {
  try {
    const data = await request.formData();
    const file = data.get('file');

    // console.log('Received file:', file);  
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
    const records = parse(fileContent, { columns: false, skip_empty_lines: true });
    const productNumbers = records.map(([productNumberAndSize]) => {
      const [productNumber] = productNumberAndSize.split('-');
      return productNumber.trim();
    });

    // console.log('Extracted product numbers:', productNumbers);

    const validationResults = await uploadFile({ query: productNumbers });
    
    return validationResults;

    
  } catch (error) {
    console.error('File upload error:', error);
    return {
      error: 'Error processing the file' ,
    };
  }
 },
};
