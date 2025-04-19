import ViewedProduct from "$lib/server/models/AlsoViewedProduct.js";
import Profile from "$lib/server/models/Profile.js";
import Category from "$lib/server/models/Category.js";
import SubCategory from "$lib/server/models/SubCategory.js";
import Order from "$lib/server/models/Order.js";
import Product from "$lib/server/models/Product.js";
import PopularProduct from "$lib/server/models/PopularProduct.js";
import Stock from "$lib/server/models/Stock.js";
import Manufacturer from "$lib/server/models/Manufacturer.js";
import SubSubCategory from "$lib/server/models/SubSubcategory.js";
import Shipment from "$lib/server/models/Shipment.js";
import TokenVerification from "$lib/server/models/TokenVerification.js";
import Return from "$lib/server/models/Return.js";
import MyFavourite from "$lib/server/models/MyFavourite.js";
import Curconversion from "$lib/server/models/Curconversion.js";
import Newsroom from '$lib/server/models/Newsroom';
import User from "$lib/server/models/User.js";
import Quotes from "$lib/server/models/Quotes.js";
import Cart from "$lib/server/models/Cart.js";
import Returns from "$lib/server/models/Return.js"
import { error } from "@sveltejs/kit";

export async function getProductdatas() {
  const records = await Category.find();
  
  if (records.length === 0) {
    throw { status: 404, message: "Product not found" };
  }
  return JSON.parse(JSON.stringify(records));
}

export async function getSubCategoryDatas(subid) {
  try {
    const category = await Category.findOne({ urlName: subid });
    
    if (!category) {
      throw { status: 404, message: "No Category found with the specified urlName" };
    }
    
    const records = await SubCategory.find({ category: category._id }).populate("category");
    
    if (records.length === 0) {
      throw { status: 404, message: "No SubCategories found matching the category" };
    }
    
    return { records: JSON.parse(JSON.stringify(records)) };
  } catch (err) {
    console.error("Error fetching subcategory data:", err);

    if (err.status && err.body) {
      throw err;
    }
    
    throw error(err.status || 500, err.message || "Failed to retrieve subcategory data");
  }
}

export async function getOrderStatusData(ordernumber,Email) {
  try {
    const records = await Order.findOne({ orderid: ordernumber,userEmail : Email })
      .populate("products")
      .populate("shipdetails");
    if (records) {
      return { order: JSON.parse(JSON.stringify(records)) };
    } else {
      return { error: "Order not found" };
    }
  } catch (e) {
    console.error("Error fetching viewed products:", e);
    throw new Error("Failed to fetch viewed products");
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
  const product = JSON.parse(
    JSON.stringify(await Product.findOne({ productNumber: productId }))
  );
  // console.log('Product:', [product]);
  if (!product) {
    return { type: "error", message: "Product record not found" };
  }
  const partNumber = product._id;
  // console.log("PartNumber for stock data:", partNumber);
  let stockQuantity = 0;
  if (partNumber) {
    const stockRecord = await Stock.findOne({ partNumber: product._id }).exec();
    // console.log("Fetched stockRecord:", stockRecord);
    if (stockRecord && typeof stockRecord.stockQuantity !== "undefined") {
      stockQuantity = stockRecord.stockQuantity;
      // console.log("Stock Quantity fetched:", stockQuantity);
    } else {
      // console.log("Stock record found but stockQuantity is undefined.");
    }
  }
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
    productSynonym: product.filteredProductData?.["Synonym(s)"] || "",
    stockQuantity,
  };
  return { records: [formattedRecord] };
}

export const isProductFavorite = async (productNumber, locals) => {
  let authedUser = locals?.authedUser ?? {};
  const authedEmail = authedUser.email;
  if (!authedEmail) {
    return false;
  }

  const userId = authedUser.id;
  const product = await Product.findOne({ productNumber }).lean();
  if (!product) {
    console.log("Product not found:", productNumber);
    return false;
  }

  const productId = product._id.toString();
  const existingRecord = await MyFavourite.findOne({ userId }).lean();
  if (!existingRecord || !Array.isArray(existingRecord.favorite)) {
    return false;
  }

  const isFavorite = existingRecord.favorite.some(
    (item) => item.productId.toString() === productId
  );
  // console.log(isFavorite, "isFavorite");
  return isFavorite;
};

// export async function RelatedProductData(productId) {
//   try {
//     const product = await Product.findOne({ productNumber: productId }).populate("subsubCategory");
//     const productid = product._id;
//     if (!product) {
//       return { error: "Product not found" };
//     }
//     if (!product.subsubCategory) {
//       // console.warn(`No subsubCategory found for product: ${product.productName}`);
//       return [];
//     }
//     const subsubCategoryId = product.subsubCategory._id;
    
//     if (!subsubCategoryId) {
//       return [];
//     }
//     const relatedProducts = await Product.aggregate([
//       {
//         $match: { 'subsubCategory': subsubCategoryId }
//       },
//       {
//         $limit: 8
//       },
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'category',
//           foreignField: '_id',
//           as: 'categoryInfo'
//         }
//       },
//       {
//         $lookup: {
//           from: 'subcategories',
//           localField: 'subCategory',
//           foreignField: '_id',
//           as: 'subCategoryInfo'
//         }
//       },
//       {
//         $lookup: {
//           from: 'manufacturers',
//           localField: 'manufacturer',
//           foreignField: '_id',
//           as: 'manufacturerInfo'
//         }
//       },
//       {
//         $lookup: {
//           from: 'subsubcategories',
//           localField: 'subsubCategory',
//           foreignField: '_id',
//           as: 'subsubCategoryInfo'
//         }
//       },
//       {
//         $lookup: {
//           from: 'stocks',
//           localField: '_id',
//           foreignField: 'productid',
//           as: 'stockInfo'
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           productName: 1,
//           prodDesc: 1,
//           'categoryInfo.urlName': 1,
//           'subCategoryInfo.urlName': 1,
//           'manufacturerInfo.name': 1,
//           'manufacturerInfo._id': 1,
//           'subsubCategoryInfo.urlName': 1,
//           'stockInfo._id': 1,
//           'stockInfo.distributor': 1,
//           stockQuantity: { $ifNull: [{ $arrayElemAt: ['$stockInfo.stock', 0] }, 0] },
//           stockPriceSize: { $ifNull: ['$stockInfo.pricing', []] },
//           orderMultiple: { $ifNull: [{ $arrayElemAt: ['$stockInfo.orderMultiple', 0] }, 1] },
//           priceSize: 1,
//           image: 1,
//           productUrl: 1,
//           productNumber: 1,
//           variants: { $ifNull: ["$variants", []] }
//         }
//       }
//     ]);
//     let relatedProductsJson = await Promise.all(relatedProducts.map(async (item) => {
//       if (item.stockPriceSize && item.stockPriceSize.length > 0) {
//         const convertedPricing = await Promise.all(
//           item.stockPriceSize.map(async (price) => {
//             if (price.USD) {
//                         const conversionResult = await convertToINR(price);
//                         return {
//                           usd: price.USD || 0,
//                           inr: conversionResult.INR,  
//                           break: price.break,
//                           offer: price.offer || "0"
//                         };
//                       }
//             else if (price.INR) {
//               const currentRates = await conversionRates();
//               const usdRate = currentRates["USD"] ? 1/currentRates["USD"] : null;
              
//               return {
//                 inr: parseFloat(price.INR).toFixed(2),
//                 usd: usdRate ? parseFloat(price.INR * usdRate).toFixed(2) : "N/A",
//                 break: price.break,
//                 offer: price.offer || "0"
//               };
//             }
//             return price;
//           })
//         );
    
//         item.stockPriceSize = convertedPricing;
//       }
    
//       return item;
//     }));
    
//     return JSON.parse(JSON.stringify(relatedProductsJson));
//   } catch (error) {
//     console.error("Error in RelatedProductData:", error);
//     return { error: "An error occurred while fetching related products" };
//   }
// }

