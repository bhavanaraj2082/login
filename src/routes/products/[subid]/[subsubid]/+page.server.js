// import {  authenticate } from '$lib/server/pocketbase';  
// import { loadProductsubcategory } from '$lib/server/loads.js';
// import { getSubSubCategoryDatas } from "$lib/server/loads"

// const pb = await authenticate();





// export async function load({ params }) {
//     let data = [];  
//     try {
//         const subproductdata = await getSubSubCategoryDatas(pb, params.subsubid);
//         let productPage = 1;
//         let productPageSize = 20;
//         const fetchProductChunk = async () => {
//             let allProducts = [];
//             let moreDataAvailable = true;

//             while (moreDataAvailable) {
//                 const productData = await loadProductsubcategory(pb, params.subsubid, productPage);

//                 if (productData && productData.type === 'success' && Array.isArray(productData.records)) {
//                     allProducts = [...allProducts, ...productData.records]; 
//                     productPage++; 
               
//                     if (productData.records.length < productPageSize) {
//                         moreDataAvailable = false; 
//                     }
//                 } else {
//                     console.error('Unexpected product data structure:', productData);
//                     moreDataAvailable = false;
//                 }
//             }

//             return allProducts; 
//         };
//         data = await fetchProductChunk();
//         console.log("i am from server",data.length);
        

//         return {
//             data,
//             subproductdata
//         };

//     } catch (error) {
//         console.error("Error loading product data:", error);
//         return {
//             error: "Failed to load product data."
//         };
//     }
// }




import { loadProductsubcategory } from '$lib/server/mongoLoads.js';


export async function load({ params }) {
    try {
        let productPage = 1;
        let productPageSize = 20;
        const fetchProductChunk = async () => {
            let allProducts = [];
            let moreDataAvailable = true;

            while (moreDataAvailable) {
                const productData = await loadProductsubcategory(params.subsubid, productPage);

                if (productData && productData.type === 'success' && Array.isArray(productData.records)) {
                 
                    allProducts = [...allProducts, ...productData.records.map(record => JSON.parse(JSON.stringify(record)))];
                    productPage++;
                    if (productData.records.length < productPageSize) {
                        moreDataAvailable = false;
                    }
                } else {
                    console.error('Unexpected product data structure:', productData);
                    moreDataAvailable = false;
                }
            }

            return allProducts;
        };

        const data = await fetchProductChunk();
        console.log("i am srver",data.length);
        
        return {
            data
        };

    } catch (error) {
        console.error("Error loading product data:", error);
        return {
            data: [], 
            error: "Failed to load product data."
        };
    }
}




