import { authenticate } from '$lib/server/pocketbase.js';
import { Addquotes } from '$lib/server/actions.js';
const pb = await authenticate();

export const actions = {
    qoutes: async ({ request }) => {
        try {
            const data = Object.fromEntries(await request.formData());
            const record = await Addquotes(data, pb);
            return {
                type: "success",
                data: {
                    message: "Quote request submitted successfully!",
                    record,
                },
            };
        } catch (error) {
            console.error("Error creating quote:", error);
            return {
                type: "error",
                data: {
                    error: "Error submitting your data. Please try again later!",
                },
            };
        }
    },
};