export async function RelatedProductData(productId) {
  try {
    const product = await Product.findOne({ productNumber: productId }).populate({
      path: "relatedProducts",
      populate: [
        { path: "category", select: "urlName" },
        { path: "subCategory", select: "urlName" },
        { path: "subsubCategory", select: "urlName" },
        { path: "manufacturer", select: "name _id" }
      ],
      select: "_id productName prodDesc priceSize image productUrl productNumber variants category subCategory subsubCategory manufacturer"
    });

    if (!product) {
      return { error: "Product not found" };
    }

    let relatedProductsJson = await Promise.all(
      product.relatedProducts.map(async (prod) => {
        const stockData = await Stock.find({ productid: prod._id }).select(
          "_id distributor stock pricing orderMultiple"
        );

        const convertedStockPriceSize = await Promise.all(
          stockData.map(async (stock) => {
            if (stock.pricing && (stock.pricing.INR || stock.pricing.USD)) {
              const convertedPricing = await Promise.all(
                [stock.pricing].map(async (price) => {
        
                  if (price.USD) {
                    const conversionResult = await convertToINR(price);
        
                    return {
                      USD: price.USD || 0,
                      INR: conversionResult.INR,
                      break: price.break,
                      offer: price.offer || "0"
                    };
                  } else if (price.INR) {
                    const currentRates = await conversionRates();
                    const usdRate = currentRates["USD"] ? 1 / currentRates["USD"] : null;        
                    const usdValue = usdRate ? parseFloat(price.INR * usdRate).toFixed(2) : "N/A";
        
                    return {
                      INR: parseFloat(price.INR).toFixed(2),
                      USD: usdValue,
                      break: price.break,
                      offer: price.offer || "0"
                    };
                  }
        
                  return price; 
                })
              );
              return { ...stock, pricing: convertedPricing };
            } else {
              return stock; 
            }
          })
        );

        return {
          productId: prod._id,
          productName: prod.productName,
          prodDesc: prod.prodDesc,
          image: prod.image,
          manufacturer: prod.manufacturer?.name || "",
          manufacturerId: prod.manufacturer?._id || "",
          category: prod.category?.urlName || "",
          subCategory: prod.subCategory?.urlName || "",
          subsubCategory: prod.subsubCategory?.urlName || "",
          productUrl: prod.productUrl,
          productNumber: prod.productNumber,
          variants: Array.isArray(prod.variants) ? prod.variants : [],
          stockId: stockData.map(stock => stock._id), 
          stock: stockData.length > 0 ? stockData[0].stock : 0, 
          distributorId: stockData.map(stock => stock.distributor),
          priceSize: convertedStockPriceSize.flatMap(stock => stock.pricing),
          orderMultiple: stockData.length > 0 ? stockData[0].orderMultiple : 1 
        };
      })
    );

    return JSON.parse(JSON.stringify(relatedProductsJson));
  } catch (error) {
    console.error("Error in RelatedProductData:", error);
    return { error: "An error occurred while fetching related products" };
  }
}

export async function popularProducts() {
  const records = await PopularProduct.find({}, { _id: 0 })
    .sort("order")
    .populate({
      path: "product",
      select: "-_id prodDesc productName imageSrc productNumber image",
      populate: [
        { path: "category", select: "-_id urlName" },
        { path: "subCategory", select: "-_id urlName" },
      ],
    });

  return JSON.parse(JSON.stringify(records));
}

export async function getSearchData(search) {
  try {
    const components = await getMatchedComponents(search);
    const categories = await getMatchedCategories(search);
    const subcategories = await getMatchedSubCategories(search);

    const allData = {
      components,
      categories,
      subcategories,
      search
    };

    return JSON.parse(JSON.stringify(allData));
  } catch (error) {
    console.error("Error fetching search data:", error);
    return { success: false, message: "Error fetching search data" };
  }
}

async function getMatchedComponents(search) {
  let cleanedQuery = search.replace(/[^\w]/g, "");
  try {
    const queryFilter = {
      $or: [
        { cleanedName: { $eq: cleanedQuery } },
        { $text: { $search: cleanedQuery } },
        { CAS: { $eq: search } }
      ],
    };

    const components = await Product.find(queryFilter)
      .limit(9)
      .populate("category")
      .populate("subCategory")
      .exec();

    return components;
  } catch (error) {
    console.error("Error fetching matched components:", error);
    return { success: false, message: "Error fetching matched components" };
  }
}

async function getMatchedCategories(search) {
  try {
    const queryFilter = {
      name: { $regex: search, $options: "i" },
    };

    const categories = await Category.find(queryFilter).limit(6).exec();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching matched categories:", error);
    throw new Error("Error fetching matched categories");
  }
}

async function getMatchedSubCategories(search) {
  try {
    const queryFilter = {
      name: { $regex: search, $options: "i" },
    };

    const subcategories = await SubCategory.find(queryFilter)
      .limit(6)
      .populate("category")
      .exec();

    return JSON.parse(JSON.stringify(subcategories));
  } catch (error) {
    console.error("Error fetching matched subcategories", error);
    return { success: false, message: "Error fetching matched subcategories" };
  }
}

// export const loadProductsubcategory = async (
//   suburl,
//   pageNum,
//   manufacturer,
//   search
// ) => {
//   const page = pageNum || 1;
//   const pageSize = 10;
//   try {
//     let be = Date.now();
//     const subcategory = await SubCategory.findOne({ urlName: suburl })
//       .populate({ path: "manufacturerIds", select: "-_id name" })
//       .populate({ path: "subSubCategoryIds", select: "-_id name urlName" });
//     let af = Date.now();
//     //console.log(af - be, "milliseconds");
//     const subCategoryDetails = {
//       name: subcategory.name,
//       urlName: subcategory.urlName,
//     };
//     if (!subcategory) {
//       return {
//         type: "error",
//         message: `Subcategory not found for URL: ${suburl}`,
//       };
//     }

//     const matchCondition = {
//       "subCategoryDetails.urlName": subcategory.urlName,
//       inStock: { $exists: true, $gt: 0 },
//     };

//     if (manufacturer) {
//       matchCondition["manufacturerDetails.name"] = manufacturer;
//     }
//     if (search) {
//       matchCondition.$or = [
//         { CAS: { $regex: search, $options: "i" } },
//         { productNumber: { $regex: search, $options: "i" } },
//         { productName: { $regex: search, $options: "i" } },
//       ];
//     }

//     const before = Date.now();
//     const products = await Product.aggregate([
//       {
//         $lookup: {
//           from: "subcategories",
//           localField: "subCategory",
//           foreignField: "_id",
//           as: "subCategoryDetails",
//         },
//       },
//       {
//         $lookup: {
//           from: "manufacturers",
//           localField: "manufacturer",
//           foreignField: "_id",
//           as: "manufacturerDetails",
//         },
//       },
//       { $match: matchCondition },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "categoryDetails",
//         },
//       },

//       {
//         $lookup: {
//           from: "stocks",
//           localField: "_id",
//           foreignField: "productid",
//           as: "stockDetails",
//         },
//       },

//       { $unwind: "$stockDetails" },
//       { $unwind: "$manufacturerDetails" },
//       { $unwind: "$categoryDetails" },
//       { $unwind: "$subCategoryDetails" },
//       {
//         $project: {
//           productNumber: 1,
//           productName: 1,
//           prodDesc: 1,
//           imageSrc: 1,
//           "categoryDetails.name": 1,
//           "categoryDetails.urlName": 1,
//           "manufacturerDetails.name": 1,
//           "stockDetails.pricing": 1,
//           "stockDetails.stock": 1,
//           "stockDetails.orderMultiple": 1,
//         },
//       },
//       {
//         $skip: (Number(page) - 1) * Number(pageSize),
//       },
//       {
//         $limit: Number(pageSize),
//       },
//     ]);
//     const after = Date.now();


