import { submitContactInfo } from "$lib/server/actions.js";
import { authenticate } from '$lib/server/pocketbase.js'
export const actions = {
contactus: async ({ request }) => {
    try {
    const pb = await authenticate();
    const body = Object.fromEntries(await request.formData());
    await submitContactInfo(body,pb);
    return {
        type: "success",
        data: {
        message: "Contact details submitted successfully!",
        },
    };
    } catch (error) {
    console.error("Error creating contact:", error);
    return {
        type: "error",
        data: {
        error: "Error submitting your data. Please try again later!",
        },
    };
    }
},
};