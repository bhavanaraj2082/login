import { loadProduct } from '$lib/server/loads.js';


export async function load() {
    let data =[]
    try {
        const  productNames  = await loadProduct(pb);
        // console.log('Data fetched from the server:', productsWithNames);
        data= productNames;
        return {data}
    }
    catch (error) {
        console.error('Error fetching chemical products:', error);
        return {data}
    }
};
