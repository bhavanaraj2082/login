import { popularProducts } from '$lib/server/loads.js';
import { serachByQuery } from '$lib/server/actions.js';
import { authenticate } from '$lib/server/pocketbase.js';

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
    }
};

