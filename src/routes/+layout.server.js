import { redirect } from '@sveltejs/kit';

export const load = ({url,cookies})=>{
    //console.log(cookies.get("email"));
    if(url.pathname ==='/logout'){
        cookies.delete("email",{path:'/'})
        redirect(302,'/login')
    }
    const email = cookies.get('email') || ''
    return {email}
}