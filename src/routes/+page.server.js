//Home search bar
// import { fetchsearchcomponent } from '$lib/server/actions.js';
import { popularProducts } from '$lib/server/loads.js';
import { authenticate } from '$lib/server/pocketbase.js';

const pb = await authenticate()

export async function load() {
    try {
        // const products = await fetchsearchcomponent(pb);
        const PopularProductsData = await popularProducts(pb)
        return { PopularProductsData }
    }
    catch (error) {
        console.error('Error loading products:', error);
        return {}

    };
}
