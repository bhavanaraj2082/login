import { loadProductsubcategory } from '$lib/server/mongoLoads.js';

export async function load({ params,url,depends }) {
	try {
		const page = parseInt(url.searchParams.get('page')) || 1
		//console.log("]]]]",page);
        depends("page:data")

		// let productPage = 1;
		// let productPageSize = 20;
		return await loadProductsubcategory(params.subsubid,page);
		// return {
		// 	products,
		// 	manufacturers,
		// 	productCount
		// };
		// const fetchProductChunk = async () => {
		// 	let allProducts = [];
		// 	let moreDataAvailable = true;

		// 	while (moreDataAvailable) {
		// 		const productData = await loadProductsubcategory(params.subsubid, productPage);

		// 		if (productData && productData.type === 'success' && Array.isArray(productData.records)) {
		// 			allProducts = [
		// 				...allProducts,
		// 				...productData.records.map((record) => JSON.parse(JSON.stringify(record)))
		// 			];
		// 			productPage++;
		// 			if (productData.records.length < productPageSize) {
		// 				moreDataAvailable = false;
		// 			}
		// 		} else {
		// 			console.error('Unexpected product data structure:', productData);
		// 			moreDataAvailable = false;
		// 		}
		// 	}

		// 	return allProducts;
		// };

		//const data = await fetchProductChunk();
		//console.log('i am srver', products, totalCount);

		
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