//     const filtered = await Promise.all( products.map(async(product) => {
//       const {
//         _id,
//         productName,
//         productNumber,
//         prodDesc,
//         imageSrc,
//         stockDetails,
//         manufacturerDetails,
//         categoryDetails,
//       } = product;
//       const priceConversion = await convertToINR(stockDetails.pricing) 
//       return {
//         _id,
//         productName,
//         productNumber,
//         prodDesc,
//         imageSrc,
//         pricing: priceConversion[0],
//         totalPrice: priceConversion[0].INR*stockDetails.orderMultiple,
//         quantity: stockDetails.orderMultiple,
//         orderMultiple: stockDetails.orderMultiple,
//         categoryDetails,
//         subCategoryDetails,
//         manufacturerDetails,
//       };
//     })
//   )
//     return {
//       products: JSON.parse(JSON.stringify(filtered)),
//       manufacturers: JSON.parse(JSON.stringify(subcategory.manufacturerIds)),
//       productCount: subcategory.productCount,
//       subSubCategory: JSON.parse(JSON.stringify(subcategory.subSubCategoryIds)),
//     };
//   } catch (error) {
//     console.error("Error loading product subcategory:", error);
//     return {
//       type: "error",
//       message: "An error occurred while loading product data.",
//     };
//   }
// };

export const loadProductsubcategory = async (
  suburl,
  pageNum,
  manufacturer,
  search,
  price,
  userId,
  filter
) => {
  const page = pageNum || 1;
  const pageSize = 10;
  try {
    const subcategory = await SubCategory.findOne({ urlName: suburl })
      .populate({ path: "manufacturerIds", select: "-_id name" })
      .populate({ path: "subSubCategoryIds", select: "-_id name urlName" })
      .populate({ path: "category", select: "-_id name urlName" });
    const subCategoryDetails = {
      subCatName: subcategory?.name,
      subCatUrlName: subcategory?.urlName,
      catName:subcategory?.category.name,
      catUrlName:subcategory?.category.urlName,
      specifications: subcategory?.specifications,
    };
    if (!subcategory?.name || !subcategory?.urlName) {
      throw error(404, "Subcategory not found for URL")
    }

    let matchCondition = {
        subCategory: subcategory._id,
      // inStock: { $exists: true, $gt: 0 },
    };

    if (manufacturer) {
      matchCondition.manufacturerName = manufacturer;
    }
    if (search) {
      matchCondition.$or = [
        { CAS: { $regex: search, $options: "i" } },
        { productNumber: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
      ];
    }
    if(Object.entries(filter).length>0){
      matchCondition.$or = [ filter]
    }

    let sortConditions = {}

    if(price === "asc"){
      sortConditions = {}
      sortConditions.isEmptyPricing = 1
      sortConditions["stockDetails.pricing.USD"] = 1
      sortConditions["stockDetails.pricing.INR"] = 1
    }else if(price === "desc"){
      sortConditions = {}
      sortConditions.isEmptyPricing = 1
      sortConditions["stockDetails.pricing.USD"] = -1
      sortConditions["stockDetails.pricing.INR"] = -1
    }else{
      sortConditions = {}
      sortConditions.isEmptyPricing = 1
      sortConditions["productNumber"] = 1;
    }
     
    const aggregation = [
      { $match: matchCondition },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategoryDetails",
        },
      },
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturer",
          foreignField: "_id",
          as: "manufacturerDetails",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "stocks",
          let: { productId: "$_id" },  // use let to pass local field to the pipeline
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$productid", "$$productId"] },  // match the stock with product id
              },
            },
            { $project: { _id: 1, pricing: 1, stock: 1, orderMultiple: 1, distributor: 1 } },  // choose fields you need
          ],
          as: "stockDetails",
        },
      },
      
      { $unwind: { path: "$stockDetails", preserveNullAndEmptyArrays: true } },
      { $unwind: "$manufacturerDetails" },
      { $unwind: "$categoryDetails" },
      { $unwind: "$subCategoryDetails" },
      {
        $addFields: {
          // Check if pricing is an empty object
          isEmptyPricing: {
            $cond: {
              if:                                                                                                                                                  {
                $eq: [
                  { $size: { $objectToArray: { $ifNull: ["$stockDetails.pricing", {}] } } }, 0
                ], // If pricing is an empty object
              },
              then: true,
              else: false,
            },
          },
        },
      },
    ];
    if (subcategory.name !== "Primary Antibodies" && subcategory.name !== "Uncategorized") {
      aggregation.push({ $sort: sortConditions });
    }
    aggregation.push(
      {
        $skip: (Number(page) - 1) * Number(pageSize),
      },
  
      {
        $limit: Number(pageSize),
      },
  
      {
        $facet: {
          data: [
         
            {
              $project: {
                productNumber: 1,
                productName: 1,
                prodDesc: 1,
                image: 1,
                variants:1,
                "categoryDetails.name": 1,
                "categoryDetails.urlName": 1,
                "manufacturerDetails.name": 1,
                "manufacturerDetails._id": 1,
                "stockDetails._id": 1,
                "stockDetails.pricing": 1,
                "stockDetails.stock": 1,
                "stockDetails.orderMultiple": 1,
                "stockDetails.distributor": 1,
              },
            },
          ],
        },
      },
    );
    
    const products = await Product.aggregate(aggregation);
    
    const totalCount = await Product.countDocuments(matchCondition);
    console.log("products",JSON.stringify(products,null,2));
    const profile = await Profile.findOne({userId},{firstName:1,lastName:2,cellPhone:1,email:1,isEmailVerified:1,companyName:1,_id:0})
    

   if(!products[0]?.data?.length && !products[0]?.totalCount?.length ){
    return {
      products: [],
      manufacturers: JSON.parse(JSON.stringify(subcategory.manufacturerIds)),
      productCount: totalCount,
      subSubCategory: JSON.parse(JSON.stringify(subcategory.subSubCategoryIds)),
      subCategoryDetails,
      specifications:  subcategory?.specifications ? JSON.parse(JSON.stringify(subcategory?.specifications)) : {},
      profile:JSON.parse(JSON.stringify(profile))
    };
   }

    const filtered = await Promise.all(products[0].data.map(async(product) => {
      const {
        _id,
        productName,
        productNumber,
        prodDesc,
        image,
        variants,
        stockDetails={},
        manufacturerDetails,
        categoryDetails,
      } = product;
      const priceConversion = await convertToINR(stockDetails.pricing)
      return {
        _id,
        productName,
        productNumber,
        prodDesc,
        image,
        variants,
        pricing: priceConversion,
        totalPrice:{ priceINR:priceConversion.INR*stockDetails.orderMultiple,priceUSD:priceConversion.USD*stockDetails.orderMultiple},
        quantity: stockDetails.orderMultiple,
        orderMultiple: stockDetails.orderMultiple,
        distributorId: stockDetails.distributor,
        stock: stockDetails.stock,
        stockId: stockDetails._id,
        categoryDetails,
        subCategoryDetails,
        manufacturerDetails,
      };
    })
  )
    return {
      products: JSON.parse(JSON.stringify(filtered)),
      manufacturers: JSON.parse(JSON.stringify(subcategory.manufacturerIds)),
      productCount: totalCount,
      subCategoryDetails,
      subSubCategory: JSON.parse(JSON.stringify(subcategory.subSubCategoryIds)),
      specifications: subcategory?.specifications ? JSON.parse(JSON.stringify(subcategory?.specifications)) : {},
      profile:JSON.parse(JSON.stringify(profile))
    };
  } catch (err) {
    console.error("Error loading product subcategory:", err);
    
    if (err.status && err.body) {
      throw err;
    }

    throw error(err.status || 500, err.message || "Failed to load product subcategory");
  }
};

