import { getProfileDetails } from "$lib/server/loads.js";
import {
  editProfileContact,
  editProfileAddresses,
  editProfileSitePreferences,
  editProfileLinkOrganization,
  editProfilePaymentMethod,
  editProfileEmailPreferences,
} from "$lib/server/actions.js";
import {authenticate} from '$lib/server/pocketbase.js'
const pb = await authenticate()
 
export const load = async ({cookies}) => {
  try {
      const email = cookies.get('email')
      //console.log("hhhhhh",email);
      return await getProfileDetails(pb,email)  
  } catch (error) {
    console.log('error',error);
      return { 
      error: 'Failed to load data'}

  }
};

export const actions = {
  editContact:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileContact(pb,body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  editAddresses:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileAddresses(pb,body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  editSitePreferences:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileSitePreferences(pb,body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  editPaymentMethods:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfilePaymentMethod(pb,body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  editEmailPreferences:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileEmailPreferences(pb,body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  linkOrganization:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileLinkOrganization(pb,body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  }
}