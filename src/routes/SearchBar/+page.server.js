import { fetchProductName } from '../../lib/server/actions';

export async function load() {
  try {
    const products = await fetchProductName();
    return {
      props: {
        products
      }
    };
  } catch (error) {
    console.error('Error loading products:', error);
    return {
      props: {
        products: []
      }
    };
  }
}
