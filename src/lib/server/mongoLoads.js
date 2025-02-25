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
import User from "$lib/server/models/User.js";
import Quotes from "$lib/server/models/Quotes.js";
import Cart from "$lib/server/models/Cart.js";


export async function getProductdatas() {
  const records = await Category.find();
  if (records.length > 0) {
    return { records: JSON.parse(JSON.stringify(records)) };
  } else {
    return { error: "Product not found" };
  }
}

export async function getSubCategoryDatas(subid) {
  const category = await Category.findOne({ urlName: subid });
  if (!category) {
    return { error: "No Category found with the specified urlName" };
  }
  const records = await SubCategory.find({ category: category._id }).populate(
    "category"
  );

  return records.length > 0
    ? { records: JSON.parse(JSON.stringify(records)) }
    : { error: "No SubCategories found matching the category" };
}

export async function getOrderStatusData(ordernumber) {
  try {
    const records = await Order.findOne({ orderid: ordernumber })
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
    productSynonym: product.filteredProductData?.["Synonym(S)"] || "",
    stockQuantity,
  };
  return { records: [formattedRecord] };
}

export const isProductFavorite = async (productNumber, locals) => {
  let authedUser = {};
  if (locals.authedUser && locals.authedUser?.username) {
    authedUser = locals.authedUser;
  }

  const authedEmail = authedUser.email;
  let isFavorite = false;
  if (!authedEmail) {
    return isFavorite;
  }

  const userId = authedUser.id;
  const existingRecord = await MyFavourite.findOne({ userId: userId });
  // console.log(existingRecord);
  
  if (existingRecord && Array.isArray(existingRecord.favorite)) {
    isFavorite = existingRecord.favorite.some(
      (item) => item.productNumber === productNumber
    );
  }

  // console.log(isFavorite, "isFavorite");
  return isFavorite;
};


export async function RelatedProductData(productId) {
  // console.log("==", productId);
  const product = await Product.findOne({ productNumber: productId }).populate(
    "subsubCategory"
  );
  if (!product) {
    return { error: "Product not found" };
  }

    const subsubCategoryId = product.subsubCategory._id;
	if(subsubCategoryId){
		const relatedProducts = await Product.aggregate([
			{
				$match: { 'subsubCategory': subsubCategoryId } 
			},
			{
				$limit: 8 
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
					'subsubCategoryInfo.urlName': 1,
					stockQuantity: { $ifNull: [{ $arrayElemAt: ['$stockInfo.stock', 0] }, 0] }, 
					// stockPriceSize: { $ifNull: [{ $arrayElemAt: ['$stockInfo.pricing', 0] }, []] },
          stockPriceSize: { $ifNull: ['$stockInfo.pricing', []] },
					orderMultiple: { $ifNull: [{ $arrayElemAt: ['$stockInfo.orderMultiple', 0] }, 1] },
					priceSize: 1, 
					imageSrc: 1,  
					productUrl: 1, 
					productNumber :1
				}
			}
		]);
		
		let relatedProductsJson = await Promise.all(relatedProducts.map(async (items) => {
		
			let convertedPrice = await convertToINR(items.stockPriceSize);   
			return {
				...items,  
				stockPriceSize: convertedPrice  
			};
		}));
 
        return JSON.parse(JSON.stringify(relatedProductsJson));
	} 
	else{

		return []
	}
}

export async function popularProducts() {
  const records = await PopularProduct.find({}, { _id: 0 })
    .sort("order")
    .populate({
      path: "product",
      select: "-_id prodDesc productName imageSrc productNumber",
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
    };

    return JSON.parse(JSON.stringify(allData));
  } catch (error) {
    console.error("Error fetching search data:", error);
    return { success: false, message: "Error fetching search data" };
  }
}

