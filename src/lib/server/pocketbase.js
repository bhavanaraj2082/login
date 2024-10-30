import {POCKETBASE_URL,POCKETBASE_USERNAME,POCKETBASE_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';
export const pb = new PocketBase(POCKETBASE_URL);

export async function authenticate() {
    const pocket= await pb.admins.authWithPassword(POCKETBASE_USERNAME,POCKETBASE_PASSWORD).catch(()=>{
     return null
    })
    if(!pocket){
     return { status: 400, error: "authentication Failed" }
    }
    return pb
}