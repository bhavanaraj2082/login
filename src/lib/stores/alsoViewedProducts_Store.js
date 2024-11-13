import { writable } from 'svelte/store';

const initialCart = typeof window !== 'undefined' && localStorage.getItem('cart')
		? JSON.parse(localStorage.getItem('cart'))
		: [];

export const viewedCart = writable(initialCart);


if (typeof window !== 'undefined') {
	viewedCart.subscribe((items) => {
		localStorage.setItem('cart', JSON.stringify(items));
	});
}

export const updateCartState = (cartState)=>{
    viewedCart.update((cart)=>{
        cart = cartState
        return cart
    })
}