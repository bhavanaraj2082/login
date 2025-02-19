import { getFavSavedData } from "$lib/server/mongoloads.js";
import { deleteFavoriteItem, clearAllFavorites } from "$lib/server/mongoactions.js";

export const load = async ( userId ) => {
    const favData = await getFavSavedData( userId ); 
    // console.log("===>",favData)
    return JSON.parse(JSON.stringify({ favData }))   
};

export const actions = {
    removeItem: async ({ request, userId }) => {
        try {
            const formData = await request.formData(); 
            const id = formData.get('itemId'); 
            if (!id) {
                return { type: 'error', data: { message: 'Item ID is required' } }; 
            }
            const result = await deleteFavoriteItem(id, userId ); 
            return {
                type: 'success',
                data: { message: `Item with ID ${id} removed successfully`,result },
            };
        } catch (error) {
            console.error('Error removing item:', error);

            return {
                type: 'error',
                data: { message: 'Failed to remove item', error: error.message },
            };
        }
    },
    removeAllItem: async ( userID ) => {
        try {
            const result = await clearAllFavorites( userID );
            return {
                type: 'success',
                data: {
                    message: 'All items removed successfully', result },
            };
        } catch (error) {
            console.error('Error removing all items:', error);

            return {
                type: 'error',
                data: { message: 'Failed to remove all items', error: error.message },
            };
        }
    },
};

// export const load = async ({ locals }) => {
//     try {
//         const userEmail = locals?.user?.email ;
//         const favData = await getFavSavedData(userEmail);
//         console.log("Server+++>",favData)
//         return { favData };
//     } catch (error) {
//         console.error('Error loading favorites:', error.message);
//         return {
//             favData: { favorite: [] },
//         };
//     }
// };