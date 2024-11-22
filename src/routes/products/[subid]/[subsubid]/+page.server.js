// import {authenticate} from "$lib/server/pocketbase"
// import { getSubSubCategoryDatas } from "$lib/server/loads"

// export const load = async({params}) =>{

//     const pb = await authenticate();
//     const data = await getSubSubCategoryDatas(pb,params.subsubid);
//     return data;

// }





import { pb, authenticate } from '$lib/server/pocketbase';  

import { loadProductsubcategory } from '$lib/server/loads.js';
// const pb = await authenticate();



export async function load({ params }) {
    const { subsubid } = params;
    // console.log("************", params);
    
    let data = [];
    
    try {
      
        const authResponse = await authenticate();
        
    
        if (authResponse?.status === 400) {
            return {
                error: authResponse.error,
            };
        }

 
        const productData = await loadProductsubcategory(pb, { SubUrl: subsubid });

    
        if (productData && productData.type === 'success' && Array.isArray(productData.records)) {
            data = productData.records; 
        } else {
            console.error('Unexpected product data structure:', productData);
            data = []; 
        }
        
        // console.log("I am from server:", data);
        
       
        return {
            data
        };
        
    } catch (error) {
        console.error("Error loading product data:", error);
        return {
            error: "Failed to load product data.",
        };
    }
}



