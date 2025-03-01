import { fail, error, redirect } from '@sveltejs/kit';
import { resumeCart , updateCart , updateRecurrence, updateCartName , createNewCart, deleteCartRecurrence} from '$lib/server/mongoActions.js';
import { getUserProfileData, getProfileDetails } from '$lib/server/mongoLoads.js';

export const load = async ({ locals }) => {
  try {
    if (!locals.authedUser?.id) {
      return {
        authedUser: null,
        error: 'Not authenticated'
      };
    }

    const profileData = await getProfileDetails(locals.authedUser.id);
    
    if (!profileData.success && !profileData.profileData) {
      return {
        authedUser: {
          id: locals.authedUser.id,
          email: locals.authedUser.email,
          username: locals.authedUser.username
        },
        error: 'Profile not found'
      };
    }

    const userData = await getUserProfileData(locals.authedUser.id);
    return {
      cart: userData.cart || []
    };
  } catch (error) {
    console.error('Dashboard load error:', error);
    return {
      authedUser: null,
      error: 'Failed to load dashboard data'
    };
  }
};

export const actions = {
	resumeCart: async ({ request, locals }) => {
		if (!locals.authedUser) {
		  throw error(401, 'Unauthorized');
		}
		try {
		  const formData = await request.formData();
		  const cartId = formData.get('cartId');

		  if (!cartId) {
			return fail(400, {
			  success: false,
			  message: 'Cart ID is required'
			});
		  }
		  const updatedCart = await resumeCart(cartId, locals.authedUser.id);
	
		  if (!updatedCart) {
			return fail(404, {
			  success: false,
			  message: 'Cart not found'
			});
		  }
		  return {
			success: true,
			type: 'success',
			cartId: updatedCart._id
		  };
		} catch (err) {
		  console.error('Error resuming cart:', err);
		  return fail(500, {
			success: false,
			message: 'Failed to resume cart'
		  });
		}
	  },
	  recurrence: async ({ request, locals }) => {
		if (!locals.authedUser) {
		  throw error(401, 'Unauthorized');
		}
		
		try {
		  const formData = await request.formData();
		  const cartId = formData.get('cartId');
		  let recurring = formData.get('recurring');
		  const dayOfMonth = formData.get('dayOfMonth');
		  const customInterval = formData.get('customInterval');
		  
		  if (!cartId) {
			return fail(400, {
			  success: false,
			  msg: "Cart ID is required"
			});
		  }
		  
		  if (!recurring) {
			return fail(400, {
			  success: false,
			  msg: "Recurrence interval is required"
			});
		  }
		  
		  if (!dayOfMonth || isNaN(parseInt(dayOfMonth)) || parseInt(dayOfMonth) < 1 || parseInt(dayOfMonth) > 31) {
			return fail(400, {
			  success: false,
			  msg: "Valid day of month is required (1-31)"
			});
		  }
		  
		  // Determine recurring value
		  let numericRecurring = 1; // Default to monthly
		  
		  if (recurring === 'Custom') {
			if (!customInterval) {
			  return fail(400, {
				success: false,
				msg: "Custom interval is required"
			  });
			}
			
			numericRecurring = parseInt(customInterval);
			if (isNaN(numericRecurring) || numericRecurring < 2 || numericRecurring > 11) {
			  return fail(400, {
				success: false,
				msg: "Invalid custom interval (must be 2-11)"
			  });
			}
		  } else {
			numericRecurring = parseInt(recurring);
			if (isNaN(numericRecurring)) {
			  return fail(400, {
				success: false,
				msg: "Invalid recurrence interval"
			  });
			}
		  }
		  
		  // Calculate dates
		  const today = new Date();
		  const futureDate = new Date();
		  futureDate.setMonth(today.getMonth() + numericRecurring);
		  
		  // Adjust for valid day in target month
		  const targetDay = parseInt(dayOfMonth);
		  const lastDayOfTargetMonth = new Date(futureDate.getFullYear(), futureDate.getMonth() + 1, 0).getDate();
		  const adjustedDay = Math.min(targetDay, lastDayOfTargetMonth);
		  
		  futureDate.setDate(adjustedDay);
		  
		  // Call updateRecurrence with the calculated data
		  const result = await updateRecurrence({
			cartId,
			recurring: numericRecurring,
			dayOfMonth: targetDay,
			recurringDate: futureDate
		  }, locals.authedUser.userId);
		  
		  if (!result.success) {
			return fail(400, result);
		  }
		  
		  return {
			type: 'success',
			data: result
		  };
		} catch (err) {
		  console.error('Error setting recurrence:', err);
		  return fail(500, {
			success: false,
			msg: "Failed to process recurrence request"
		  });
		}
	  },
	  
	  deleteRecurrence: async ({ request, locals }) => {
		if (!locals.authedUser) {
		  throw error(401, 'Unauthorized');
		}
		
		try {
		  const formData = await request.formData();
		  const cartId = formData.get('cartId');
		  
		  if (!cartId) {
			return fail(400, {
			  success: false,
			  msg: "Cart ID is required"
			});
		  }
		  
		  const result = await deleteCartRecurrence(cartId, locals.authedUser.userId);
		  
		  if (!result.success) {
			return fail(400, result);
		  }
		  
		  return {
			type: 'success',
			data: result
		  };
		} catch (err) {
		  console.error('Error deleting recurrence:', err);
		  return fail(500, {
			success: false,
			msg: "Failed to delete recurrence"
		  });
		}
	  },
	deleteCart: async ({ request, locals }) => {
	  if (!locals.authedUser) {
		throw error(401, 'Unauthorized');
	  }	
	  try {
		const formData = await request.formData();
		const cartId = formData.get('cartId');
	
		if (!cartId) {
		  throw error(400, 'Cart ID is required');
		}
	
		await updateCart(cartId);
		return { success: true };
	  } catch (err) {
		console.error('Error deleting cart:', err);
		throw error(500, 'Failed to delete cart');
	  }
	},
	editCart: async ({ request, locals }) => {
		if (!locals.authedUser) {
		  throw error(401, 'Unauthorized');
		}
	  
		try {
		  const formData = await request.formData();
		  const cartId = formData.get('cartId');
		  const cartName = formData.get('cartName');
	  
		  if (!cartId || !cartName) {
			return fail(400, {
			  success: false,
			  error: 'Cart ID and name are required'
			});
		  }

		  const updatedCart = await updateCartName(cartId, cartName.trim());
	  
		  if (!updatedCart) {
			return fail(404, {
			  success: false,
			  error: 'Cart not found'
			});
		  }
	  
		  return {
			type: 'success',
			cartName: updatedCart.cartName
		  };
		} catch (err) {
		  console.error('Error updating cart name:', err);
		  return fail(500, {
			success: false,
			error: 'Failed to update cart name'
		  });
		}
	  },
	  createcart: async ({ request, locals }) => {
        if (!locals.authedUser) {
            throw error(401, 'Unauthorized');
        }

        try {
			const formData = await request.formData();
            const customCartName = formData.get('cartName')?.toString().trim();
            const userId = locals.authedUser.id;
            const userEmail = locals.authedUser.email;
            
            const result = await createNewCart({ userId, userEmail, customCartName  });

            if (!result.success) {
                return fail(500, { 
                    success: false, 
                    error: result.error || 'Failed to create new cart' 
                });
            }

            throw redirect(303, '/cart');
        } catch (err) {
            // console.error('Error creating cart:', err);
            return fail(500, { 
                success: false, 
                error: 'Failed to create new cart' 
            });
        }
    }
}