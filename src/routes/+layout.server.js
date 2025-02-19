import { redirect } from '@sveltejs/kit';
// import { getCart } from '$lib/server/mongoLoads.js';

export const load = async({ url, cookies, locals }) => {
	//console.log(cookies.get("email"));
	if (url.pathname === '/logout') {
		cookies.delete('token', { path: '/' });
		redirect(302, '/login');
	}
	// const cart = await getCart(locals.authedUser.id)
	// console.log(cart,"cart345678")
	// return {locals,cart};
	return {locals};
};
