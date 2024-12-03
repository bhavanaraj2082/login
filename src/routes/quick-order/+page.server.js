import { quick } from '$lib/server/mongoLoads.js';

export async function load() {
    let data = [];
    try {
        const productNames = await quick();
        
        data = productNames;
        // console.log('Data fetched from the server:', productNames.length);

        return { data };
    } catch (error) {
        console.error('Error fetching chemical products:', error);
        return { data };
    }
};


import { quicksearch ,quickcheck} from '$lib/server/mongoActions';
import fs from 'fs';
import path from 'path';
import { uploadFile  } from '$lib/server/mongoActions';

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
    // console.log('Request body:', data);

const { quickSearch } = data;

if (quickSearch && quickSearch.length >= 2) {

  const results = await quicksearch({ query: quickSearch });
  // console.log(results, 'Results from database');


  return results ;
}
  },

uploadFile: async ({ request }) => {
    try {
      const data = await request.formData();
      const file = data.get('file');

      // console.log('Received file:', file);  

      if (!file || file.size === 0) {
        return {
          body: { error: 'No file uploaded or file is empty' },
        };
      }

      const tempDir = path.resolve('/tmp/uploads');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const filePath = path.join(tempDir, file.name);
      const fileData = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, fileData);

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

      // console.log('Validation Results from server:', validationResults); 
return {
        body: validationResults,
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        body: { error: 'Error processing the file' },
      };
    }
  },
};












