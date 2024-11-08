
import { fetchProductName } from '$lib/server/loads';

export async function load() {
  try {
    const productNames = await fetchProductName(pb);
    return { productNames };
  } catch (error) {
    console.error("Error loading page:", error);
    return { productNames: [] };
  }
}
