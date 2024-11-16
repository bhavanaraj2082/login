import { pb,authenticate } from '$lib/server/pocketbase.js';  // Adjust the path as necessary
import { fetchcertificate } from '$lib/server/actions.js';

export const actions = {
    document: async ({ request }) => {
        const data = Object.fromEntries(await request.formData());
        const inputValue = data.productNumber;
        console.log(inputValue);

        // Authenticate with PocketBase
        const authenticatedPb = await authenticate();
        if (!authenticatedPb) {
            console.error('Authentication failed');
            return "Authentication error: Unable to connect to PocketBase.";
        }

        try {
            const result = await fetchcertificate(inputValue, authenticatedPb);
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
