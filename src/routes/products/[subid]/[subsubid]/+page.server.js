import { loadProductsubcategory } from '$lib/server/mongoLoads.js';
import { addToCart,favorite } from '$lib/server/mongoActions.js';

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
	},
	addtocart:async({request,locals})=>{
		try {
			const userId = locals?.authedUser?.id || ""
			const userEmail = locals?.authedUser?.email || ""
			const body = Object.fromEntries(await request.formData())
			const data = JSON.parse(body.item)
			//console.log(data);
			return await addToCart(data,userId,userEmail)
		} catch (error) {
			console.log(error);
			return {success:false,message:"Something went wrong"}
		}
	},
	favorite: async ({ request }) => {
			const favdata = Object.fromEntries(await request.formData());
			console.log("Form Data Received:", favdata);
			// const {productDesc, id, imgUrl,productName,productNumber,priceSize,quantity,stock,size,price,} = favdata;
			try {
			  const result = await favorite(favdata);
			  return result;
			} catch (error) {
			  console.error("Error adding to favourites:", error.message);
			  return {
				success: false,
				type: "error",
				message: "Something went wrong please try again later!",
			  };
			}
		  },
};
