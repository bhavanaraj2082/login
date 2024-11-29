import ViewedProduct from "$lib/server/models/AlsoViewedProducts.js";
import ChemiDashProfile from "./models/ChemiDashProfile";
import Category from "$lib/server/models/Category";
import SubCategory from "$lib/server/models/SubCategory";
import Order from "$lib/server/models/Order";
import Products from "$lib/server/models/Products";
import Stock  from '$lib/server/models/Stocks.js'; 

export async function getProductdatas() {
  const records = await Category.find();
  if (records.length > 0) {
    return { records: JSON.parse(JSON.stringify(records)) };
  } else {
    return { error: "Products not found" };
  }
}

export async function getSubCategoryDatas(subid) {

    const category = await Category.findOne({ urlName: subid });
    if (!category) {
      return { error: "No Category found with the specified urlName" };
    }
    const records = await SubCategory.find({ 'category': category._id }).populate('category');

    return records.length > 0 
    ?  {records : JSON.parse(JSON.stringify(records))}
     : {error: "No SubCategories found matching the category" };
}


export async function getOrderStatusData(ordernumber) {

    const records = await Order.findOne({ ordernumber: ordernumber }).populate('products');
    if (records) {
      return { order: JSON.parse(JSON.stringify(records)) }; 
    } else {
      return { error: 'Order not found' };
    }
}

export async function fetchViewedProducts() {
  try {
    const records = await ViewedProduct.find().sort({ createdAt: -1 });
    const updatedRecords = records.map((record) => {
        const imgUrl = record.image; 
        return {
          ...record.toObject(),
          image: imgUrl,
        };
      });
      return JSON.parse(JSON.stringify(updatedRecords));
  } catch (error) {
    console.error("Error fetching viewed products:", error);
    throw new Error("Failed to fetch viewed products");
  }
}

export async function loadProductsInfo(productId) {
  // console.log(productId);
        const product = JSON.parse(JSON.stringify(await Products.findOne({ productNumber: productId })));
        // console.log('Product:', [product]);
        if (!product) {
            return {type: "error",message: "Product record not found",};
        }
        const partNumber = product._id;
        // console.log("PartNumber for stock data:", partNumber);
        let stockQuantity = 0;
        if (partNumber) {
                const stockRecord = await Stock.findOne({ partNumber: product._id}).exec();
                // console.log("Fetched stockRecord:", stockRecord);
                if (stockRecord && typeof stockRecord.stockQuantity !== "undefined") {
                    stockQuantity = stockRecord.stockQuantity;
                    // console.log("Stock Quantity fetched:", stockQuantity);
                } else {
                    // console.log("Stock record found but stockQuantity is undefined.");
                }}
        const formattedRecord = {
            productId: product._id.toString(),
            productName: product.productName,
            productNumber: product.productNumber,
            prodDesc: product.prodDesc,
            imageSrc: product.imageSrc,
            safetyDatasheet: product.safetyDatasheet,
            priceSize: Array.isArray(product.priceSize)
                ? product.priceSize.map((item) => ({
                      price: item.price,
                      size: item.size,
                  }))
                : [],
            properties: product.properties || {},
            description: product.description || {},
            safetyInfo: product.safetyInfo || {},
            filteredProductData: product.filteredProductData || {},
            productSynonym: product.filteredProductData?.['Synonym(S)'] || "",
            stockQuantity, 
        };
        return {records: [formattedRecord],};
};

export const isProductFavorite = async (productNumber, cookies) => {
  const cookieValue = cookies.get('token');
  let isFavorite = false;
  if (!cookieValue) {
    console.error('User is not logged in.');
    return isFavorite; 
  }
  const parsedCookie = JSON.parse(cookieValue);
  const userProfileId = parsedCookie.profileId;
    const existingRecord = await MyFavourites.findOne({ userProfileId: userProfileId });
    if (existingRecord && Array.isArray(existingRecord.favorite)) {
      isFavorite = existingRecord.favorite.some(
        (item) => item.productNumber === productNumber
      );
    }
  return isFavorite;
};

  export async function getProfileDetails(userEmail) {
    try {
      const record = await ChemiDashProfile.findOne({ email: userEmail })
      if (record) {
        return { profileData:JSON.parse(JSON.stringify(record)) };
      } else {
        return { success:false, message: "Profile not found" };
      }
    } catch (error) {
      return { success: false, message: "Something went wrong", error: error.message };
    }
  }
