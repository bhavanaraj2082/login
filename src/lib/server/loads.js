
import {DB_URL,DB_USER,DB_PASS} from "$env/static/private"
import PocketBase from 'pocketbase'

const pb = new PocketBase(`${DB_URL}`)


export const getChemicalProducts = async()=>{
    try {
      await pb.admins.authWithPassword(`${DB_USER}`,`${DB_PASS}`)
      const products = await pb.collection("SampleChemiComponent").getList(1,10,{fields:"productName,productNumber,priceSize,prodDesc"})
     // console.log(products.items);
      return {products:products.items}
    } catch (error) {
        console.log(error);
    }
}

