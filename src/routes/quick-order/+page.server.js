import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { uploadFile, quicksearch, quickcheck, addToCart, CreateProductQuote } from '$lib/server/mongoActions';
import { error, fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '../../lib/server/models/TokenVerification';
import { verifyemailOtp, sendemailOtp } from '$lib/server/mongoActions.js';
import { APP_URL } from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';
import sendemail from '$lib/data/sendemail.json';
import { sendNotificationEmail, sendEmailToUser } from '$lib/server/emailNotification.js';

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
          };
        });

        //  console.log(processedResults,"processedResults");
        //  console.log(processedResults.length,"length");



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
      console.log(data, "upload file");

      const file = data.get('file');
      if (!file || file.size === 0) {
        return {
          error: 'No file uploaded or file is empty',
        };
      }

      const fileData = Buffer.from(await file.arrayBuffer());
      let fileContent = '';
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        fileContent = fileData.toString('utf8');
        const results = Papa.parse(fileContent, { header: false, skipEmptyLines: true });
        const records = results.data;

        const validationResults = await uploadFile({
          query: records,
          uploadedQuantities: {},
        });
        return validationResults;

      } else if (file.type === 'application/vnd.ms-excel' || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        const workbook = XLSX.read(fileData, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const records = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        const validationResults = await uploadFile({
          query: records,
          uploadedQuantities: {},
        });
        return validationResults;

      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        fileContent = fileData.toString('utf8');

        const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const records = lines.map(line => line.split(','));

        const validationResults = await uploadFile({
          query: records,
          uploadedQuantities: {},
        });
        return validationResults;

      } else {
        throw new Error('Unsupported file type');
      }

    } catch (error) {
      console.error('File upload error:', error);
      return {
        error: 'Error processing the file',
      };
    }
  },

  addToCart: async ({ request, locals }) => {
    try {
      console.log('Received request:', request);
      const formData = await request.formData();
      console.log('Form Data:', formData);

      const cartItems = JSON.parse(formData.get('cartItems')) || JSON.parse(formData.get('manualEntries'));
      console.log('Parsed Cart Items:', cartItems);

      if (!locals.user) {
        console.error('User not authenticated');
        return fail(401, { message: 'User not authenticated' });
      }
      console.log("user Details", locals.user);

      const userId = locals.user.userId;
      const userEmail = locals.user.email;
      console.log('User ID:', userId, 'User Email:', userEmail);

      // Process each cart item
      for (const item of cartItems) {
        // console.log('Processing item:', item);
        // const backorder =Math.max(item.quantity-item.stock)

        const cartItem = {
          productId: item.id,
          productName: item.productName,

          manufacturerId: item.manufacturerId || '',
          distributorId: item.distributerId || '',
          stockId: item.stockId || '',
          quantity: item.quantity || '',
          backOrder: item.backOrder,
          offerPrice: {
            usd: item.usdPrice,
            inr: item.inrPrice * 75
          },
          isQuote: false,
          isBom: false,
          isOffered: false
        };

        // console.log('Prepared Cart Item:', cartItem);
        const result = await addToCart(cartItem, userId, userEmail);
        // console.log('Add to Cart Result:', result);

        if (!result.success) {
          console.error('Failed to add item to cart:', result.message);
          return fail(400, { message: result.message });
        }
      }

      console.log(`${cartItems.length} item(s) added to cart successfully`);
      return {
        success: true,
        message: `${cartItems.length} item(s) added to cart successfully`
      };
    } catch (err) {
      console.error('Error adding to cart:', err);
      return fail(500, { message: 'Failed to add items to cart' });
    }
  },
  createQuote: async ({ request }) => {
    try {
      const data = Object.fromEntries(await request.formData());
      console.log("quote data in server js", data);
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

      // Send confirmation email to the user (customer)
      const userEmailContent = sendemail.emailTemplatequoteuser
        .replaceAll('{{PUBLIC_WEBSITE_NAME}}', PUBLIC_WEBSITE_NAME)
        .replaceAll('{{APP_URL}}', APP_URL)
        .replaceAll('{{productName}}', data.productName || '')
        .replaceAll('{{productNumber}}', data.productNumber || '')
        .replaceAll('{{units}}', data.units || '')
        .replaceAll('{{Firstname}}', data.Firstname || '')
        .replaceAll('{{Lastname}}', data.lastname|| '')
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

      //   console.log(`Verifying OTP for email: ${email}`);
      const verificationResult = await verifyemailOtp(email, enteredOtp);

      //   console.log(verificationResult, "verificationResult");

      if (!verificationResult.success) {
        // console.log("OTP verification failed:", verificationResult.message);
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
  // console.log(userProfile,"userProile");


  if (!userProfile) {
    return null;
  }
  return JSON.parse(JSON.stringify({ profile: userProfile }));
};