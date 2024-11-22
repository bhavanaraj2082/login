    import { authenticate } from "$lib/server/pocketbase.js";
    import { getFavSavedData } from "$lib/server/loads.js";
    import { getFavData, getFavAllData } from "$lib/server/actions.js";
    
    const pb = await authenticate();
    
    export const load = async () => {
        const favData = await getFavSavedData(pb, 'test2@gmail.com');
        // console.log("favData from server", favData);
        return { favData };
    };
    
    export const actions = {
        removeItem: async ({ request }) => {
            try {
                const formData = await request.formData();
                const id = formData.get('id');
    
                if (!id) {
                    return {
                        status: 400,
                        body: { message: 'Item ID is required' }
                    };
                }  
                const result = await getFavData(pb, id);             
                return {
                    status: 200,
                    body: { 
                        message: 'Item successfully removed',
                        favorite: result.favorite 
                    }
                };
            } catch (error) {
                console.error('Error removing item:', error);
                return {
                    status: 500,
                    body: { message: 'Failed to remove item' }
                };
            }
        },  
        removeAllItem: async () => {
            try {
                const result = await getFavAllData(pb);              
                return {
                    status: 200,
                    body: { 
                        message: 'All items removed successfully',
                        favorite: result.favorite 
                    }
                };
            } catch (error) {
                console.error('Error removing all items:', error);
                return {
                    status: 500,
                    body: { message: 'Failed to remove all items' }
                };
            }
        }
    };