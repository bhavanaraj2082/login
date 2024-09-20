// action.js
import { PUBLIC_PB_EMAIL, PUBLIC_PB_PASSWORD, PUBLIC_PB_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
const pb = new PocketBase(`${PUBLIC_PB_URL}`);

async function adminLogin() {
    try {
        await pb.admins.authWithPassword(`${PUBLIC_PB_EMAIL}`, `${PUBLIC_PB_PASSWORD}`);
        console.log("Admin login successful");
    } catch (error) {
        console.error("Admin login failed:", error);
        throw new Error("Admin login failed");
    }
}
// Contact us form submisson #112
export async function handleFormSubmission(data) {
    await adminLogin(); // Log in before performing any actions

    try {
        // Prepare the data object from the form submission
        const submissionData = {
            enquiryType: data.enquiryType,
            preferredLang: data.preferredLanguage,
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneCode: data.countryCode,
            phoneNum: data.phoneNumber,
            invoiceNum: data.invoiceNumber,
            orgName: data.organizationName,
            location: data.location,
            postCode: data.postCode,
            comment: data.comments,
            consent: data.consent === 'on'
        };

        // Create a new record in the PocketBase collection
        const record = await pb.collection('chemi_contactUs').create(submissionData);

        return { success: true, message: "Form submitted successfully!", record };
    } catch (error) {
        console.error("Error submitting form:", error);
        return { success: false, message: "Error processing form." };
    }
}
// #112 end
