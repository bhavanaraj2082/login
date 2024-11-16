import { quick } from '$lib/server/loads.js';
import { quickcheck } from '$lib/server/actions.js';
import {authenticate, pb} from '$lib/server/pocketbase.js';


/********************check Availability**********************/
export const actions = {
    quickcheck: async ({ request }) => {
    const authResponse = await authenticate();
    if (authResponse?.status === 400) {
      return {
        type: "error",
        message: authResponse.error,
      };
    }

    try {
      const formData = Object.fromEntries(await request.formData());
     // console.log("Formatted Data:", formData);
      const record = await quickcheck(formData, pb);
      return {
        record: record,
      };
    } catch (error) {
      console.error("Error in action:", error);
      return {
        type: "error",
        message: "An error occurred while processing the request.",
      };
    }
  },
};


export async function load() {
    let data =[]
    try {
        const  productNames  = await quick(pb);
       
        data= productNames;
         // console.log('Data fetched from the server:', productNames);
        return {data}
    }
    catch (error) {
        console.error('Error fetching chemical products:', error);
        return {data}
    }
};



