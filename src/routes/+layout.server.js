
import { redirect } from '@sveltejs/kit';
import { getCart } from "$lib/server/mongoLoads.js"

export const load = async({ url, cookies, locals,depends }) => {
    try {
	    if (url.pathname === '/logout') {
			cookies.delete('token', { path: '/' });
			redirect(302, '/login');
		}
		depends("/")
		const cart = await getCart(locals.authedUser?.id)

       let authedUser = {};

       if (locals.authedUser && locals.authedUser?.username) {
           authedUser = locals.authedUser;
       }

       return {
         authedUser,cart
        };
}catch(error){
	console.log(error);
}
}