export async function RelatedApplicationData(name) {
  // console.log("name",name);
  
  try {
    const queryFilter = {
      $or: [
        {
          description: {
            $elemMatch: {
              $regex: name, // Match the value inside each object
              $options: "i" // Case-insensitive search
            }
          }
        },
        { "subsubCategory.name": { $regex: name, $options: "i" } },
        { "subCategory.name": { $regex: name, $options: "i" } },
      ],
    };

    const relatedProducts = await Product.aggregate([
      {
          $match: queryFilter // Match the query filter for relevant products
      },
      {
          $limit: 8 // Limit the number of products returned
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategoryInfo'
        }
      },
      {
        $lookup: {
          from: 'manufacturers',
          localField: 'manufacturer',
          foreignField: '_id',
          as: 'manufacturerInfo'
        }
      },
      {
        $lookup: {
          from: 'subsubcategories',
          localField: 'subsubCategory',
          foreignField: '_id',
          as: 'subsubCategoryInfo'
        }
      },
      {
        $lookup: {
          from: 'stocks',
          localField: 'productNumber',
          foreignField: 'productNumber',
          as: 'stockInfo'
        }
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          prodDesc: 1,
          'categoryInfo.urlName': 1,
          'subCategoryInfo.urlName': 1,
          'manufacturerInfo.name': 1,
          'manufacturerInfo._id': 1,
          'subsubCategoryInfo.urlName': 1,
          'stockInfo._id': 1,
          'stockInfo.distributor': 1,
          stockQuantity: { $ifNull: [{ $arrayElemAt: ['$stockInfo.stock', 0] }, 0] },
          stockPriceSize: { $ifNull: ['$stockInfo.pricing', []] },
          orderMultiple: { $ifNull: [{ $arrayElemAt: ['$stockInfo.orderMultiple', 0] }, 1] },
          priceSize: 1,
          imageSrc: 1,
          productUrl: 1,
          productNumber: 1,
          variants: { $ifNull: ["$variants", []] }
        }
      }
  ]);
  
  let relatedProductsJson = await Promise.all(relatedProducts.map(async (item) => {
    if (item.stockPriceSize && item.stockPriceSize.length > 0) {
      const convertedPricing = await Promise.all(
        item.stockPriceSize.map(async (price) => {
          if (price.USD) {
                      const conversionResult = await convertToINR(price);
                      return {
                        usd: price.USD || 0,
                        inr: conversionResult.INR,  
                        break: price.break,
                        offer: price.offer || "0"
                      };
                    }
          else if (price.INR) {
            const currentRates = await conversionRates();
            const usdRate = currentRates["USD"] ? 1/currentRates["USD"] : null;
            
            return {
              inr: parseFloat(price.INR).toFixed(2),
              usd: usdRate ? parseFloat(price.INR * usdRate).toFixed(2) : "N/A",
              break: price.break,
              offer: price.offer || "0"
            };
          }
          return price;
        })
      );
  
      item.stockPriceSize = convertedPricing;
    }
  
    return item;
  }));
  
  return JSON.parse(JSON.stringify(relatedProductsJson));
} catch (error) {
  console.error("Error in RelatedProductData:", error);
  return { error: "An error occurred while fetching related products" };
}
}

export const verifyEmailToken = async (token) => {
  const verifyToken = await TokenVerification.findOne({ token });
  if (verifyToken !== null) {
    if (Date.now() >= verifyToken.expiry.getTime()) {
      return {
        success: false,
        message: "token has expired. please verify your email again",
      };
    } else {
      await Profile.updateOne(
        { email: verifyToken.email },
        { isEmailVerified: true }
      );
      return { success: true, message: "Email is verified successfully" };
    }
  } else {
    return { success: false, message: "Token is not found " };
  }
};

export const verifyPasswordToken = async (token) => {
  try {
    const verifyToken = await TokenVerification.findOne({ token });
    console.log(verifyToken, token);
    if (verifyToken !== null) {
      if (Date.now() >= verifyToken.expiry.getTime()) {
        return {
          success: false,
          message: "token has expired. please verify again",
        };
      } else {
        return {
          success: true,
          message: "Token is verified successfully",
          token: JSON.parse(JSON.stringify(verifyToken)),
        };
      }
    } else {
      return { success: false, message: "Token is not found " };
    }
  } catch (error) {
    console.error("Error fetching order status:", error);
    return { error: "Error in fetching orderStatus Data" };
  }
};

// returns starts
export async function getreturnstatusdata(invoiceid) {
  try {
    const records = await Order.findOne({
      invoice: invoiceid,
    })
      .populate("profileId")
      .populate("shipdetails");
    if (records) {
      return JSON.parse(JSON.stringify(records));
    } else {
      return { error: "Error in fetching orderStatus Data" };
    }
  } catch (error) {
    console.error("Error fetching order status:", error);
    return { error: "Error in fetching orderStatus Data" };
  }
}
export async function getReturnSavedData(invoiceid) {
  try {
    const records = await Return.find({ invoiceNumber: invoiceid });
    return JSON.parse(JSON.stringify(records));
  } catch (error) {
    console.error("Error fetching saved returns:", error);
    return { error: "Error fetching saved returns data" };
  }
}
// returns ends

//CurrencyConversion Starts
export async function conversionRates() {
  try {
    const records = await Curconversion.find({})
		.sort({ updatedAt: 1 })  
		.lean();;

    const rates = records.reduce((acc, record) => {
      acc[record.currency] = record.rate;
      return acc;
    }, {});
      // console.log("rates...===>", rates);
    return rates;
  } catch (error) {
    console.error("Error fetching conversion rates:", error);
    return {};
  }
}

export async function convertToINR(pricing) {
  if (typeof pricing !== 'object' || pricing === null) return {}; 

  const currentRates = await conversionRates(); 
  const newPriceItem = { ...pricing }; 

  const { break: breakPoint, offer, ...currencies } = pricing;

  newPriceItem.break = breakPoint;
  if (offer !== undefined) newPriceItem.offer = offer;

  if (currencies.INR) {
    newPriceItem.INR = currencies.INR;
    newPriceItem.USD = Number(currencies.INR / currentRates.USD); 
    return newPriceItem;
  }

  for (const [currency, amount] of Object.entries(currencies)) {
    if (currentRates[currency]) {
      newPriceItem.INR = Number(amount * currentRates[currency]);
      return newPriceItem; 
    }
  }
  return pricing; 
}

