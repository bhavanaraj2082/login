import { getProfileDetails } from "$lib/server/mongoLoads.js";
import {
  editProfileContact,
  editProfileAddresses,
  editProfileSitePreferences,
  editProfileLinkOrganization,
  editProfilePaymentMethod,
  editProfileEmailPreferences,
  emailVerificationToken
} from "$lib/server/mongoActions.js";
 
export const load = async ({locals}) => {
  try {
    //authedUser.email is the parameter for getProfileDetails
    // const {userId} = JSON.parse(cookies.get("token"))
    console.log('=======...>',locals)
    return await getProfileDetails(locals.authedUser.id)
  } catch (error) {
    console.log('error',error);
      return { 
      error: 'Failed to load data'}

  }
};

export const actions = {
  verifyEmail:async({request})=>{
    const body = Object.fromEntries(await request.formData())
    //console.log("-----",body);
    return await emailVerificationToken(body,"Email")
  },
  editContact:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileContact(body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  editAddresses:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileAddresses(body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  editSitePreferences:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileSitePreferences(body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  editPaymentMethods:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfilePaymentMethod(body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  editEmailPreferences:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileEmailPreferences(body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  },

  linkOrganization:async({request})=>{
    try {
      const body = Object.fromEntries(await request.formData())
      return await editProfileLinkOrganization(body)
    } catch (err) {
      console.log(err);
      return { success:false,message:"Something went wrong"}
    }
  }
}