async function getMatchedComponents(search) {
  try {
    const queryFilter = {
      $or: [
        { productName: { $regex: search, $options: "i" } },
        { productNumber: { $regex: search, $options: "i" } },
        { CAS: { $regex: search, $options: "i" } },
      ],
    };

    const components = await Product.find(queryFilter)
      .limit(6)
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
  search
) => {
  const page = pageNum || 1;
  const pageSize = 10;
  try {
    let be = Date.now();
    const subcategory = await SubCategory.findOne({ urlName: suburl })
      .populate({ path: "manufacturerIds", select: "-_id name" })
      .populate({ path: "subSubCategoryIds", select: "-_id name urlName" });
    let af = Date.now();
    //console.log(af - be, "milliseconds");
    const subCategoryDetails = {
      name: subcategory.name,
      urlName: subcategory.urlName,
    };
    if (!subcategory) {
      return {
        type: "error",
        message: `Subcategory not found for URL: ${suburl}`,
      };
    }

 

    const matchCondition = {
      "subCategoryDetails.urlName": subcategory.urlName,
      inStock: { $exists: true, $gt: 0 },
    };

 

    if (manufacturer) {
      matchCondition["manufacturerDetails.name"] = manufacturer;
    }
    if (search) {
      matchCondition.$or = [
        { CAS: { $regex: search, $options: "i" } },
        { productNumber: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
      ];
    }

 

    const before = Date.now();
    // const products = await Product.aggregate([
    //   {
    //     $lookup: {
    //       from: "subcategories",
    //       localField: "subCategory",
    //       foreignField: "_id",
    //       as: "subCategoryDetails",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "manufacturers",
    //       localField: "manufacturer",
    //       foreignField: "_id",
    //       as: "manufacturerDetails",
    //     },
    //   },
    //   { $match: matchCondition },
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "category",
    //       foreignField: "_id",
    //       as: "categoryDetails",
    //     },
    //   },

 

    //   {
    //     $lookup: {
    //       from: "stocks",
    //       localField: "_id",
    //       foreignField: "productid",
    //       as: "stockDetails",
    //     },
    //   },

 

    //   { $unwind: "$stockDetails" },
    //   { $unwind: "$manufacturerDetails" },
    //   { $unwind: "$categoryDetails" },
    //   { $unwind: "$subCategoryDetails" },
    //   {
    //     $project: {
    //       productNumber: 1,
    //       productName: 1,
    //       prodDesc: 1,
    //       imageSrc: 1,
    //       "categoryDetails.name": 1,
    //       "categoryDetails.urlName": 1,
    //       "manufacturerDetails.name": 1,
    //       "manufacturerDetails._id": 1,
    //       "stockDetails._id": 1,
    //       "stockDetails.pricing": 1,
    //       "stockDetails.stock": 1,
    //       "stockDetails.orderMultiple": 1,
    //       "stockDetails.distributor": 1,
    //     },
    //   },
    //   {
    //     $skip: (Number(page) - 1) * Number(pageSize),
    //   },
    //   {
    //     $limit: Number(pageSize),
    //   },
    // ]);
   
    const products = await Product.aggregate([
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
      { $match: matchCondition },
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
          localField: "_id",
          foreignField: "productid",
          as: "stockDetails",
        },
      },
      { $unwind: "$stockDetails" },
      { $unwind: "$manufacturerDetails" },
      { $unwind: "$categoryDetails" },
      { $unwind: "$subCategoryDetails" },
      {
        $facet: {
          data: [
            {
              $project: {
                productNumber: 1,
                productName: 1,
                prodDesc: 1,
                imageSrc: 1,
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
            {
              $skip: (Number(page) - 1) * Number(pageSize),
            },
            {
              $limit: Number(pageSize),
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);
   
    const after = Date.now();

 

   // console.log(JSON.stringify(products[0].total,null,2));


 

    const filtered = await Promise.all(products[0].data.map(async(product) => {
      const {
        _id,
        productName,
        productNumber,
        prodDesc,
        imageSrc,
        stockDetails,
        manufacturerDetails,
        categoryDetails,
      } = product;
      const priceConversion = await convertToINR(stockDetails.pricing)
      return {
        _id,
        productName,
        productNumber,
        prodDesc,
        imageSrc,
        pricing: priceConversion,
        totalPrice: priceConversion.INR*stockDetails.orderMultiple,
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
      productCount: products[0].totalCount[0].total,
      subSubCategory: JSON.parse(JSON.stringify(subcategory.subSubCategoryIds)),
    };
  } catch (error) {
    console.error("Error loading product subcategory:", error);
    return {
      type: "error",
      message: "An error occurred while loading product data.",
    };
  }
};

export async function RelatedApplicationData(name) {
  try {
    const queryFilter = {
      $or: [
        { description: { $regex: name, $options: "i" } },
        { "subsubCategory.name": { $regex: name, $options: "i" } },
        { "subCategory.name": { $regex: name, $options: "i" } },
      ],
    };

    const relatedProducts = await Product.find(queryFilter)
      .limit(8)
      .populate("subCategory")
      .populate("subsubCategory")
      .populate("category")
      .populate("manufacturerName")
      .exec();

    return JSON.parse(JSON.stringify(relatedProducts));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return { success: false, message: "Error fetching related products" };
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
      .populate("dashuserprofileid")
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
    //   console.log("rates...===>", rates);
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

//Product info starts
export async function DifferentProds(productId) {
  // fething product
  const product = JSON.parse(
    JSON.stringify(
      await Product.findOne({ productNumber: productId }).populate(
        "manufacturer"
      )
    )
  );
  const partNumber = product.productNumber;
  // products stocks
  let stockQuantity = 0;
  let orderMultiple = 0;
  let priceSize = [];

  if (partNumber) {
    const stockRecord = await Stock.findOne({
      productNumber: partNumber,
    }).exec();
    if (stockRecord && typeof stockRecord.stock !== "undefined") {
      stockQuantity = stockRecord.stock;
      orderMultiple = stockRecord.orderMultiple;
      // console.log("stocks=====before>>", stockRecord.pricing);

      priceSize = await convertToINR(stockRecord.pricing);

      // console.log("after==>>", priceSize);
    }
  }

  const variants = product.variants || [];
	const variantRecord = await Promise.all(
	  variants.map(async (variantId) => {
		const variant = await Product.findById(variantId).lean();
		if (!variant) return {};
  
		const stock = await Stock.findOne({ productNumber: variant.productNumber }).lean();
  
		let variantPricing = [];
		if (stock?.pricing) {
		  // Await the result of convertToINR to get the actual pricing
		  if (stock.pricing.length > 1) {
			variantPricing = await convertToINR([stock.pricing[0]]);
		  } else {
			variantPricing = await convertToINR(stock.pricing);
		  }
		}
  
		return {
		  _id: variant?._id?.toString() || "",
		  productName: variant?.productName || "Unknown Product",
		  prodDesc: variant?.prodDesc || "No description available",
		  description: Array.isArray(variant?.description) ? variant.description : [],
		  properties: variant?.properties || {},
		  manufacturerName: variant?.manufacturerName 
			? variant.manufacturerName.toString() 
			: "Unknown Manufacturer",
		  productNumber: variant?.productNumber || "N/A",
		  imageSrc: variant?.imageSrc || "",
		  pricing: variantPricing ? variantPricing : []
		};
	  })
	);

  const formattedRecord = {
    productId: product?._id?.toString() || "",
    productName: product?.productName || "Unknown Product",
    CAS: product?.CAS,
    productNumber: product?.productNumber || "N/A",
    prodDesc: product?.prodDesc,
    returnPolicy: product?.returnPolicy,
    imageSrc: product?.imageSrc || "",
    safetyDatasheet: product?.safetyDatasheet || "",
    priceSize,
    properties: product?.properties || {},
    description: product?.description || {},
    safetyInfo: product?.safetyInfo || {},
    filteredProductData: product?.filteredProductData || {},
    productSynonym: product?.filteredProductData?.["Synonym(S)"] || "",
    stockQuantity,
    orderMultiple,
    manufacturer: product?.manufacturer || {},
    variants: variantRecord.map((variant) => ({
      _id: variant?._id?.toString() || "",
      productName: variant?.productName || "Unknown Product",
      prodDesc: variant?.prodDesc || "No description available",
      description: variant?.description || [],
      properties: variant?.properties || {},
      manufacturerName: variant?.manufacturerName
        ? variant.manufacturerName.toString()
        : "Unknown Manufacturer",
      productNumber: variant?.productNumber || "N/A",
      imageSrc: variant?.imageSrc || "",
      pricing: variant?.pricing,
    })),
  };

  return { records: [formattedRecord] };
}
//Product info ends

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

//CompareSimilar Items in product page
export async function CompareSimilarityData(productId) {
  const product = await Product.findOne({ productNumber: productId }).populate(
    "subsubCategory"
  );
  if (!product) {
    return { error: "Product not found" };
  }
  const subsubCategoryId = product.subsubCategory._id;
  if(subsubCategoryId){
    const compareSimilarity = await Product.aggregate([
      {
        $match: { subsubCategory: subsubCategoryId },
      },
      {
        $limit: 4,
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategoryInfo",
        },
      },
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturer",
          foreignField: "_id",
          as: "manufacturerInfo",
        },
      },
      {
        $lookup: {
          from: "subsubcategories",
          localField: "subsubCategory",
          foreignField: "_id",
          as: "subsubCategoryInfo",
        },
      },
      {
        $lookup: {
          from: "stocks",
          localField: "productNumber",
          foreignField: "productNumber",
          as: "stockInfo",
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          prodDesc: 1,
          properties: 1,
          "categoryInfo.urlName": 1,
          "subCategoryInfo.urlName": 1,
          "manufacturerInfo.name": 1,
          "subsubCategoryInfo.urlName": 1,
          stockQuantity: {
            $ifNull: [{ $arrayElemAt: ["$stockInfo.stock", 0] }, 0],
          },
          stockPriceSize: {
            $ifNull: [{ $arrayElemAt: ["$stockInfo.pricing", 0] }, []],
          },
          orderMultiple: {
            $ifNull: [{ $arrayElemAt: ["$stockInfo.orderMultiple", 0] }, 1],
          },
          priceSize: 1,
          imageSrc: 1,
          productUrl: 1,
          productNumber: 1,
        },
      },
    ]);
    let compareSimilarityJson = await Promise.all(compareSimilarity.map(async (items) => {
			let convertedPrice = await convertToINR(items.stockPriceSize);   
			return {
				...items,  
				stockPriceSize: convertedPrice  
			};
		}));
        return JSON.parse(JSON.stringify(compareSimilarityJson));
  }
  else{
    return []
  }
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

    const favorites = await MyFavourite.aggregate([
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
          let: { stockId: '$favorite.stockId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$stockId'] }
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
            productNumber: '$favorite.productNumber',
            productName: { $arrayElemAt: ['$productDetails.productName', 0] },
            description: { $arrayElemAt: ['$productDetails.description', 0] },
            properties: { $arrayElemAt: ['$productDetails.properties', 0] },
            imageSrc: { $arrayElemAt: ['$productDetails.imageSrc', 0] },
            priceSize: { $arrayElemAt: ['$productDetails.priceSize', 0] }
          },
          manufacturerInfo: {
            manufacturerId: { $toString: '$favorite.manufacturerId' },
            name: { $arrayElemAt: ['$manufacturerDetails.name', 0] },
            urlName: { $arrayElemAt: ['$manufacturerDetails.urlName', 0] }
          },
          stockInfo: {
            stockId: { $toString: '$favorite.stockId' },
            pricing: { $arrayElemAt: ['$stockDetails.pricing', 0] },
            stock: { $arrayElemAt: ['$stockDetails.stock', 0] },
            orderMultiple: { $arrayElemAt: ['$stockDetails.orderMultiple', 0] },
            specification: { $arrayElemAt: ['$stockDetails.specification', 0] }
          },
          distributorInfo: {
            distributorId: { $toString: '$favorite.distributorId' },
            distributorName: { $arrayElemAt: ['$distributorDetails.distributorname', 0] },
            aliasName: { $arrayElemAt: ['$distributorDetails.aliasname', 0] }
          },
          quantity: { $toString: '$favorite.quantity' },
          stock: { $toString: '$favorite.stock' }
        }
      }
    ]).exec();

    // Debug logging
    // console.log('Favorites query result:', JSON.stringify(favorites, null, 2));

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

    const [profile, orders, quotes, favoritesResult, cart] = await Promise.all([
      Profile.findOne({ userId }).lean(),
      
      Order.find({ userId })
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


export const getCart = async(userId)=>{
    if(!userId) return { cart:[]}
   const cart = await Cart.aggregate([
     // Match the specific cart by cartId
     { $match: { userId,isActiveCart:true } },
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
               imageSrc: 1,
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
               ordermultiple: 1,
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
     //const cartData = await Cart.findOne({ userId: userId, isActiveCart: true })
    //return {cart:JSON.parse(JSON.stringify([cartData]))};
    return {cart:[]};
   }
   const currency = await Curconversion.findOne({ currency: 'USD' }).sort({ createdAt: -1 }).exec();
  // console.log(JSON.stringify(cartData,null,2));
   const updatedcart = cart[0]?.cartItems?.map((crt) => {

     let { ...cartItemsData } = crt;
     let pricing = crt.stockDetails.pricing;
    
   //  if(crt.stockDetails.orderedQty !== undefined){
   //  crt.stockDetails.stock = crt.stockDetails.orderedQty > crt.stockDetails.stock ? 0 : crt.stockDetails.stock - crt.stockDetails.orderedQty
   //  }
   console.log('before',pricing);
    if(pricing.INR !== undefined && pricing.INR !== null){
      pricing.USD = pricing.INR/currency.rate
    }else{
     pricing.INR = pricing.USD * currency.rate;
    }

     let totalINR,totalUSD
     const {INR,USD} = pricing

     if(cartItemsData.isQuote){
        totalINR = cartItemsData.quoteOfferPrice.INR * cartItemsData.quantity;
        totalUSD = cartItemsData.quoteOfferPrice.USD * cartItemsData.quantity;
     }else if(cartItemsData.isCart){
        totalINR = cartItemsData.cartOfferPrice.INR * cartItemsData.quantity;
        totalUSD = cartItemsData.cartOfferPrice.USD * cartItemsData.quantity;
     }else{
        totalINR = INR * cartItemsData.quantity;
        totalUSD = USD * cartItemsData.quantity;
     }

     let itemTotalPrice = {totalINR,totalUSD}
      
     const quoteExpiryDate = cartItemsData?.quoteExpiryTime ? cartItemsData?.quoteExpiryTime.getTime() : Date.now()+1000
     const cartExpiryDate = cartItemsData?.cartExpiryTime ? cartItemsData?.cartExpiryTime.getTime() : Date.now()+1000
     if(cartItemsData.isQuote && Date.now() > quoteExpiryDate){
      cartItemsData.isQuote = false
      //updateIsQuote(cartId,cartItemsData.componentId,"quote")
     }
     if(cartItemsData.isCart && Date.now() > cartExpiryDate){
    cartItemsData.isCart = false
    //updateIsQuote(cartId,cartItemsData.componentId,"cart")
    }
  
     return { ...cartItemsData, pricing, currentPrice:{INR,USD}, itemTotalPrice };
   });
   cart[0].cartItems = updatedcart
  // console.log(updatedcart,"result");
   return {cart:JSON.parse(JSON.stringify(cart))}
}