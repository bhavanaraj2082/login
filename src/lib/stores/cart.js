import { writable } from 'svelte/store';

const initialCart =
	typeof window !== 'undefined' && localStorage.getItem('cart')
		? JSON.parse(localStorage.getItem('cart'))
		: [];

export const cart = writable(initialCart);

export const checkoutError = writable('');

if (typeof window !== 'undefined') {
	cart.subscribe((items) => {
		localStorage.setItem('cart', JSON.stringify(items));
	});
}

// Function to add item to cart
export function addToCart(item) {
	cart.update((items) => {
		// ('3553', Array.isArray(item));
		if (Array.isArray(item)) {
			if (!items.length) return item;

			const inCart = item.filter((item1) => items.some((item2) => item2.id === item1.id));
			//console.log('add to cart',inCart);
			if (inCart.length) {
				inCart.forEach((obj) => {
					const search = items.find((item) => item.id === obj.id);
					if (search !== undefined) Object.assign(search, obj);
				});
			}
			const notInCart = item.filter((item1) => !items.some((item2) => item2.id === item1.id));
			notInCart.forEach((obj) => {
				items.push(obj);
			});
			return items;
		} else {
			if (!items.length) return [item];
			const search = items.find((itm) => itm.id === item.id);
			if (search === undefined) {
				items.push(item);
			} else {
				Object.assign(search, item);
			}
			return items;
		}

		// const index = items.findIndex((i) => i.id === item.id);
		// if (index === -1) {
		// 	return [...items, { ...item}];
		// } else {
		// 	items[index].quantity += item.quantity;
		// 	return items;
		// }
	});
}

// Function to remove item from cart
// export function removeFromCart(id) {
// 	cart.update((items) => items.filter((item) => item.id !== id));
// }
