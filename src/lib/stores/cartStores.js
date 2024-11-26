import { writable } from 'svelte/store';

const initialCart = typeof window !== 'undefined' && localStorage.getItem('cart')
		? JSON.parse(localStorage.getItem('cart'))
		: [];

export const cartState = writable(initialCart);


if (typeof window !== 'undefined') {
	cartState.subscribe((items) => {
		localStorage.setItem('cart', JSON.stringify(items));
	});
}

export const updateCartState = (cart)=>{
    cartState.update((crt)=>{
        crt = cart
        return crt
    })
}