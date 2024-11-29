import Contact from "$lib/server/models/Contact.js";
import Order from "$lib/server/models/Order.js";
import Products from "$lib/server/models/Products";
import CopyConsent from "../lib/server/models/CopyConsent.js"; // Adjust the path to your model
import Register from "$lib/server/models/Register";
import ChemiDashProfile from "$lib/server/models/ChemiDashProfile";
import MyFavourites from "$lib/server/models/MyFavourites";
import Stock  from '$lib/server/models/Stocks.js'; 
import { redirect } from "@sveltejs/kit";

export const submitContactInfo = async (data) => {
  try {
    const newContact = new Contact(data); // Create a new instance of the ContactUS model
    const savedContact = await newContact.save(); // Save the document to the database
    return savedContact; // Return the saved document
  } catch (error) {
    console.error("Error saving contact info:", error);
    throw new Error("Failed to save contact information");
  }
};

export const getOrderresultData = async (body) => {
  const records = await Order.findOne({ ordernumber: body.orderNumber });
  if (records) {
    return {
      success: true,
      msg: "Success",
      order: JSON.parse(JSON.stringify(records)),
    };
  } else {
    return { success: false, message: "Order not found" };
  }
};

export const CancelOrder = async (body) => {
  const { recordId, status } = body;
  console.log("body", body);

  const updatedOrder = await Order.findByIdAndUpdate(
    recordId,
    { status: status },
    { new: true }
  );

  if (updatedOrder) {
    return { message: "Order Cancellation Submitted" };
  } else {
    return { message: "Order not found" };
  }
};

export async function checkavailabilityproduct(data) {
  const { ProductId, quantity: requestedQuantity } = data;
  const requestedQty = parseInt(requestedQuantity, 10);
    const stockRecord = await Stock.findOne({ partNumber: ProductId }).exec();
    // console.log('stockRecord:', stockRecord);
    if (!stockRecord) {
      return {message: 'Out of stock',message1: '',stock: 'Unavailable',type: 'error',};
    }
    const { stockQuantity, estimatedDate } = stockRecord;
    const estimatedDateObj = new Date(estimatedDate);
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(estimatedDateObj);
    if (stockQuantity > 0) {
      if (requestedQty <= stockQuantity) {
        return {message: `${requestedQty} Available to ship on ${formattedDate}.`,message1: '',stock: 'Available',type: 'success',
        };
      } else {
        const unavailableQuantity = requestedQty - stockQuantity;
        const leadTimeDate = new Date(estimatedDateObj);
        leadTimeDate.setDate(leadTimeDate.getDate() + 15);
        const formattedLeadTimeDate = new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(leadTimeDate);
        return {
          message: `${stockQuantity} Available to ship on ${formattedDate}.`,
          message1: ` ${unavailableQuantity} Available to ship on ${formattedLeadTimeDate}.`,
          stock: 'Partial Availability',
          type: 'success',
        };
      }
    } else{
      return {message: `Out of Stock`,message1: ``,stock: 'Out of Stock',type: 'success',};
    }
}

export async function favorite(favdata, cookies) {
  const cookieValue = cookies.get('token');
  if (!cookieValue) {
    return { type: 'error', message: 'Please login to add to favorites!' };
  }
  let parsedCookie;
  parsedCookie = JSON.parse(cookieValue);
  const userProfileId = parsedCookie?.profileId;
  // console.log("userProfileId",userProfileId);
  const existingRecord = await MyFavourites.findOne({ userProfileId: userProfileId });
  // console.log("existingRecord", existingRecord);
  const favoriteItem = {
    productDesc: favdata.productDesc,
    id: favdata.id,
    imgUrl: favdata.imgUrl,
    productName: favdata.productName,
    productNumber: favdata.productNumber,
    priceSize: { price: favdata.price, size: favdata.size },
    quantity: favdata.quantity,
    stock: favdata.stock,
  };
  let updatedFavorites = [];
  let isFavorite = false;
  if (existingRecord && Array.isArray(existingRecord.favorite)) {
    updatedFavorites = existingRecord.favorite.filter(
      (item) => item.id !== favdata.id
    );
    isFavorite = updatedFavorites.length !== existingRecord.favorite.length;
  }
  if (isFavorite) {
    existingRecord.favorite = updatedFavorites;
    await existingRecord.save();
    return { type: 'success', message: 'Removed from favorites!' };
  } else {
    updatedFavorites = existingRecord
      ? [...existingRecord.favorite, favoriteItem]
      : [favoriteItem];

    if (existingRecord) {
      existingRecord.favorite = updatedFavorites;
      await existingRecord.save();
    } else {
      await MyFavourites.create({
        userProfileId,
        favorite: updatedFavorites,
      });
    }
    return { type: 'success', message: 'Added to favorites!' };
  }
}

