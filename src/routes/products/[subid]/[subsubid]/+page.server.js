import {  authenticate } from '$lib/server/pocketbase';  
import { loadProductsubcategory } from '$lib/server/loads.js';
import { getSubSubCategoryDatas } from "$lib/server/loads"

const pb = await authenticate();

export async function load({ params }) {
    let data = [];  
    try {
       
        const subproductdata = await getSubSubCategoryDatas(pb,params.subsubid);
        const productData = await loadProductsubcategory(pb, params.subsubid);
    
        if (productData && productData.type === 'success' && Array.isArray(productData.records)) {
            data = productData.records; 
        } else {
            console.error('Unexpected product data structure:', productData);
            data = []; 
        }
           
        return {
            data,subproductdata
        };
        
    } catch (error) {
        console.error("Error loading product data:", error);
        return {
            error: "Failed to load product data.",
        };
    }
}