export async function DifferentProds(productId) {
  const product = JSON.parse(
    JSON.stringify(
      await Product.findOne({ productNumber: productId }).populate("manufacturer")
    )
  );

  if (!product) {
    throw new Error("Product not found");
  }

  const productid = product._id;
  const CAS = product.CAS;

  let stockQuantity = 0;
  let orderMultiple = 0;
  let orderedQty = 0;
  let availableStock = 0;
  let priceSize = [];
  let stockId = [];
  let stock = 0;
  let distributorId = "";
  let sku = [];
  let pricingStockId = "";

  if (productid) {
    const stockRecords = await Stock.find({ productid }).exec();

    if (stockRecords.length > 0) {
      for (const stockRecord of stockRecords) {
        if (typeof stockRecord.stock !== "undefined") {
          stockQuantity = stockRecord.stock;
          orderMultiple = stockRecord.orderMultiple;
          orderedQty = stockRecord.orderedQty;
          pricingStockId = stockRecord._id.toString();
          availableStock = stockQuantity - orderedQty;
          if (stockRecord.sku) {
            sku.push(stockRecord.sku);
          }

          const convertedPricing = await convertToINR(stockRecord.pricing);
          const { break: breakPoint, offer, ...currencies } = stockRecord.pricing;
          let priceData = {
            break: breakPoint,
            offer: offer || undefined,
            USD: 0,
            INR: 0,
            stockQuantity: availableStock,
            pricingStockId: pricingStockId,
          };

          const currentRates = await conversionRates();
          const usdRate = currentRates["USD"] ? 1 / currentRates["USD"] : null;
          const inrRate = currentRates["USD"] || null;

          if (currencies.INR && !currencies.USD && usdRate) {
            priceData.INR = currencies.INR;
            priceData.USD = Number(currencies.INR * usdRate).toFixed(2);
          } else if (currencies.USD && !currencies.INR && inrRate) {
            priceData.USD = currencies.USD;
            priceData.INR = Number(currencies.USD * inrRate).toFixed(2);
          } else if (currencies.INR && currencies.USD) {
            priceData.USD = currencies.USD;
            priceData.INR = currencies.INR;
          }

          priceSize.push(priceData);
          stockId.push(stockRecord._id.toString());
          distributorId = stockRecord.distributor.toString();
          stock = stockRecord.stock;
        }
      }
    }
  }

  let variantRecord = [];
  if (CAS) {
    const variants = await Product.find({ CAS, _id: { $ne: product._id } }).lean();

    if (variants.length > 0) {
      const variantIds = variants.map(v => v._id);
      const stockRecords = await Stock.find({ productid: { $in: variantIds } }).lean();
      const currentRates = await conversionRates();
      const usdRate = currentRates["USD"] ? 1 / currentRates["USD"] : null;
      const inrRate = currentRates["USD"] || null;

      const stockByProductId = {};
      stockRecords.forEach(stock => {
        const pid = stock.productid?.toString();
        if (!stockByProductId[pid]) stockByProductId[pid] = [];
        stockByProductId[pid].push(stock);
      });

      variantRecord = variants.map(variant => {
        const stocks = stockByProductId[variant._id.toString()] || [];

        let variantPricing = [];
        let variantStockId = "";
        let variantAvailableStock = 0;
        let variantOrderMultiple = 1;
        let variantDistributorId = "";
        let variantManufacturerId = "";

        for (const stock of stocks) {
          const variantStockQuantity = stock?.stock || 0;
          const variantOrderedQty = stock?.orderedQty || 0;
          variantAvailableStock = variantStockQuantity - variantOrderedQty;
          variantOrderMultiple = stock.orderMultiple || 1;
          variantStockId = stock._id?.toString() || "";
          variantDistributorId = stock.distributor?.toString() || "";
          variantManufacturerId = stock.manufacturer?.toString() || "";

          if (stock.pricing) {
            const { break: breakPoint, offer, ...variantCurrencies } = stock.pricing;

            let variantPriceData = {
              break: breakPoint,
              offer: offer || undefined,
              USD: 0,
              INR: 0,
              productid: variant._id?.toString() || "",
              manufacturerId: variantManufacturerId,
              distributorId: variantDistributorId,
              stockId: variantStockId,
            };

            if (variantCurrencies.INR && !variantCurrencies.USD && usdRate) {
              variantPriceData.INR = variantCurrencies.INR;
              variantPriceData.USD = Number(variantCurrencies.INR * usdRate).toFixed(2);
            } else if (variantCurrencies.USD && !variantCurrencies.INR && inrRate) {
              variantPriceData.USD = variantCurrencies.USD;
              variantPriceData.INR = Number(variantCurrencies.USD * inrRate).toFixed(2);
            } else if (variantCurrencies.INR && variantCurrencies.USD) {
              variantPriceData.USD = variantCurrencies.USD;
              variantPriceData.INR = variantCurrencies.INR;
            }

            variantPricing.push(variantPriceData);
          }
        }

        return {
          _id: variant._id?.toString() || "",
          productName: variant.productName || "--",
          prodDesc: variant.prodDesc || "--",
          description: Array.isArray(variant.description) ? variant.description : [],
          properties: variant.properties || {},
          manufacturerName: variant.manufacturerName?.toString() || "--",
          productNumber: variant.productNumber || "--",
          imageSrc: variant.image || variant.imageSrc || "",
          pricing: variantPricing,
          stockId: variantStockId,
          distributorId: variantDistributorId,
          manufacturerId: variantManufacturerId,
          stock: variantAvailableStock,
          orderMultiple: variantOrderMultiple,
        };
      });
    }
  }

  const formattedRecord = {
    productId: product?._id?.toString() || "",
    productName: product?.productName || "--",
    CAS: product?.CAS,
    productNumber: product?.productNumber || "N/A",
    prodDesc: product?.prodDesc,
    returnPolicy: product?.returnPolicy,
    imageSrc: product?.image || product?.imageSrc || "",
    safetyDatasheet: product?.safetyDatasheet || "",
    priceSize,
    properties: product?.properties || {},
    description: product?.description || {},
    safetyInfo: product?.safetyInfo || {},
    filteredProductData: product?.filteredProductData || {},
    productSynonym: product?.filteredProductData?.["Synonym(s)"] || "",
    stockQuantity: availableStock,
    availableStock,
    orderMultiple,
    manufacturer: product?.manufacturer || {},
    stockId,
    stock,
    distributorId,
    sku,
    variants: variantRecord,
  };

  return { records: [formattedRecord] };
}

//////Quick Order//////////

export const quick = async () => {
  try {
    const products = JSON.parse(
      JSON.stringify(await Product.find({}).sort({ createdAt: -1 }).limit(2000))
    );

    if (!products || products.length === 0) {
      // console.warn('No products found');
      return [];
    }
    const stocks = JSON.parse(
      JSON.stringify(await Stock.find({}).populate("productNumber").limit(2000))
    );
    // console.log(stocks);
    const productNames = products.map((product) => {
      const stock = stocks.find(
        (stockItem) => stockItem.productNumber === product.productNumber
      );
      const pricing =
        stock?.pricing.map((item) => {
          const currency = item.INR ? "INR" : item.USD ? "USD" : "N/A";
          const price = item.INR || item.USD || "N/A";
          return {
            break: item.break || "N/A",
            currency,
            price,
          };
        }) || [];
      return {
        ...product,
        stockQuantity: stock ? stock.stock : 0,
        pricing,
      };
    });

    // console.log(productNames);

    return productNames;
  } catch (error) {
    console.error("Error fetching products or stocks:", error);
    throw error;
  }
};

///Quick Order////

// export async function CompareSimilarityData(productId) {
//   try {
//     // Fetch the given product
//     const product = await Product.findOne({ productNumber: productId }).populate("subsubCategory");

//     console.log("product",product);
    
    
//     if (!product) {
//       return { error: "Product not found" };
//     }
    
//     if (!product.subsubCategory) {
//       console.warn(`No subsubCategory found for product: ${product.productName}`);
//       return [];
//     }
    
//     const subsubCategoryId = product.subsubCategory._id;
    
//     if (!subsubCategoryId) {
//       return [];
//     }

//     // Retrieve related products based on the subsubCategory
//     const relatedProducts = await Product.aggregate([
//       { $match: { 'subsubCategory': subsubCategoryId } },
//       { $limit: 3 },
//       { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'categoryInfo' } },
//       { $lookup: { from: 'subcategories', localField: 'subCategory', foreignField: '_id', as: 'subCategoryInfo' } },
//       { $lookup: { from: 'manufacturers', localField: 'manufacturer', foreignField: '_id', as: 'manufacturerInfo' } },
//       { $lookup: { from: 'subsubcategories', localField: 'subsubCategory', foreignField: '_id', as: 'subsubCategoryInfo' } },
//       { $lookup: { from: 'stocks', localField: '_id', foreignField: 'productid', as: 'stockInfo' } },
//       {
//         $project: {
//           _id: 1,
//           productName: 1,
//           prodDesc: 1,
//           properties: 1,
//           'categoryInfo.urlName': 1,
//           'subCategoryInfo.urlName': 1,
//           'manufacturerInfo.name': 1,
//           'manufacturerInfo._id': 1,
//           'subsubCategoryInfo.urlName': 1,
//           'stockInfo._id': 1,
//           'stockInfo.distributor': 1,
//           stockQuantity: { $ifNull: [{ $arrayElemAt: ['$stockInfo.stock', 0] }, 0] },
//           stockPriceSize: { $ifNull: ['$stockInfo.pricing', []] },
//           orderMultiple: { $ifNull: [{ $arrayElemAt: ['$stockInfo.orderMultiple', 0] }, 1] },
//           priceSize: 1,
//           image: 1,
//           productUrl: 1,
//           productNumber: 1,
//           variants: { $ifNull: ["$variants", []] }
//         }
//       }
//     ]);

