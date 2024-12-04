import { writable } from 'svelte/store';

export const authedUser = writable({
    email: ''
});
export const shippingAddress= writable();
export const billingAddress= writable()