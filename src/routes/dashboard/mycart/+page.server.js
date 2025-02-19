import { fail, error, redirect } from '@sveltejs/kit';
import { getProfileDetails, getSingleCartDetails } from '$lib/server/mongoLoads.js';
// import { resumeCart , updateCart , updateRecurrence, updateCartName , createNewCart} from '$lib/server/mongoActions.js';

export const load = async ({ locals }) => {
  if (!locals.authedUser) {
	
    return {
      cart: [],
      userData: null
    };
  }

  try {
    const [userData, cartData] = await Promise.all([
      getProfileDetails(locals.authedUser),
      getSingleCartDetails(locals.authedUser.userId)
    ]);

    return {
      cart: cartData,  
      userData  
    };
  } catch (error) {
    console.error('Load error:', error);
    return {
      cart: [],
      userData: null,
      error: 'Failed to load data'
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
		//   console.log("cartId",cartId); 	
		  if (!cartId) {
			return fail(400, {
			  success: false,
			  msg: "Cart ID is required"
			});
		  }
		  if (!recurring) {
			return fail(400, {
			  success: false,
			  msg: "Recurrence period is required"
			});
		  }
		  if (recurring.includes('Months')) {
			const months = parseInt(recurring.split(' ')[0]);
			if (isNaN(months) || months < 2 || months > 11) {
			  return fail(400, {
				success: false,
				msg: "Invalid custom interval"
			  });
			}
		  }
		const result = await updateRecurrence(
			{ cartId, recurring },
			locals.authedUser.userId
		  );
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