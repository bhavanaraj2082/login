import { getProductdatas } from '$lib/server/mongoLoads.js';

export const load = async () => {
	const data = await getProductdatas();

	// console.log("dataaaa",data);
	return data;
};
