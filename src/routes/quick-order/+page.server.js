import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { uploadFile, quicksearch, quickcheck, addToCart, CreateProductQuote, bulkUploadToCart } from '$lib/server/mongoActions';
import { error, fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '../../lib/server/models/TokenVerification';
import { verifyemailOtp, sendemailOtp } from '$lib/server/mongoActions.js';
import { APP_URL } from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';
import sendemail from '$lib/data/sendemail.json';
import { sendNotificationEmail, sendEmailToUser } from '$lib/server/emailNotification.js';
import { getCart } from '$lib/server/mongoLoads.js'

function parseProductQuery(query) {
  let inputStr = query.trim();

  const quantityUnitPattern = /^(.*?)-(\d+[-]?[A-Za-z]{1,3})$/i;
  const quantityUnitMatch = inputStr.match(quantityUnitPattern);

  if (quantityUnitMatch) {
    return {
      productNumber: quantityUnitMatch[1].trim(),
      size: quantityUnitMatch[2].trim()
    };
  }


  const packOfPattern = /^(.*?)[-\s]+(pack-of-\d+|case-of-\d+|each-of-\d+)$/i;
  const packOfMatch = inputStr.match(packOfPattern);

  if (packOfMatch) {
    return {
      productNumber: packOfMatch[1].trim(),
      size: packOfMatch[2].trim()
    };
  }

  const complexPattern = /^([A-Za-z0-9]+-[A-Za-z0-9]+-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)-((?:Pack|Case|Each)[-\s]+of[-\s]+\d+|\d+[-\s]*(?:pack|case|each|pcs|units|items)|[A-Za-z0-9\u00B0-\u9FFF]+(?:-[A-Za-z0-9\u00B0-\u9FFF]+)*)$/i;
  const complexMatch = inputStr.match(complexPattern);

  if (complexMatch) {
    return {
      productNumber: complexMatch[1].trim(),
      size: complexMatch[2].trim()
    };
  }

  const spaceHyphenPattern = /^(.*?)\s+-\s+(.+)$/;
  const spaceHyphenMatch = inputStr.match(spaceHyphenPattern);

  const measurementPattern = /^(.*?)-(\d+[-]?[A-Za-z\u00B0-\u9FFF]+)$/;
  const measurementMatch = inputStr.match(measurementPattern);

  const quantityPatterns = [
    /^(.*?)[-\s]+(each\s*(?:of)?\s*[-\s]*\d+|each[-\s]*of[-\s]*\d+|\d+\s*(?:each|pcs|units|items))$/i,
    /^(.*?)[-\s]+(case\s*(?:of)?\s*[-\s]*\d+|case[-\s]*of[-\s]*\d+|\d+\s*(?:case|pcs|units|items))$/i,
    /^(.*?)[-\s]+(pack\s*(?:of)?\s*[-\s]*\d+|pack[-\s]*of[-\s]*\d+|\d+\s*(?:pack|pcs|units|items))$/i
  ];

  let quantityMatch = null;
  for (const pattern of quantityPatterns) {
    const match = inputStr.match(pattern);
    if (match) {
      quantityMatch = match;
      break;
    }
  }

  if (spaceHyphenMatch) {
    return {
      productNumber: spaceHyphenMatch[1].trim(),
      size: spaceHyphenMatch[2].trim()
    };
  } else if (measurementMatch) {
    return {
      productNumber: measurementMatch[1].trim(),
      size: measurementMatch[2].trim()
    };
  } else if (quantityMatch) {
    return {
      productNumber: quantityMatch[1].trim(),
      size: quantityMatch[2].trim()
    };
  } else {
    const parts = inputStr.split('-');
    const lastPart = parts[parts.length - 1].toLowerCase();
    if (parts.length > 1 &&
      (lastPart.includes('pack') ||
        lastPart.includes('case') ||
        lastPart.includes('each') ||
        /^\d+[a-z\u00B0-\u9FFF]+$/.test(lastPart))) {
      return {
        productNumber: parts.slice(0, parts.length - 1).join('-'),
        size: parts[parts.length - 1]
      };
    }

    return {
      productNumber: inputStr,
      size: ""
    };
  }
}

export const actions = {
  quickcheck: async ({ request }) => {
    try {
      const formData = Object.fromEntries(await request.formData());
      console.log(formData, "formData");

      const { ProductId, quantity, stockId } = formData;
      if (!ProductId || !quantity) {
        return {
          type: 'error',
          message: 'Product ID and Quantity are required.',
        };
      }

      const record = await quickcheck({ ProductId, stockId, quantity });
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
        // const parsedQuery = parseProductQuery(quickSearch);
        const parsedQuery = quickSearch;
        // console.log("Original Query:", quickSearch);
        // console.log("Parsed Product Number:", parsedQuery.productNumber);
        // console.log("Parsed Size:", parsedQuery.size);
        const results = await quicksearch({ query: parsedQuery });

        const processedResults = results.map(product => {
          let processedPricing = [];
          if (product.pricing && Array.isArray(product.pricing)) {
            processedPricing = product.pricing.map(item => {
              const processedItem = { ...item };

              if (item.INR) {
                processedItem.inr = item.INR;
              }
              if (item.usd) {
                processedItem.usd = item.usd;
              } else if (item.USD) {
                processedItem.usd = item.USD;
              }

              return {
                break: item.break || 'N/A',
                usd: item.usd || item.USD || 'N/A',
                inr: item.inr || item.INR || 'N/A',
                offer: item.offer || '0'
              };
            });
          }

          let relevance = 1;
          if (parsedQuery.size && product.size) {
            const productSizeLower = product.size.toLowerCase();
            const parsedSizeLower = parsedQuery.size.toLowerCase();
            relevance = productSizeLower.includes(parsedSizeLower) ? 2 : 0.5;
          }

          return {
            id: product.id,
            image: product.image,
            description: product.description,
            productName: product.productName,
            productNumber: product.productNumber,
            stockId: product.stockId,
            manufacturer: product.manufacturer,
            distributer: product.distributer,
            stock: product.stock || 0,
            pricing: processedPricing,
            priceone: product.priceone || (processedPricing[0]?.inr || processedPricing[0]?.INR || ''),
            size: product.size || null,
            parsedSize: parsedQuery.size,
            relevance: relevance,
            sku: product.sku
          };
        });

        if (parsedQuery.size) {
          processedResults.sort((a, b) => b.relevance - a.relevance);
        }

        return processedResults;
      } catch (error) {
        console.error('Error in quicksearch action:', error);
        return { error: 'An error occurred while fetching search results.' };
      }
    } else {
      console.log('Search query is invalid:', quickSearch);
      return { error: 'Search query must be at least 2 characters.' };
    }
  },


  uploadFile: async ({ request }) => {
    try {
      const data = await request.formData();
      const performanceStart = Date.now();

      const file = data.get('file');
      if (!file || file.size === 0) {
        return {
          error: 'No file uploaded or file is empty',
        };
      }
      const supportedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];

      const fileExt = file.name.split('.').pop().toLowerCase();
      const supportedExts = ['csv', 'xls', 'xlsx', 'txt'];

      if (!supportedTypes.includes(file.type) && !supportedExts.includes(fileExt)) {
        return {
          error: 'Unsupported file type. Please upload CSV, Excel or TXT files only.',
        };
      }
      let records = [];
      const fileData = Buffer.from(await file.arrayBuffer());
      if (file.type === 'text/csv' || fileExt === 'csv') {
        if (file.size < 500000) {
          const fileContent = fileData.toString('utf8');
          const results = Papa.parse(fileContent, {
            header: false,
            skipEmptyLines: true,
            dynamicTyping: false,
            fastMode: true,
            worker: false,
            chunk: null
          });
          records = results.data;
        } else {
          const fileContent = fileData.toString('utf8');
          const results = Papa.parse(fileContent, {
            header: false,
            skipEmptyLines: true,
            worker: true
          });
          records = results.data;
        }
      }
      else if (file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        fileExt === 'xls' || fileExt === 'xlsx') {
        const workbook = XLSX.read(fileData, {
          type: 'buffer',
          cellFormula: false,
          cellHTML: false,
          cellText: false
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        records = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: '',
          raw: true,
          range: 0
        });
      }
      else if (file.type === 'text/plain' || fileExt === 'txt') {
        const fileContent = fileData.toString('utf8');
        records = fileContent
          .split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.split(',').map(item => item.trim()));
      }

      const BATCH_SIZE = 500;
      const processedResults = [];
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        const batchResults = await uploadFile({
          query: batch,
          uploadedQuantities: {}
        });
        processedResults.push(...batchResults);
      }

      console.log(`[PERF] Total server processing time: ${Date.now() - performanceStart}ms for ${records.length} records`);
      return processedResults;

    } catch (error) {
      console.error('File upload error:', error);
      return {
        error: 'Error processing the file: ' + (error.message || 'Unknown error'),
      };
    }
  },

  addToCart: async ({ request, locals }) => {
    try {
      const formData = await request.formData();

      const cartItems = JSON.parse(formData.get('cartItems')) || JSON.parse(formData.get('manualEntries'));

      if (!locals.user) {
        console.error('User not authenticated');
        return fail(401, { message: 'User not authenticated' });
      }

      const userId = locals.user.userId;
      const userEmail = locals.user.email;

      const result = await bulkUploadToCart(cartItems, userId, userEmail);


      return {
        success: result.success,
        message: result.message,

      };
    } catch (err) {
      return fail(500, { message: 'Failed to add items to cart' });
    }
  },

  createQuote: async ({ request }) => {
    try {
      const data = Object.fromEntries(await request.formData());
      async function getClientIP() {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      }
      const ipAddress = await getClientIP();


      const record = await CreateProductQuote(data);

      const targetEmailContent = sendemail.emailTemplatequote
        .replaceAll('{{PUBLIC_WEBSITE_NAME}}', PUBLIC_WEBSITE_NAME)
        .replaceAll('{{APP_URL}}', APP_URL)
        .replaceAll('{{productName}}', data.productName || '')
        .replaceAll('{{productNumber}}', data.productNumber || '')
        .replaceAll('{{units}}', data.units || '')
        .replaceAll('{{Firstname}}', data.Firstname || '')
        .replaceAll('{{Lastname}}', data.lastname || '')
        .replaceAll('{{organisation}}', data.organisation || '')
        .replaceAll('{{email}}', data.email || '')
        .replaceAll('{{phone}}', data.phone || '')
        .replaceAll('{{futherdetails}}', data.futherdetails || '')
        .replaceAll('{{ipAddress}}', ipAddress || '');  // Include the IP address

      try {
        await sendNotificationEmail(
          `New Quote Created – ${PUBLIC_WEBSITE_NAME}`,
          targetEmailContent
        );
      } catch (error) {
        console.error('Error sending notification email to the team:', error);
      }

      const userEmailContent = sendemail.emailTemplatequoteuser
        .replaceAll('{{PUBLIC_WEBSITE_NAME}}', PUBLIC_WEBSITE_NAME)
        .replaceAll('{{APP_URL}}', APP_URL)
        .replaceAll('{{productName}}', data.productName || '')
        .replaceAll('{{productNumber}}', data.productNumber || '')
        .replaceAll('{{units}}', data.units || '')
        .replaceAll('{{Firstname}}', data.Firstname || '')
        .replaceAll('{{Lastname}}', data.lastname || '')
        .replaceAll('{{organisation}}', data.organisation || '')
        .replaceAll('{{email}}', data.email || '')
        .replaceAll('{{phone}}', data.phone || '')
        .replaceAll('{{futherdetails}}', data.futherdetails || '');

      try {
        await sendEmailToUser(
          `Your Quote Confirmation – ${PUBLIC_WEBSITE_NAME}`,
          userEmailContent,
          data.email
        );
      } catch (error) {
        console.error('Error sending confirmation email to the user:', error);
      }

      return record;

    } catch (error) {
      console.error("Error creating quote:", error);
    }
  },

  verifyemail: async ({ request }) => {
    const rawData = Object.fromEntries(await request.formData());


    const email = rawData.email;



    if (!email) {
      return {
        status: 500,
        message: 'Please provide a valid email address',
        success: false,
        isEmailVerified: false
      };
    }

    try {
      const tokenVerificationRecord = await TokenVerification.findOne({ email });

      if (tokenVerificationRecord && tokenVerificationRecord.isEmailVerified) {

        return {
          status: 200,
          message: 'Email is already verified',
          success: true,
          isEmailVerified: true
        };
      }
      const user = await Profile.findOne({ email });


      if (!user) {
        const result = await sendemailOtp(email);
        if (result) {
          return {
            status: 200,
            message: 'Verification email sent successfully. Please check your inbox.',
            success: true,
            isEmailVerified: false
          };
        } else {
          throw new Error('Email sending failed');
        }
      }

      if (!user.isEmailVerified) {
        const result = await sendemailOtp(email);
        if (result) {
          return {
            status: 200,
            message: 'Verification email sent successfully. Please check your inbox.',
            success: true,
            isEmailVerified: false
          };
        } else {

          throw new Error('Email sending failed');
        }
      }
      return {
        status: 200,
        message: 'User already exists and email is verified.',
        success: true,
        isEmailVerified: true
      };
    } catch (error) {
      // console.error('Error during email verification:', error);
      return {
        status: 500,
        message: 'Verification mail could not be sent. Double-Check your email again',
        success: false,
        isEmailVerified: false
      };
    }
  },

  verifyOtpEmail: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    console.log('verifyOtp body', body);

    const { email, enteredOtp } = body;

    try {
      if (!email) {

        return {
          status: 500,
          message: 'Please provide email  verify.',
          success: false,
          isEmailVerified: false
        };
      }
      if (!enteredOtp) {

        return {
          status: 500,
          message: 'Please provide OTP to verify.',
          success: false,
          isEmailVerified: false
        };
      }
      const verificationResult = await verifyemailOtp(email, enteredOtp);


      if (!verificationResult.success) {
        return {
          status: 500,
          message: verificationResult.message,
          success: false,
          isEmailVerified: false
        };
      } else {
        // console.log("OTP verification successful:", verificationResult.message);
        return {
          status: 200,
          message: verificationResult.message,
          success: true,
          isEmailVerified: true
        };
      }
    } catch (error) {
      //   console.error("Error in verifyOtp handler:", error);
      return {
        status: 500,
        message: 'An unexpected error occurred while verifying the OTP. Please try again later.',
        success: false,
        isEmailVerified: false
      };
    }
  },


};






export const load = async ({ locals }) => {
  if (!locals?.user) {
    return null;
  }
  const authedUser = { id: locals.user.userId };
  const userProfile = await Profile.findOne({ userId: authedUser.id });
  const cart = await getCart(authedUser.id)
  console.log(authedUser, "userProile");


  if (!userProfile) {
    return null;
  }
  return JSON.parse(JSON.stringify({ profile: userProfile, cart }));
};