//     // Process related products
//     let relatedProductsJson = await Promise.all(relatedProducts.map(async (item) => {
//       if (item.stockPriceSize && item.stockPriceSize.length > 0) {
//         const convertedPricing = await Promise.all(
//           item.stockPriceSize.map(async (price) => {
//             if (price.USD) {
//               const conversionResult = await convertToINR(price);
//               return {
//                 usd: price.USD || 0,
//                 inr: conversionResult.INR,  
//                 break: price.break,
//                 offer: price.offer || "0"
//               };
//             }
//             else if (price.INR) {
//               const currentRates = await conversionRates();
//               const usdRate = currentRates["USD"] ? 1 / currentRates["USD"] : null;
              
//               return {
//                 inr: parseFloat(price.INR).toFixed(2),
//                 usd: usdRate ? parseFloat(price.INR * usdRate).toFixed(2) : "N/A",
//                 break: price.break,
//                 offer: price.offer || "0"
//               };
//             }
//             return price;
//           })
//         );
//         item.stockPriceSize = convertedPricing;
//       }
//       return item;
//     }));

//     // Now include the given product in the results (assuming you want it first in the array)
//     const productJson = {
//       _id: product._id,
//       productName: product.productName,
//       prodDesc: product.prodDesc,
//       properties: product.properties || {},
//       categoryInfo: product.categoryInfo || [],
//       subCategoryInfo: product.subCategoryInfo || [],
//       manufacturerInfo: product.manufacturerInfo || [],
//       subsubCategoryInfo: product.subsubCategoryInfo || [],
//       stockInfo: product.stockInfo || [],
//       stockQuantity: product.stockQuantity || 0,
//       stockPriceSize: product.stockPriceSize || [],
//       orderMultiple: product.stockInfo?.[0]?.orderMultiple || 1,
//       priceSize: product.priceSize || [],
//       image: product.image || "",
//       productUrl: product.productUrl || "",
//       productNumber: product.productNumber || "",
//       variants: product.variants || [],
//     };

//     // Combine the given product with the related products
//     relatedProductsJson.unshift(productJson); // Adds the given product at the beginning of the list

//     return JSON.parse(JSON.stringify(relatedProductsJson));

//   } catch (error) {
//     console.error("Error in Compare similar products:", error);
//     return { error: "An error occurred while fetching related products" };
//   }
// }
export async function CompareSimilarityData(productId) {
  try {
    // Fetch the parent product using the productId
    const product = await Product.findOne({ productNumber: productId }).populate({
      path: "category",
      select: "urlName",
    }).populate({
      path: "subCategory",
      select: "urlName",
    }).populate({
      path: "subsubCategory",
      select: "urlName",
    }).populate({
      path: "manufacturer",
      select: "name _id",
    }).select(
      "_id productName prodDesc priceSize image productUrl productNumber variants category subCategory subsubCategory manufacturer properties"
    );

    // If no product is found, return an error
    if (!product) {
      return { error: "Product not found" };
    }

    // Check if the parent product has properties
    if (!product.properties || Object.keys(product.properties).length === 0) {
      return { error: "Parent product has no properties" };
    }

    // Extract the keys from the parent product's properties
    const parentPropertyKeys = Object.keys(product.properties);

    // Fetch the next 3 products based on the productNumber
    const nextProducts = await Product.find({
      productNumber: { $gt: product.productNumber }
    })
      .sort({ productNumber: 1 }) 
      .limit(3)
      .populate({
        path: "category",
        select: "urlName",
      }).populate({
        path: "subCategory",
        select: "urlName",
      }).populate({
        path: "subsubCategory",
        select: "urlName",
      }).populate({
        path: "manufacturer",
        select: "name _id",
      }).select(
        "_id productName prodDesc priceSize image productUrl productNumber variants category subCategory subsubCategory manufacturer properties"
      );

    // If no next products are found, return an error
    if (nextProducts.length === 0) {
      return { error: "No next products found" };
    }

    // Combine the given product with the next 3 products
    const allProducts = [product, ...nextProducts];

    let comproduct = await Promise.all(
      allProducts.map(async (prod) => {
        const stockData = await Stock.find({ productid: prod._id }).select(
          "_id distributor stock pricing orderMultiple"
        );

        const convertedStockPriceSize = await Promise.all(
          stockData.map(async (stock) => {
            if (stock.pricing && (stock.pricing.INR || stock.pricing.USD)) {
              const convertedPricing = await Promise.all(
                [stock.pricing].map(async (price) => {
                  if (price.USD) {
                    const conversionResult = await convertToINR(price);
                    return {
                      USD: price.USD || 0,
                      INR: conversionResult.INR,
                      break: price.break,
                      offer: price.offer || "0"
                    };
                  } else if (price.INR) {
                    const currentRates = await conversionRates();
                    const usdRate = currentRates["USD"] ? 1 / currentRates["USD"] : null;
                    const usdValue = usdRate ? parseFloat(price.INR * usdRate).toFixed(2) : "N/A";
                    return {
                      INR: parseFloat(price.INR).toFixed(2),
                      USD: usdValue,
                      break: price.break,
                      offer: price.offer || "0"
                    };
                  }
                })
              );
              return { ...stock, pricing: convertedPricing };
            } else {
              return stock;
            }
          })
        );

        // Ensure only parent product property keys are retained in the properties object
        const updatedProperties = {};
        parentPropertyKeys.forEach((key) => {
          updatedProperties[key] = prod.properties?.[key] ?? "__";
        });

        return {
          productId: prod._id,
          productName: prod.productName,
          prodDesc: prod.prodDesc,
          image: prod.image,
          properties: updatedProperties,
          manufacturer: prod.manufacturer?.name || "",
          manufacturerId: prod.manufacturer?._id || "",
          category: prod.category?.urlName || "",
          subCategory: prod.subCategory?.urlName || "",
          subsubCategory: prod.subsubCategory?.urlName || "",
          productUrl: prod.productUrl,
          productNumber: prod.productNumber,
          variants: Array.isArray(prod.variants) ? prod.variants : [],
          stockId: stockData.map(stock => stock._id),
          stock: stockData.length > 0 ? stockData[0].stock : 0,
          distributorId: stockData.map(stock => stock.distributor),
          priceSize: convertedStockPriceSize.flatMap(stock => stock.pricing),
          orderMultiple: stockData.length > 0 ? stockData[0].orderMultiple : 1
        };
      })
    );

    return JSON.parse(JSON.stringify(comproduct));

  } catch (error) {
    console.error("Error in CompareSimilarityData:", error);
    return { error: "An error occurred while fetching the next products" };
  }
}

