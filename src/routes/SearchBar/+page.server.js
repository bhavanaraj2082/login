import { fetchProductName } from "$lib/server/loads.js";

export async function load() {
  try {
    const products = await fetchProductName();
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error("Error loading products:", error);
    return {
      props: {
        products: [],
      },
    };
  }
}
