import ViewedProduct from "$lib/server/models/AlsoViewedProducts.js";
import Profiles from "$lib/server/models/Profiles.js";
import Category from "$lib/server/models/Category";
import SubCategory from "$lib/server/models/SubCategory";
import Order from "$lib/server/models/Order";
import Products from "$lib/server/models/Products";
import PopularProduct from "$lib/server/models/PopularProduct";
import Stock  from '$lib/server/models/Stocks.js'; 
import Manufacturer from "$lib/server/models/Manufacturer";
import SubSubCategory from "$lib/server/models/SubSubcategory";


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

  export async function popularProducts() {
    const records = await PopularProduct.find({},{_id:0})
        .sort('order') 
        .populate({
            path: 'product', select: '-_id prodDesc productName imageSrc' ,
            populate: [
                { path: 'category',select:'-_id urlName' },
                { path: 'subCategory',select:'-_id urlName' } 
            ]
        });

    return JSON.parse(JSON.stringify(records));
}


export async function getSearchData(search) {
  try {
    const components = await getMatchedComponents(search)
    const categories = await getMatchedCategories(search)
    const subcategories = await getMatchedSubCategories(search)

    const allData = {
      components,
      categories,
      subcategories
    };

    return JSON.parse(JSON.stringify(allData));
  } catch (error) {
    console.error('Error fetching search data:', error);
    return { success:false,message:"Error fetching search data"}
  }
}

async function getMatchedComponents(search) {
  try {
    const queryFilter = {
      $or: [
        { productName: { $regex: search, $options: 'i' } },  
        { productNumber: { $regex: search, $options: 'i' } }, 
        { prodDesc: { $regex: search, $options: 'i' } }      
      ]
    };

    const components = await Products.find(queryFilter).limit(6).populate('category').populate('subCategory').exec(); 

    return components; 
  } catch (error) {
    console.error('Error fetching matched components:', error);
    return { success:false,message:"Error fetching matched components"}
  }
}

async function getMatchedCategories(search) {
  try {

    const queryFilter = {
      name: { $regex: search, $options: 'i' }
    };

    const categories = await Category.find(queryFilter).limit(6).exec();       
    return JSON.parse(JSON.stringify(categories)); 
  } catch (error) {
    console.error('Error fetching matched categories:', error);
    throw new Error('Error fetching matched categories');
  }
}

async function getMatchedSubCategories(search) {
  try {
    const queryFilter = {
      name: { $regex: search, $options: 'i' }
    };

    const subcategories = await SubCategory.find(queryFilter).limit(6).populate('category').exec();              

    return JSON.parse(JSON.stringify(subcategories));
  } catch (error) {
    console.error('Error fetching matched subcategories', error);
    return { success:false,message:"Error fetching matched subcategories"}
  }
}

  export async function RelatedProductData(productId) {
    const product = await Products.findOne({ productNumber: productId }).populate('subsubCategory');
  
    if (!product) {
      return { error: 'Product not found' };
    }
  
    const subsubCategoryId = product.subsubCategory._id;

    const relatedProducts = await Products.find({ 'subsubCategory': subsubCategoryId })
    .limit(8).populate('category')
    .populate('subCategory')
    .populate('manufacturerName')
    .populate('subsubCategory');
  
    if (relatedProducts.length === 0) {
      return { error: 'No related products found' };
    }

    const relatedProductsJson = JSON.parse(JSON.stringify(relatedProducts));
  
    for (let relatedProduct of relatedProductsJson) {
  
      const stockData = await Stock.findOne({ 'partNumber.productNumber': relatedProduct.productNumber });
  
      if (!stockData) {
        relatedProduct.stockQuantity = 0; 
      } else {
        relatedProduct.stockQuantity = stockData.stockQuantity || 0; 
      }
  
    }
    return relatedProductsJson; 
}

export const loadProductsubcategory = async (suburl, page = 1) => {
  try {
     
      const subcategory = await SubCategory.findOne({ urlName: suburl })
          .populate('category');  

      if (!subcategory) {
          return { type: 'error', message: `Subcategory not found for URL: ${suburl}` };
      }

      const subcategoryID = subcategory._id.toString();
      const productPageSize = 20;

   
      const productData = await Products.find({ subCategory: subcategoryID })
          .skip((page - 1) * productPageSize)
          .limit(productPageSize)
          .populate('subCategory')
          .populate('category') 
          .populate('manufacturerName')
          .populate('subsubCategory');
          console.log("i am producr",productData);
          

      // Check if products exist
      if (productData.length === 0) {
          return { type: 'error', message: 'No products found for this subcategory.' };
      }

      // Fetch stock data
      const stockData = await Stock.find({}).populate('partNumber');

      // Map the product data to include the stock quantity and category name
      const productNames = productData.map(product => {
          const stock = stockData.find(
              stockItem => stockItem.partNumber?._id.toString() === product._id.toString()
          );

          return {
              ...product.toObject(),
              manufacturerName: product.manufacturerName?.name || 'Unknown Manufacturer',
              // Accessing populated 'category' field with lowercase 'category'
              category: product.category ? product.category.name : 'Unknown Category',  // Accessing 'name' from populated category field
              subsubCategory: product.subsubCategory?.name || 'Unknown Subsubcategory',
              stockQuantity: stock ? stock.stockQuantity : 0,
          };
      });

      return {
          type: 'success',
          records: productNames,
          nextPage: productData.length === productPageSize ? page + 1 : null,
      };
  } catch (error) {
      console.error('Error loading product subcategory:', error);
      return { type: 'error', message: 'An error occurred while loading product data.' };
  }
};
