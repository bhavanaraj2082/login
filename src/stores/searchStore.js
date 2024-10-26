
import { writable } from 'svelte/store';
import { fetchproductName } from '../lib/server/actions.js';

export const searchResult = writable([]);

export async function loadComponents() {
    const products = await fetchproductName();
    searchResult.set(products);
}
