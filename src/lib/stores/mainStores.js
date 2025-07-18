import { writable } from 'svelte/store';
export const authedUser = writable({username:"",email:'',userId:''})
export function logout() {
	authedUser.set({
	  email: '',
	  username: ''
	});
}