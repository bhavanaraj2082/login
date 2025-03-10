import { browser } from "$app/environment"
import { writable } from "svelte/store";
export const myFavorites = writable([])

const initial = browser ? JSON.parse(localStorage.getItem('myfavorites')) || []: [];
//console.log(initial);
myFavorites.set(initial)

export const addLocalToFavorites =(item)=>{
    myFavorites.update(data=>{
        console.log(data);
     if(!data || data === null){
       //data = []
       data.push(item)
     } 
    let search = data.find(x=>x === item)
    if(search === undefined){
        data.push(item)
    }else{
        data = data.filter(x=>x !== item)
    }
    browser ? localStorage.setItem("myfavorites",JSON.stringify(data)) : []
    return data
    })
}