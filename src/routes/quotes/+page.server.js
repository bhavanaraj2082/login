import { pb, authenticate } from '$lib/server/pocketbase.js';
import { Addquotes } from '$lib/server/actions.js';
export const actions = {
    qoutes: async ({ request }) => {
        try {
            const pocketInstance = await authenticate();
            if (pocketInstance.status === 400) {
                return {
                    type: "error",
                    data: {
                        error: "Authentication failed. Please try again later!",
                    },
                };
            }
            const formData = Object.fromEntries(await request.formData());
            console.log("formData", formData);
            const record = await Addquotes(formData, pb);
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