export const checkoutOrder = async (order) => {
  try {
    const newOrder = await Order.create(order);

    if (newOrder._id) {
      return { success: true, message: "Successfully Ordered" };
    } else {
      return {
        success: false,
        message: "Something went wrong while creating order",
      };
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, message: "Something went wrong" };
  }
};

export const getUpdatedCartData = async (product) => {
  const productNumbers = product.split(",");
  let productObj = [];
  for (let num of productNumbers) {
    try {
      const record = await Products.findOne(
        { productNumber: num },
        { productNumber: 1, priceSize: 1, _id: 0 }
      );
      if (record) {
        productObj.push(record);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  console.log(productObj);
  return JSON.stringify(productObj);
};

export async function login(body, cookies) {
  const { email, password } = body;

  const user = await Register.findOne({ email, password });

  if (user) {
    const profile = await ChemiDashProfile.findOne({ userId: user._id });
    console.log("profile", profile);
    if (profile) {
      cookies.set(
        "token",
        JSON.stringify({
          email: user.email,
          profileId: profile._id,
          userId: user._id,
        }),
        {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 1000, // 1 day
        }
      );

      // Redirect to the profile page
      return redirect(302, "/profile");
    } else {
      return { success: false, message: "Profile not found" };
    }
  } else {
    return {
      success: false,
      message: "Failed to login, please check your email and password",
    };
  }
}

export async function register(body, cookies) {
  const data = body;
  let isRedirect = false;

  // Default site preferences
  let sitePreferences = {
    noOfOrdersPerPage: 3,
    noOfQuickOrderFields: 3,
    noOfQuotesPerPage: 3,
    productEntryType: "Manual Entry",
  };

  try {
    const findUser = await Register.findOne({
      email: data.email,
      password: data.password,
    });
    if (findUser !== null) {
      return { success: false, message: "User already exist" };
    }

    const user = await Register.create(data);
    const profile = await ChemiDashProfile.create({
      userId: user._id,
      email: user.email,
      sitePreferences,
    });

    user.chemiDashProfileId = profile._id;
    await user.save();

    cookies.set(
      "token",
      JSON.stringify({
        email: user.email,
        profileId: profile._id,
        userId: user._id,
      }),
      {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 1000, // 1 day
      }
    );

    await MyFavourites.create({ userProfileId: profile._id });
    isRedirect = true;

    // if (verificationResult.success) {
    //     return { success: true, message: "Check your email to verify your email address" };
    // } else {
    //     return { success: false, message: "Verification email was not sent" };
    // }
  } catch (error) {
    console.log("Error during registration:", error);
    return { success: false, message: "An error occurred during registration" };
  }
  if (isRedirect) {
    return redirect(302, "/profile");
  }
}

// profile action functions
export async function editProfileContact(body) {
  const { recordId, ...contact } = body;

  try {
    const result = await ChemiDashProfile.findByIdAndUpdate(recordId, contact, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that validation is run
    });

    // Check if a record was updated
    if (result) {
      return { success: true, message: "Updated contact information" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any potential errors that might occur
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfileLinkOrganization(body) {
  const { recordId, ...linkOrganization } = body;

  try {
    // Find the record by recordId and update the linkOrganization field
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      { linkOrganization }, // Set the linkOrganization field
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    // Check if a record was found and updated
    if (result) {
      return { success: true, message: "Updated organization link" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any potential errors
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfileAddresses(body) {
  const { recordId, addressType, ...address } = body;
  let updateField;

  // Determine the update field based on addressType
  switch (addressType) {
    case "organization":
      updateField = { organizationAddress: address };
      break;
    case "shipping":
      updateField = { shippingAddress: address };
      break;
    case "billing":
      updateField = { billingAddress: address };
      break;
    case "payment":
      updateField = { paymentAddress: address };
      break;
    default:
      return { success: false, message: "Invalid address type" };
  }

  try {
    // Perform the update based on the addressType
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      updateField, // Update the correct address field
      { new: true, runValidators: true } // Return the updated document and validate
    );

    // Check if the record was updated
    if (result) {
      return {
        success: true,
        message: `Updated ${addressType} address successfully`,
      };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any errors
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfileSitePreferences(body) {
  const { recordId, preferences } = body;

  // Parse the preferences string into a JavaScript object
  let sitePreferences;
  try {
    sitePreferences = JSON.parse(preferences);
  } catch (error) {
    return { success: false, message: "Invalid preferences format" };
  }

  try {
    // Perform the update in the ChemiDashProfile collection
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      { sitePreferences }, // Update the sitePreferences field with the parsed object
      { new: true, runValidators: true } // Return the updated document and apply schema validation
    );

    // Check if the record was updated
    if (result) {
      return { success: true, message: "Updated site preferences" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any errors that occur during the update
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfilePaymentMethod(body) {
  const { recordId, ...paymentMethods } = body;

  try {
    // Perform the update in the ChemiDashProfile collection
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      { paymentMethods }, // Update the paymentMethods field
      { new: true, runValidators: true } // Return the updated document and apply schema validation
    );

    // Check if the record was updated
    if (result) {
      return { success: true, message: "Updated payment methods" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any errors that occur during the update
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfileEmailPreferences(body) {
  const { recordId, preference } = body;

  // Parse the preference string into a JavaScript object
  let emailPreferences;
  try {
    emailPreferences = JSON.parse(preference);
  } catch (error) {
    return { success: false, message: "Invalid preference format" };
  }

  try {
    // Perform the update in the ChemiDashProfile collection
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      { emailPreferences }, // Update the emailPreferences field
      { new: true, runValidators: true } // Return the updated document and apply schema validation
    );

    // Check if the record was updated
    if (result) {
      return { success: true, message: "Updated email preferences" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any errors that occur during the update
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function login(body, cookies) {
  const { email, password } = body;

  const user = await Register.findOne({ email, password });

  if (user) {
    const profile = await ChemiDashProfile.findOne({ userId: user._id });
    console.log("profile", profile);
    if (profile) {
      cookies.set(
        "token",
        JSON.stringify({
          email: user.email,
          profileId: profile._id,
          userId: user._id,
        }),
        {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 1000, // 1 day
        }
      );

      // Redirect to the profile page
      return redirect(302, "/profile");
    } else {
      return { success: false, message: "Profile not found" };
    }
  } else {
    return {
      success: false,
      message: "Failed to login, please check your email and password",
    };
  }
}

export async function register(body, cookies) {
  const data = body;
  let isRedirect = false;

  // Default site preferences
  let sitePreferences = {
    noOfOrdersPerPage: 3,
    noOfQuickOrderFields: 3,
    noOfQuotesPerPage: 3,
    productEntryType: "Manual Entry",
  };

  try {
    const findUser = await Register.findOne({
      email: data.email,
      password: data.password,
    });
    if (findUser !== null) {
      return { success: false, message: "User already exist" };
    }

    const user = await Register.create(data);
    const profile = await ChemiDashProfile.create({
      userId: user._id,
      email: user.email,
      sitePreferences,
    });

    user.chemiDashProfileId = profile._id;
    await user.save();

    cookies.set(
      "token",
      JSON.stringify({
        email: user.email,
        profileId: profile._id,
        userId: user._id,
      }),
      {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 1000, // 1 day
      }
    );

    await MyFavourites.create({ userProfileId: profile._id });
    isRedirect = true;

    // if (verificationResult.success) {
    //     return { success: true, message: "Check your email to verify your email address" };
    // } else {
    //     return { success: false, message: "Verification email was not sent" };
    // }
  } catch (error) {
    console.log("Error during registration:", error);
    return { success: false, message: "An error occurred during registration" };
  }
  if (isRedirect) {
    return redirect(302, "/profile");
  }
}

// profile action functions
export async function editProfileContact(body) {
  const { recordId, ...contact } = body;

  try {
    const result = await ChemiDashProfile.findByIdAndUpdate(recordId, contact, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that validation is run
    });

    // Check if a record was updated
    if (result) {
      return { success: true, message: "Updated contact information" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any potential errors that might occur
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfileLinkOrganization(body) {
  const { recordId, ...linkOrganization } = body;

  try {
    // Find the record by recordId and update the linkOrganization field
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      { linkOrganization }, // Set the linkOrganization field
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    // Check if a record was found and updated
    if (result) {
      return { success: true, message: "Updated organization link" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any potential errors
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfileAddresses(body) {
  const { recordId, addressType, ...address } = body;
  let updateField;

  // Determine the update field based on addressType
  switch (addressType) {
    case "organization":
      updateField = { organizationAddress: address };
      break;
    case "shipping":
      updateField = { shippingAddress: address };
      break;
    case "billing":
      updateField = { billingAddress: address };
      break;
    case "payment":
      updateField = { paymentAddress: address };
      break;
    default:
      return { success: false, message: "Invalid address type" };
  }

  try {
    // Perform the update based on the addressType
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      updateField, // Update the correct address field
      { new: true, runValidators: true } // Return the updated document and validate
    );

    // Check if the record was updated
    if (result) {
      return {
        success: true,
        message: `Updated ${addressType} address successfully`,
      };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any errors
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfileSitePreferences(body) {
  const { recordId, preferences } = body;

  // Parse the preferences string into a JavaScript object
  let sitePreferences;
  try {
    sitePreferences = JSON.parse(preferences);
  } catch (error) {
    return { success: false, message: "Invalid preferences format" };
  }

  try {
    // Perform the update in the ChemiDashProfile collection
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      { sitePreferences }, // Update the sitePreferences field with the parsed object
      { new: true, runValidators: true } // Return the updated document and apply schema validation
    );

    // Check if the record was updated
    if (result) {
      return { success: true, message: "Updated site preferences" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any errors that occur during the update
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfilePaymentMethod(body) {
  const { recordId, ...paymentMethods } = body;

  try {
    // Perform the update in the ChemiDashProfile collection
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      { paymentMethods }, // Update the paymentMethods field
      { new: true, runValidators: true } // Return the updated document and apply schema validation
    );

    // Check if the record was updated
    if (result) {
      return { success: true, message: "Updated payment methods" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any errors that occur during the update
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function editProfileEmailPreferences(body) {
  const { recordId, preference } = body;

  // Parse the preference string into a JavaScript object
  let emailPreferences;
  try {
    emailPreferences = JSON.parse(preference);
  } catch (error) {
    return { success: false, message: "Invalid preference format" };
  }

  try {
    // Perform the update in the ChemiDashProfile collection
    const result = await ChemiDashProfile.findByIdAndUpdate(
      recordId,
      { emailPreferences }, // Update the emailPreferences field
      { new: true, runValidators: true } // Return the updated document and apply schema validation
    );

    // Check if the record was updated
    if (result) {
      return { success: true, message: "Updated email preferences" };
    } else {
      return { success: false, message: "Record not found" };
    }
  } catch (error) {
    // Handle any errors that occur during the update
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}

export async function submitForm(data) {
  try {
    const formData = await data.formData();
    const formEntries = Object.fromEntries(formData.entries());
    const response = await CopyConsent.create(formEntries);
    return { status: 200, body: { success: true, response } };
  } catch (error) {
    console.error("Error saving form data:", error);
    return { status: 500, body: { success: false, error: error.message } };
  }
}
