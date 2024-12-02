// import { pb, authenticate } from '$lib/server/pocketbase';
// // const pb = await authenticate();
// export const actions = {
//   submitForm: async ({ request }) => {
//     const formData = await request.formData();

  
//     const ExtractedData = formData.get('ExtractedData');
//     const title = formData.get('title');
//     const firstname = formData.get('firstname');
//     const lastname = formData.get('lastname');
//     const company = formData.get('company');
//     const street = formData.get('street');
//     const postalcode = formData.get('postalcode');
//     const city = formData.get('city');
//     const location = formData.get('location');
//     const description = formData.get('description');
//     const email = formData.get('email');
//     const url = formData.get('url');
//     const image = formData.get('image');

//     const dataToSubmit = {
//       title,
//       firstname,
//       lastname,
//       company,
//       street,
//       postalcode,
//       city,
//       location,
//       description,
//       email,
//       ...(url && { url: String(url) }), 
//     };

//     const uploadData = new FormData();

    
//     Object.keys(dataToSubmit).forEach(key => uploadData.append(key, String(dataToSubmit[key])));

 
//     if (ExtractedData && ExtractedData instanceof File) {
//       try {
//         const fileContent = await ExtractedData.text();
//         const sanitizedContent = sanitizeFileContent(fileContent);
//         if (sanitizedContent.trim()) {
//           uploadData.append('ExtractedData', sanitizedContent); 
//         }
//       } catch (error) {
//         console.error("Error reading file:", error);
//       }
//     }

//     if (image && image.size > 0) {
//       uploadData.append('image', image);
//     }

//     try {
//       const response = await pb.collection('CopyrightConsent').create(uploadData);
//       console.log('Form submitted successfully:', response);
//       return { status: 200, body: { success: true, response } };
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       return { status: 500, body: { success: false, message: 'Form submission failed.' } };
//     }
//   },
// };


// function sanitizeFileContent(content) {
//   if (typeof content === 'string') {
//     return content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
//   }
//   return content; 
// }





import CopyConsent from '$lib/server/models/Copyconsent.js'; 

export const actions = {
  submitForm: async ({ request }) => {
    try {
      const formData = await request.formData();
      const ExtractedData = formData.get('ExtractedData');
      const title = formData.get('title');
      const firstname = formData.get('firstname');
      const lastname = formData.get('lastname');
      const company = formData.get('company');
      const street = formData.get('street');
      const postalcode = formData.get('postalcode');
      const city = formData.get('city');
      const location = formData.get('location');
      const description = formData.get('description');
      const email = formData.get('email');
      const url = formData.get('url');
      const image = formData.get('image');
      const status = "unread";

    
      const dataToSubmit = {
        title,
        firstname,
        lastname,
        company,
        street,
        postalcode: postalcode ? Number(postalcode) : undefined, 
        city,
        location,
        description,
        email,
        url,
        status,
        ExtractedData: ExtractedData && typeof ExtractedData === 'string' ? sanitizeFileContent(ExtractedData) : undefined,
        image: image && image.size > 0 ? image.name : undefined, 
      };
      Object.keys(dataToSubmit).forEach((key) => {
        if (dataToSubmit[key] === undefined) delete dataToSubmit[key];
      });
      if (Object.keys(dataToSubmit).length === 0) {
        return {
          status: 400,
          body: { success: false, message: 'No valid form data provided' }, 
        };
      }
      const newDocument = new CopyConsent(dataToSubmit);
      const savedDocument = await newDocument.save();

      console.log('Form submitted successfully:', savedDocument);
      return {
        status: 200,
        body: { success: true, response: savedDocument }, 
      };
    } catch (error) {
      console.error('Error submitting form:', error);
      return {
        status: 500,
        body: { success: false, message: 'Form submission failed', error: error.message },
      };
    }
  },
};


function sanitizeFileContent(content) {
  if (typeof content === 'string') {
    return content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }
  return content;
}



