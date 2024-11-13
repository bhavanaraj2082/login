import { fetchcertificate } from '$lib/server/actions.js';
export const actions = {
    create: async ({ request }) => {
        const data = Object.fromEntries(await request.formData());
        const inputValue = data.productNumber;
        console.log(inputValue);
        try {
            const result = await fetchcertificate(inputValue,pb);
            if (result) {
                console.log('Records fetched successfully:', result);
                return result; 
            } else {
                return "This number is not in our PocketBase.";
            }
        } catch (error) {
            console.error('Failed to load records:', error);
            return "An error occurred while fetching records.";
        }
    }
};