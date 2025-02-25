import { Addquotes } from '$lib/server/mongoActions.js';
import { sanitizeFormData } from '$lib/utils/sanitize.js';
export const actions = {
    qoutes: async ({ request }) => {
        try {
            const rawData = Object.fromEntries(await request.formData());
            const data = sanitizeFormData(rawData);
            const record = await Addquotes(data);
            console.log("server record",record);
            
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