export const getCart = async(userId,cartId)=>{
   //if(!userId) return { cart:[]}
   let matchConditions = {}
   if (userId){
    matchConditions = {
      userId,
      isActiveCart:true
    }
   }else{
    matchConditions = {
      cartId
    }
   }
  const cart = await Cart.aggregate([
    // Match the specific cart by cartId
    { $match: matchConditions },
    { $unwind: '$cartItems' },

    // Lookup components with only required fields
    {
      $lookup: {
        from: 'products',
        localField: 'cartItems.productId',
        foreignField: '_id',
        as: 'productDetails',
        pipeline: [
          {
            $project: {
              _id: 0,
              productName: 1,
              productNumber: 1,
              image: 1,
              returnPolicy:1
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: 'manufacturers',
        localField: 'cartItems.manufacturerId',
        foreignField: '_id',
        as: 'mfrDetails',
        pipeline: [
          {
            $project: {
              _id: 0,
              name:1
            }
          }
        ]
      }
    },


    // Lookup stocks with productName and distributorId conditions
    {
      $lookup: {
        from: 'stocks',
        localField:"cartItems.stockId",
        foreignField:"_id",
        pipeline:[
          {
            $project: {
              _id: 0,
              stock: 1,
              orderedQty:1,
              pricing: 1,
              orderMultiple: 1,
            }
          }
        ],
        as: 'stockDetails'
      }
    },

    // Lookup distributors with only required fields
    // {
    //   $lookup: {
    //     from: 'distributors',
    //     localField: 'cartItems.distributorId',
    //     foreignField: '_id',
    //     as: 'distributorDetails',
    //     pipeline: [
    //       {
    //         $project: {
    //           _id: 0,
    //           distributorname: 1,
    //           aliasname: 1,
    //           distributoremail: 1
    //         }
    //       }
    //     ]
    //   }
    // },
    // Project the required fields
    {
      $project: {
        _id: 1,
        cartId:1,
        cartName: 1,
        userId:1,
        userEmail:1,
        recurrence:1,
        isActiveCart: 1,
        cartItems: {
          _id:"$cartItems._id",
          quantity: '$cartItems.quantity',
          backOrder: '$cartItems.backOrder',
          cartOfferPrice: '$cartItems.cartOfferPrice',
          quoteOfferPrice: '$cartItems.quoteOfferPrice',
          isQuote: '$cartItems.isQuote',
          isCart: '$cartItems.isCart',
          cartExpiryTime: '$cartItems.cartExpiryTime',
          quoteExpiryTime: '$cartItems.quoteExpiryTime',
          distributorId: '$cartItems.distributorId',
          productId: '$cartItems.productId',
          stockId: '$cartItems.stockId',
          manufacturerId: '$cartItems.manufacturerId',
          productDetails: { $arrayElemAt: ['$productDetails', 0] },
          stockDetails: { $arrayElemAt: ['$stockDetails', 0] },
          mfrDetails: { $arrayElemAt: ['$mfrDetails', 0] },
        }
      }
    },

    // Group by cartId and rebuild the cartItems array
    {
      $group: {
        _id: '$_id',
        cartName: { $first: '$cartName' },
        cartId: { $first: '$cartId' },
        isActiveCart: { $first: '$isActiveCart' },
        cartItems: { $push: '$cartItems' },
        userId: { $first: '$userId' },
        userEmail: { $first: '$userEmail' },
        recurrence: { $first: '$recurrence' }
      }
    }
  ]);
  
  if(cart.length === 0){
   return {cart:[]}
  }
  const currency = await Curconversion.findOne({ currency: 'USD' }).sort({ createdAt: -1 }).exec();
  const updatedcart = cart[0]?.cartItems?.map((crt) => {

    let { ...cartItemsData } = crt;
    let pricing = crt.stockDetails.pricing;
    
   if(crt.stockDetails.orderedQty !== undefined){
   crt.stockDetails.stock = crt.stockDetails.orderedQty > crt.stockDetails.stock ? 0 : crt.stockDetails.stock - crt.stockDetails.orderedQty
   }

   if(pricing.INR !== undefined && pricing.INR !== null){
     pricing.USD = pricing.INR/currency.rate
   }else{
    pricing.INR = pricing.USD * currency.rate;
   }

   const quoteExpiryDate = cartItemsData?.quoteExpiryTime ? cartItemsData?.quoteExpiryTime.getTime() : Date.now()+1000
   const cartExpiryDate = cartItemsData?.cartExpiryTime ? cartItemsData?.cartExpiryTime.getTime() : Date.now()+1000
   if(cartItemsData.isQuote && Date.now() > quoteExpiryDate){
     cartItemsData.isQuote = false
     updateIsQuote(cartId,cartItemsData.productId,"quote")
   }
   if(cartItemsData.isCart && Date.now() > cartExpiryDate){
     cartItemsData.isCart = false
     updateIsQuote(cartId,cartItemsData.productId,"cart")
   }

   let totalINR,totalUSD,price
   const {INR,USD} = pricing

   if(cartItemsData.isQuote){
			 price = {INR:cartItemsData.quoteOfferPrice.INR,USD:cartItemsData.quoteOfferPrice.USD}
       totalINR = cartItemsData.quoteOfferPrice.INR * cartItemsData.quantity;
       totalUSD = cartItemsData.quoteOfferPrice.USD * cartItemsData.quantity;
   }else if(cartItemsData.isCart){
				price = {INR:cartItemsData.cartOfferPrice.INR,USD:cartItemsData.cartOfferPrice.USD}
       totalINR = cartItemsData.cartOfferPrice.INR * cartItemsData.quantity;
       totalUSD = cartItemsData.cartOfferPrice.USD * cartItemsData.quantity; 
   }else{
       price = {INR,USD}
       totalINR = INR * cartItemsData.quantity;
       totalUSD = USD * cartItemsData.quantity;
   }

   let itemTotalPrice = {totalINR,totalUSD}
     
   return { ...cartItemsData, pricing, currentPrice:price,normalPrice:{INR,USD}, itemTotalPrice };
 });
  cart[0].cartItems = updatedcart
  return {cart:JSON.parse(JSON.stringify(cart))}
}

const updateIsQuote = async(cartId,componentId,type) =>{
	let cart
	if(type === "quote") {
			cart = await Cart.updateOne({cartId,isActiveCart:true,'cartItems.productId':componentId},{$set:{'cartItems.$.isQuote':false}})
	}else{
			cart = await Cart.updateOne({cartId,isActiveCart:true,'cartItems.productId':componentId},{$set:{'cartItems.$.isOffered':false}})
	}
   console.log(cart,"updateIsQuote");
}

export async function getProfileDetails(userId) {
  try {
    const record = await Profile.findOne({ userId });
    if (record) {
      return { profileData: JSON.parse(JSON.stringify(record)) };
    } else {
      return { success: false, message: "Profile not found" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
      error: error.message,
    };
  }
}


export const newsroom = async () => {
  const records = await Newsroom.find({});
  return JSON.parse(JSON.stringify(records));
};

export const singleNews = async (newsLink) => {
  const newsItem = await Newsroom.findOne({ newsLink });
  return JSON.parse(JSON.stringify(newsItem));
};

export async function getUserMycart(userId) {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid userId provided');
    }

    const userCart = await Cart.findOne({ userId }).lean();
    
    if (!userCart || !userCart.cartItems || userCart.cartItems.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No Cart found'
      };
    }

    const cart = await Cart.aggregate([
      { 
        $match: { 
          userId: userId 
        } 
      },
      {
        $project: {
          cartId: 1,
          cartName: 1,
          userId: 1,
          userEmail: 1,
          isDeleted: 1,
          isActiveCart: 1,
          createdAt: 1,
          updatedAt: 1,
          cartItems: 1,
          recurrence: 1
        }
      },
      { 
        $unwind: '$cartItems'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartItems.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $lookup: {
          from: 'manufacturers',
          localField: 'cartItems.manufacturerId',
          foreignField: '_id',
          as: 'manufacturerDetails'
        }
      },
      {
        $lookup: {
          from: 'stocks',
          localField: 'cartItems.stockId',
          foreignField: '_id',
          as: 'stockDetails'
        }
      },
      {
        $lookup: {
          from: 'distributors',
          localField: 'cartItems.distributorId',
          foreignField: '_id',
          as: 'distributorDetails'
        }
      },
      {
        $group: {
          _id: '$_id',
          cartId: { $first: '$cartId' },
          cartName: { $first: '$cartName' },
          userId: { $first: '$userId' },
          userEmail: { $first: '$userEmail' },
          isDeleted: { $first: '$isDeleted' },
          isActiveCart: { $first: '$isActiveCart' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          recurrence: { $first: '$recurrence' },
          cartItems: {
            $push: {
              productInfo: {
                productId: { $toString: '$cartItems.productId' },
                productNumber: { $arrayElemAt: ['$productDetails.productNumber', 0] },
                productName: { $arrayElemAt: ['$productDetails.productName', 0] },
                description: { $arrayElemAt: ['$productDetails.description', 0] },
                properties: { $arrayElemAt: ['$productDetails.properties', 0] },
                imageSrc: { $arrayElemAt: ['$productDetails.imageSrc', 0] },
                priceSize: { $arrayElemAt: ['$productDetails.priceSize', 0] }
              },
              manufacturerInfo: {
                manufacturerId: { $toString: '$cartItems.manufacturerId' },
                name: { $arrayElemAt: ['$manufacturerDetails.name', 0] },
                urlName: { $arrayElemAt: ['$manufacturerDetails.urlName', 0] }
              },
              stockInfo: {
                stockId: { $toString: '$cartItems.stockId' },
                pricing: { $arrayElemAt: ['$stockDetails.pricing', 0] },
                stock: { $arrayElemAt: ['$stockDetails.stock', 0] },
                orderMultiple: { $arrayElemAt: ['$stockDetails.orderMultiple', 0] },
                specification: { $arrayElemAt: ['$stockDetails.specification', 0] }
              },
              distributorInfo: {
                distributorId: { $toString: '$cartItems.distributorId' },
                distributorName: { $arrayElemAt: ['$distributorDetails.distributorname', 0] },
                aliasName: { $arrayElemAt: ['$distributorDetails.aliasname', 0] }
              },
              quantity: '$cartItems.quantity',
              backOrder: '$cartItems.backOrder',
              isCart: '$cartItems.isCart',
              isQuote: '$cartItems.isQuote',
              quoteOfferPrice: '$cartItems.quoteOfferPrice',
              cartOfferPrice: '$cartItems.cartOfferPrice'
            }
          }
        }
      }
    ]).exec();

    return {
      success: true,
      data: cart || [],
      message: cart.length > 0 ? 'Cart found' : 'No Cart found'
    };

  } catch (error) {
    console.error('Cart error:', error);
    return {
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    };
  }
}

export async function getUserFavorites(userId) {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid userId provided');
    }

    const userFavorites = await MyFavourite.findOne({ userId }).lean();
    
    if (!userFavorites || !userFavorites.favorite || userFavorites.favorite.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No favorites found'
      };
    }

    let favorites = await MyFavourite.aggregate([
      { 
        $match: { 
          userId: userId 
        } 
      },
      { 
        $unwind: { 
          path: '$favorite',
          preserveNullAndEmptyArrays: true 
        } 
      },
      {
        $lookup: {
          from: 'products',
          let: { productId: '$favorite.productId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$productId'] }
              }
            }
          ],
          as: 'productDetails'
        }
      },
      {
        $lookup: {
          from: 'manufacturers',
          let: { manufacturerId: '$favorite.manufacturerId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$manufacturerId'] }
              }
            }
          ],
          as: 'manufacturerDetails'
        }
      },

      {
        $lookup: {
          from: 'stocks',
          let: { productId: '$favorite.productId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$productid', '$$productId'] }
              }
            }
          ],
          as: 'stockDetails'
        }
      },

      {
        $lookup: {
          from: 'distributors',
          let: { distributorId: '$favorite.distributorId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$distributorId'] }
              }
            }
          ],
          as: 'distributorDetails'
        }
      },

      {
        $project: {
          _id: 0,
          productInfo: {
            productId: { $toString: '$favorite.productId' },
            productNumber: { $arrayElemAt: ['$productDetails.productNumber', 0] },
            productName: { $arrayElemAt: ['$productDetails.productName', 0] },
            description: { $arrayElemAt: ['$productDetails.description', 0] },
            properties: { $arrayElemAt: ['$productDetails.properties', 0] },
            image: { $arrayElemAt: ['$productDetails.image', 0] },
            priceSize: { $arrayElemAt: ['$productDetails.priceSize', 0] }
          },
          manufacturerInfo: {
            manufacturerId: { $toString: '$favorite.manufacturerId' },
            name: { $arrayElemAt: ['$manufacturerDetails.name', 0] },
            urlName: { $arrayElemAt: ['$manufacturerDetails.urlName', 0] }
          },
          // stockInfo: {
          //   stockId: { $arrayElemAt: ['$stockDetails._id', 0] },
          //   pricing: { $arrayElemAt: ['$stockDetails.pricing', 0] },
          //   stock: { $arrayElemAt: ['$stockDetails.stock', 0] },
          //   orderdQty: { $arrayElemAt: ['$stockDetails.orderdQty', 0] },
          //   orderMultiple: { $arrayElemAt: ['$stockDetails.orderMultiple', 0] },
          // },
          distributorInfo: {
            distributorId: { $toString: '$favorite.distributorId' },
            distributorName: { $arrayElemAt: ['$distributorDetails.distributorname', 0] },
            aliasName: { $arrayElemAt: ['$distributorDetails.aliasname', 0] }
          },
          quantity: { $toString: '$favorite.quantity' },
          stock: { $toString: '$favorite.stock' },
          "stockDetails":1
        }
      }
    ]).exec();
    console.log(favorites,"--------");
    const currency = await Curconversion.findOne({ currency: 'USD' }).sort({ createdAt: -1 }).exec();
    favorites = favorites.map(fav=>{
      let {stockDetails,...data} = fav
      let stockInfo = stockDetails.map(x=>{
        if(x.pricing.INR !== undefined && x.pricing.INR !== null){
            x.pricing.USD = x.pricing.INR/currency.rate
          }else{
           x.pricing.INR = x.pricing.USD * currency.rate;
          }
          if(x.orderedQty){
            x.stock = x.stock > x.orderedQty ? x.stock - x.orderedQty : 0
          }
          return x
       })
      // if(stockInfo.pricing.INR !== undefined && stockInfo.pricing.INR !== null){
      //   stockInfo.pricing.USD = stockInfo.pricing.INR/currency.rate
      // }else{
      //  stockInfo.pricing.INR = stockInfo.pricing.USD * currency.rate;
      // }
      return {stockInfo,...data}
    })
    
    return {
      success: true,
      data: favorites || [],
      message: favorites.length > 0 ? 'Favorites found' : 'No favorites found'
    };

  } catch (error) {
    console.error('getUserFavorites error:', error);
    return {
      success: false,
      message: 'Failed to fetch favorites',
      error: error.message
    };
  }
}

