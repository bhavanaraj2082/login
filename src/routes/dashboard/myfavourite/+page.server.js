import { deleteFavoriteItem, clearAllFavorites, favaddToCart, addAllToCart } from "$lib/server/mongoActions.js";
import { getUserProfileData, getProfileDetails } from '$lib/server/mongoLoads.js';

export const load = async ({ locals,depends }) => {
  try {
    if (!locals.authedUser?.id) {
      return {
        authedUser: null,
        error: 'Not authenticated'
      };
    }
    depends("data:fav")
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
      favorites: userData.favorites || []
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
  addItemToCart: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const itemData = JSON.parse(formData.get('itemData'));
      console.log("--->cartitem11", itemData)

      if (!itemData) {
        return { success: false, message: 'Item data is required' };
      }

      const result = await favaddToCart(
        itemData, 
        locals.authedUser.id,
        locals.authedUser.email
      );
      console.log(result);
      if (result.status === 'success') {
        return { success: true, message: result.message };
      } else {
        return { success: false, message: 'Failed to add item to cart' };
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return { 
        success: false, 
        message: 'Something went wrong while adding to cart'
      };
    }
  },

  addalltocart: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const items = JSON.parse(formData.get('items'));

      if (!items?.length) {
        return { success: false, message: 'No items to add to cart' };
      }
       console.log('object2');
      const result = await addAllToCart(
        items,
        locals.authedUser.id,
        locals.authedUser.email
      );

      if (result.status === 'success') {
        return { success: true, message: result.message };
      } else {
        return { success: false, message: 'Failed to add items to cart' };
      }
    } catch (error) {
      console.error('Error adding all items to cart:', error);
      return { 
        success: false, 
        message: 'Something went wrong while adding items to cart'
      };
    }
  },

  removeItem: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const itemId = formData.get('itemId');
      
      if (!itemId) {
        return { success: false, message: 'Item ID is required' };
      }
      
      const result = await deleteFavoriteItem(itemId, locals.authedUser.id);
      
      if (result.status === 'success') {
        return { 
          success: true, 
          message: 'Item removed from favorites',
          favorite: result.favorite
        };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error removing item:', error);
      return { 
        success: false, 
        message: 'Unable to remove item from favorites'
      };
    }
  },

  removeAllItem: async ({ locals }) => {
    try {
      const result = await clearAllFavorites(locals.authedUser.id);
      
      if (result.status === 'success') {
        return { 
          success: true, 
          message: 'All items removed from favorites',
          favorite: []
        };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error removing all items:', error);
      return { 
        success: false, 
        message: 'Unable to clear favorites'
      };
    }
  }
};

// export const actions = {
//   addItemToCart: async ({ request, locals }) => {
//         try {
//             const formData = await request.formData();
//             const itemData = JSON.parse(formData.get('itemData'));

//             if (!itemData) {
//                 return { 
//                     type: 'error', 
//                     data: { message: 'Item data is required' } 
//                 };
//             }

//             const result = await favaddToCart(
//                 itemData, 
//                 locals.authedUser.id,
//                 locals.authedUser.email
//             );

//             return {
//                 type: 'success',
//                 data: { 
//                     message: 'Item added to cart successfully',
//                     result 
//                 }
//             };
//         } catch (error) {
//             console.error('Error adding item to cart:', error);
//             return {
//                 type: 'error',
//                 data: { 
//                     message: 'Failed to add item to cart',
//                     error: error.message 
//                 }
//             };
//         }
//     },

//     addAllToCart: async ({ request, locals }) => {
//         try {
//             const formData = await request.formData();
//             const items = JSON.parse(formData.get('items'));

//             if (!items || !Array.isArray(items)) {
//                 return { 
//                     type: 'error', 
//                     data: { message: 'Invalid items data' } 
//                 };
//             }

//             const result = await addAllToCart(
//                 items,
//                 locals.authedUser.id,
//                 locals.authedUser.email
//             );

//             return {
//                 type: 'success',
//                 data: { 
//                     message: 'All items added to cart successfully',
//                     result 
//                 }
//             };
//         } catch (error) {
//             console.error('Error adding all items to cart:', error);
//             return {
//                 type: 'error',
//                 data: { 
//                     message: 'Failed to add items to cart',
//                     error: error.message 
//                 }
//             };
//         }
//     },
//   removeItem: async ({ request, locals }) => {
//     try {
//         const formData = await request.formData();
//         const itemId = formData.get('itemId');
        
//         if (!itemId) {
//             return {
//                 type: 'error',
//                 data: { message: 'Item ID is required' }
//             };
//         }
        
//         const result = await deleteFavoriteItem(itemId, locals.authedUser.id);
        
//         if (result.status === 'success') {
//             return {
//                 type: 'success',
//                 data: {
//                     message: 'Item removed successfully',
//                     favorite: result.favorite
//                 }
//             };
//         } else {
//             throw new Error(result.message);
//         }
//     } catch (error) {
//         console.error('Error removing item:', error);
//         return {
//             type: 'error',
//             data: {
//                 message: 'Failed to remove item',
//                 error: error.message
//             }
//         };
//     }
// },

// removeAllItem: async ({ locals }) => {
//     try {
//         const result = await clearAllFavorites(locals.authedUser.id);
        
//         if (result.status === 'success') {
//             return {
//                 type: 'success',
//                 data: {
//                     message: 'All items removed successfully',
//                     favorite: []
//                 }
//             };
//         } else {
//             throw new Error(result.message);
//         }
//     } catch (error) {
//         console.error('Error removing all items:', error);
//         return {
//             type: 'error',
//             data: {
//                 message: 'Failed to remove all items',
//                 error: error.message
//             }
//         };
//     }
// }
// };