// import { redirect } from '@sveltejs/kit';

// export const load = ({ url, cookies }) => {
//     console.log(cookies.get("email"));
//     if (url.pathname === '/logout') {
//         cookies.delete('token', { path: '/' });
//         redirect(302, '/login');
//     }
//     const token = cookies.get('token') || { email: '', userId: '', profileId: '' };
//     return { token };
// };

export async function load({ locals }) {

let authedUser = {};

if (locals.authedUser && locals.authedUser?.username) {
    authedUser = locals.authedUser;
}

return {
    authedUser
};
}