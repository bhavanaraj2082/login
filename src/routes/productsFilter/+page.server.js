import { pb, authenticate } from '$lib/server/pocketbase';  

import { loadFirstProduct } from '$lib/server/loads.js';


export async function load() {
    const pb = await authenticate();
    let data =[]
    try {
        const  productsWithNames  = await loadFirstProduct(pb);
        // console.log('Data fetched from the server:', productsWithNames);
        data= productsWithNames;
        return {data}
    }
    catch (error) {
        console.error('Error fetching chemical products:', error);
        return {data}
    }
};

