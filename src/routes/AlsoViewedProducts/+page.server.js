import { fetchViewedProducts } from '$lib/server/loads.js';
import { authenticate } from '$lib/server/pocketbase.js';

export async function load() {
  const pb = await authenticate();
  const fetchedProducts = await fetchViewedProducts(pb);
  console.log('fd',fetchedProducts);
  return { fetchedProducts };
}