export async function getUserProfileData(userId) {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid userId provided');
    }

    const [profile, orders, returnsData, quotes, favoritesResult, cart ] = await Promise.all([
      Profile.findOne({ userId }).lean(),
      
      Order.find({ userId })
        .sort({ createdAt: -1 })
        .lean(),
      Return.find({userId})
      .sort({ createdAt: -1 })
        .lean(),
      Quotes.find({ userId })
        .sort({ createdAt: -1 })
        .lean(),

      getUserFavorites(userId),
      getUserMycart(userId),
      // Cart.find({
      //   userId
      // }).sort({ updatedAt: -1 })
      // .lean()
    ]);

    if (!profile) {
      return {
        success: false,
        message: "Profile not found"
      };
    }

    // console.log('Favorites result:', JSON.stringify(favoritesResult, null, 2));

    const data = {
      success: true,
      profile,
      orders,
      quotes,
      returnsData,
      favorites: favoritesResult.success ? favoritesResult.data : [],
      cart: cart.success ? cart.data : []
    };

    // console.log('Final data structure:', JSON.stringify(data, null, 2));

    return JSON.parse(JSON.stringify(data));

  } catch (error) {
    console.error('getUserProfileData error:', error);
    return {
      success: false,
      message: "Something went wrong",
      error: error.message
    };
  }
}

export const getSingleCartDetails = async (userId) => {
	try {
	  const carts = await Cart.find({ userId })
		.sort({ createdAt: -1 }) // Sort by createdAt in descending order
		.exec();
	  return carts;
	} catch (error) {
	  console.error('Error fetching cart details:', error);
	  throw error;
	}
};

export const singleCartForCount = async (userId) => {
  try {
    const carts = await Cart.findOne({ userId, isActiveCart: true })
      .exec();
      return JSON.parse(JSON.stringify(carts));
  } catch (error) {
    console.error('Error fetching cart details:', error);
    throw error;
  }
};


