import { getcookies} from "$lib/server/loads.js";
import { updateOrganization1,updateprofile1,updateShipping1,updatedOrder1,updatedMethod1,updatePreferences,updatedlink1 } from "$lib/server/actions";
import {authenticate} from '$lib/server/pocketbase.js'



export const load = async ({cookies}) => {
  try {
      const pb = await authenticate()
      const usercookie = await getcookies(pb,cookies)      
      return { usercookie };
  } catch (error) {
      console.error("Error loading data:", error);
      return { status: 500, error: new Error("Failed to load data") };
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

        if (!userId) {
            throw new Error("Missing userId");
        }
        const updatePreferencesData = await updatePreferences(pb, { userId, preferences: preferencesArray });

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
linkOrganization: async({request}) => {
  const body = Object.fromEntries(await request.formData())
  try{
    const pb = await authenticate()
    const updatedata = await updatedlink1(pb,body)
    return {
      updatedata
    }

  }catch (error) {
    return {
        error: 'Failed to update status',
    };
}

}

}