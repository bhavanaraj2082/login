import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const guestList = ['Guest', 'guest'];

	if (
		!locals.authedUser ||
		!locals.authedUser.email ||
		// guestList.includes(locals.authedUser.username)
		locals.authedUser.email === 'guest@partskeys.com'
	) {
		throw redirect(307, '/login');
	}

	return;
}
