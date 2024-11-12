import { fetchsearchcomponent } from '$lib/server/actions.js';
export async function load() {
    try {
        const products = await fetchsearchcomponent();
        return {products}
        }
     catch (error) {
        console.error('Error loading products:', error);
        return {}
            
        };
    }
