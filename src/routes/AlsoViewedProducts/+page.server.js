import { fetchViewedProducts } from '$lib/server/mongoLoads.js';

export async function load() {
  const fetchedProducts = await fetchViewedProducts();
  console.log('fd', fetchedProducts);
  return { fetchedProducts };
}
