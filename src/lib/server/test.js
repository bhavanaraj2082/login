import Category from '$lib/server/models/Category';

export async function getProductdatas() {
	try {
		const records = JSON.parse(JSON.stringify(await Category.findOne().exec()));
		if (records.length > 0) {
			return { records: JSON.parse(JSON.stringify(records)) };
		} else {
			return { error: 'Products not found' };
		}
	} catch (e) {
		console.log(e);
		return { error: 'Products not found' };
	}
}
