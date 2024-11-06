import { writable } from 'svelte/store';
import { fetchProductName } from '$lib/server/actions';
export const searchResult = writable([]);
export async function loadComponents() {
    const products = await fetchProductName();
    searchResult.set(products);
}