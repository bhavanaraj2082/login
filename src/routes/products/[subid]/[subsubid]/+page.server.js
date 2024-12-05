import { loadProductsubcategory } from '$lib/server/mongoLoads.js';

export async function load({ params,url,depends }) {
	try {
		const page = parseInt(url.searchParams.get('page')) || 1
		const search = url.searchParams.get('search') || ""
		const manufacturer = url.searchParams.get('manufacturer') || null
        depends("page:data")
		return await loadProductsubcategory(params.subsubid,page,manufacturer,search);
		
	} catch (error) {
		console.error('Error loading product data:', error);
		return {
			data: [],
			error: 'Failed to load product data.'
		};
	}
}

export const actions = {
	pageChange: async ({ request, params }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			const { products, totalCount } = await loadProductsubcategory(params.subsubid, body.page);

			return products;
		} catch (error) {
			//console.error('Error removing item:', error);
			return {
				status: 500,
				body: { message: 'Failed to get data' }
			};
		}
	}
};
