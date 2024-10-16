import Pocketbase from "pocketbase"
import {DB_URL,DB_USER,DB_PASS} from "$env/static/private"
const pb = new Pocketbase(`${DB_URL}`)


export const myDetails = async(request)=>{
    const data = await request.formData()
    const details ={
        title:data.get("title"),
        firstname:data.get("firstname"),
        lastname:data.get("lastname"),
        mobilenumber:data.get("mobilenumber"),
        email:data.get("email"),
        organizationname:data.get("organizationname"),
        chemikartaccountno:data.get("chemikartaccountno"),
        billingaddress1:data.get("billingaddress1"),
        billingaddress2:data.get("billingaddress2"),
        country:data.get("country"),
        state:data.get("state"),
        city:data.get("city"),
        postcode:data.get("postcode"),
        delivetryaddress1:data.get("delivetryaddress1"),
        delivetryaddress2:data.get("delivetryaddress2")
    }

    try {
       await pb.admins.authWithPassword(`${DB_USER}`,`${DB_PASS}`)
        const record = await pb.collection("chemikart_mydetails").create(details)
        return {mydetails:{record}}
    } catch (error) {
       console.log(error); 
    }
}

export async function Addqoutes({request}) {
    const formData = await request.formData();
  
    const Custom_solution_type= formData.get("solutionValue")
    const Custom_format= formData.get("selectedColor")
    const Configure_custom_solution={
      components : formData.getAll("components[]"),
      solvent : formData.get("solvent"),
      packagingType : formData.get("packagingType"),
      volume : formData.get("volume"),
      units : formData.get("units"),
      qualityLevel : formData.get("qualityLevel"),
      analyticalTechnique : formData.get("analyticalTechnique"),
    }
    const Additional_notes = formData.get("futherdetails")
    const Customer_details={
      Title : formData.get("title"),
      Firstname : formData.get("first"),
      Lastname : formData.get("last"),
      organisation : formData.get("organisation"),
      country : formData.get("country"),
      lgc : formData.get("lgc"),
      email : formData.get("email"),
      number : formData.get("number"),
    }
    const Delivery_information={
      Address1 : formData.get("address1"),
      Address2 : formData.get("address2"),
      Country1 : formData.get("country1"),
      County : formData.get("county"),
      City : formData.get("city"),
      Post : formData.get("post")
  
    }
  
    const data = {
      Custom_solution_type: Custom_solution_type,
      Custom_format: Custom_format,
      Configure_custom_solution: Configure_custom_solution,
      Additional_notes: Additional_notes,
      Customer_details: Customer_details,
      Delivery_information: Delivery_information
  };
  
  try {
    await pb.admins.authWithPassword(`${DB_USER}`, `${DB_PASS}`);
    const record = await pb.collection('Chemikart_Qoute').create(data);
    return { status: 200, body: { success: true, record } };
  } catch (error) {
    // console.error('Error updating record:', error);
    return { status: 500, body: { success: false, error: error.message } };
  }
  }

  export const submitContactForm = async (formData) => {
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        role: formData.get('role'),
        details: formData.get('details'),
        location: formData.get('location'),
    };
  
    try {
        await pb.admins.authWithPassword(`${DB_USER}`, `${DB_PASS}`)
        const record = await pb.collection('ContactRequests').create(contactData);
        return {
            success: true,
            record
        };
    } catch (error) {
      console.log(error.response.data);
        return {
            success: false,
            error: error.response.data || 'An error occurred while submitting your form.',
        };
    }
  };

  export async function load({}) {
    await pb.admins.authWithPassword(email, password);
    const records = await pb.collection('Cart').getFullList(200, {
        sort: '-created',
    });

    const results = records.map(record => {
        return {
            id: record.id,
            name: record.name,
            code: record.code,
            description: record.description,
            price: record.price,
            image: record.image
        };
    });

    return {
        records: results
    };
}