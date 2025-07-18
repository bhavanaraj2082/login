import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const authedUser = writable({username:"",email:'',userId:''})
export function logout() {
	authedUser.set({
	  email: '',
	  username: ''
	});
}