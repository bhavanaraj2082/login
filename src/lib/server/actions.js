import Pocketbase from "pocketbase"
import {DB_URL,DB_USER,DB_PASS} from "$env/static/private"
const pb = new Pocketbase(`${DB_URL}`)


export const myDetails = async(request)=>{
    const data = await request.formData()
    const details ={
        title:data.get("title"),
        firstname:data.get("firstname"),
        lastname:data.get("lastname"),
        mobilenumber:data.get("mobilenumber"),
        email:data.get("email"),
        organizationname:data.get("organizationname"),
        chemikartaccountno:data.get("chemikartaccountno"),
        billingaddress1:data.get("billingaddress1"),
        billingaddress2:data.get("billingaddress2"),
        country:data.get("country"),
        state:data.get("state"),
        city:data.get("city"),
        postcode:data.get("postcode"),
        delivetryaddress1:data.get("delivetryaddress1"),
        delivetryaddress2:data.get("delivetryaddress2")
    }

    try {
       await pb.admins.authWithPassword(`${DB_USER}`,`${DB_PASS}`)
        const record = await pb.collection("chemikart_mydetails").create(details)
        return {mydetails:{record}}
    } catch (error) {
       console.log(error); 
    }
}