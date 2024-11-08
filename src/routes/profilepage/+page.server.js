import { profileupdate} from "$lib/server/loads.js";
import { updateOrganization1,updateprofile1,updateShipping1,updatedOrder1,updatedMethod1,updatePreferences,checkData } from "$lib/server/actions";
import {authenticate} from '$lib/server/pocketbase.js'
import { authedUser} from '$lib/stores/UserData'

let user
authedUser.subscribe(d=>user=d)

 
export const load = async () => {
  try {
      const userId = user?.id
      if (!userId) {
        throw new Error("User is not initialized or missing ID");
      }
      const pb = await authenticate()
      const result= await profileupdate(pb,userId)       
      return { result }; 
  } catch (error) {
      return { 
      error: 'Failed to load data'}

  }
};

export const actions = {
  updateprofile: async ({ request }) => {
    const body = Object.fromEntries(await request.formData())
    try {
      const pb = await authenticate()
    const updateProfileData = await updateprofile1(pb,body)
    return {
      updateProfileData,
  }
  } catch (error) {
    return {
        error: 'Failed to update status',
    };
  }
},

updateOrganization:async({request})=>{
  const body = Object.fromEntries(await request.formData())
  try {
    const pb = await authenticate()
    const updateorganizationData = await updateOrganization1(pb,body);
    return {
      updateorganizationData,
    }
  } catch (error) {
    return {
        error: 'Failed to update status',
    };
  }
},
updateShipping:async({request})=>{
  const body = Object.fromEntries(await request.formData())
  try {
    const pb = await authenticate()
    const updateShippingData = await updateShipping1(pb,body);
    return {
      updateShippingData,
    }
  } catch (error) {
    return {
        error: 'Failed to update status',
    };
  }
},
orderdetail: async({request}) => {
  const body = Object.fromEntries(await request.formData())
  try {
    const pb = await authenticate()
    const updateOrderDetail = await updatedOrder1(pb,body);    
    return {
      updateOrderDetail,
    }
  }
 catch (error) {
  return {
      error: 'Failed to update status',
  };
}
},


updateData: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
        try {
        const pb = await authenticate();
        const userId = body.userId;

        const preferencesUpdate = {
            orderConfirmation: body.orderConfirmation === 'on',
            includeAttachment: body.includeAttachment === 'on',
            shipmentTracking: body.shipmentTracking === 'on',
            repromiseNotifications: body.repromiseNotifications === 'on',
        };
        const preferencesArray = Object.keys(preferencesUpdate).filter(key => preferencesUpdate[key]);
        let ccAddresses = body.ccAddresses || '';
        ccAddresses = ccAddresses.replace(/\n/g, '').split(',');     

        const updatedPreference = { 
          userId,
          preferences: preferencesArray,
          ccAddresses: ccAddresses
        }
        const updatePreferencesData = await updatePreferences(pb, updatedPreference);
        return {
            status: 200,
            updatePreferencesData,
        };
    } catch (error) {
        console.error('Error updating preferences:', error); 
        return {
            error: 'Failed to update preferences',
        };
    }
},


ordermethods: async({request}) => {
  const body = Object.fromEntries(await request.formData())  
  try {
    const pb = await authenticate()
    const updateOrdermethods = await updatedMethod1(pb,body);
    return {
      updateOrdermethods,
    }
  }
 catch (error) {
  return {
      error: 'Failed to update status',
  };
}
},
linkOrganization: async ({ request }) => {
  const body = Object.fromEntries(await request.formData());  
  try {
      const pb = await authenticate();
      const updatedata = await checkData(pb, body);    
      if (updatedata) {
        return {
          updatedata: { type: 'success', message: "Link organization found" }
        };
      } else {
        return {
          updatedata: { type: 'error', message: "Link organization not found" }
        };
      }
  } catch (error) {
    console.error('Error cheking  data:', error); 
      return {
          error: 'Failed to update status'
      };
  }
}

}