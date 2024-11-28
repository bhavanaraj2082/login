import { popularProducts } from '$lib/server/loads.js';
import { serachByQuery } from '$lib/server/actions.js';
import { authenticate } from '$lib/server/pocketbase.js';
import { MAILCHIMP_API_KEY,MAILCHIMP_LIST_ID,MAILCHIMP_SERVER_PREFIX } from '$env/static/private';


const pb = await authenticate()

export async function load() {
    try {
        const PopularProductsData = await popularProducts(pb)
        return { PopularProductsData }
    }
    catch (error) {
        console.error('Error loading products:', error);
        return {}
    };
}

export const actions = {
    search: async ({ request }) => {
        const body = Object.fromEntries(await request.formData())
        try {
            const responce = await serachByQuery(pb, body)
            return {responce}
        } catch (err) {
            console.error('Error fetching search results:', err);
        }
    },

    subscribe: async ({ request }) => {
        const {email} = Object.fromEntries(await request.formData());
        const API_KEY = MAILCHIMP_API_KEY;
        const LIST_ID = MAILCHIMP_LIST_ID;
        const SERVER_PREFIX = MAILCHIMP_SERVER_PREFIX; 
    
        try {
          const response = await fetch(`https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`,
            },
            body: JSON.stringify({
              email_address: email,
              status: 'subscribed', 
            }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
  
            if (errorData.title === 'Member Exists') {
              return {
                  status: 200, 
                  body: { success: true, message: 'Already subscribed!' },
              };
          }
  
            return {
              status: 500,
              body: { success: false, message: "Subscription failed, please try again later." },
            };
          }
    
          return {
            status: 200,
            body: { success: true, message: 'Successfully subscribed!' },
          };
        } catch (error) {
          return {
            status: 500,
            body: { success: false, message: 'Something went wrong with server.' },
          };
        }
      }
};

