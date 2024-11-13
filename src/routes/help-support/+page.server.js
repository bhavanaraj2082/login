import { authenticate } from '$lib/server/pocketbase.js';
import { saveContactInfo } from '$lib/server/actions.js'

const pb = await authenticate();

export const actions = {
    contact: async ({ request }) => {
        try {
            const body = Object.fromEntries(await request.formData())
            const result = await saveContactInfo(pb, body)
            return result
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
}
