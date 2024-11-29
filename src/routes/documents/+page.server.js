// import { fetchcertificate } from '$lib/server/mongoActions.js';  
export const actions = {
    document: async ({ request }) => {
        const data = Object.fromEntries(await request.formData());
        const inputValue = data.productNumber;
        console.log(inputValue);
        try {
            const result = await fetchcertificate(inputValue);
            if (result) {
                console.log('Records fetched successfully:', result);
                return result; 
            } else {
                return "This number is not in our database."; 
            }
        } catch (error) {
            console.error('Failed to load records:', error);
            return "An error occurred while fetching records."; 
        }
    }
};