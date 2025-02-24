import { redirect } from '@sveltejs/kit';
import { getCart } from "$lib/server/mongoLoads.js"

export const load = async({ url, cookies,depends }) => {
	//console.log(cookies.get("email"));
    try {
	    if (url.pathname === '/logout') {
			cookies.delete('token', { path: '/' });
			redirect(302, '/login');
		}
		depends("/")
		if(cookies.get('token') === undefined){
			return
		}
		const token = JSON.parse(cookies.get('token'))
		console.log(cookies.get('token'));
		const cart = await getCart(token?.userId)
		console.log(cart,token.userId);
		return { token,cart };
	} catch (error) {
		console.log(error);
	}
	
};
