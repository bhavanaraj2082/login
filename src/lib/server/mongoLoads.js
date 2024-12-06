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
import Curcurrency from "$lib/server/models/Curcurrency.js";

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

export const isProductFavorite = async (productNumber, cookies) => {
  const cookieValue = cookies.get("token");
  let isFavorite = false;
  if (!cookieValue) {
    console.error("User is not logged in.");
    return isFavorite;
  }
  const parsedCookie = JSON.parse(cookieValue);
  const userProfileId = parsedCookie.profileId;
  const existingRecord = await MyFavourites.findOne({
    userProfileId: userProfileId,
  });
  if (existingRecord && Array.isArray(existingRecord.favorite)) {
    isFavorite = existingRecord.favorite.some(
      (item) => item.productNumber === productNumber
    );
  }
  return isFavorite;
};

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
        $project: {
          productNumber: 1,
          productName: 1,
          prodDesc: 1,
          imageSrc: 1,
          "categoryDetails.name": 1,
          "categoryDetails.urlName": 1,
          "manufacturerDetails.name": 1,
          "stockDetails.pricing": 1,
          "stockDetails.stock": 1,
          "stockDetails.orderMultiple": 1,
        },
      },
      {
        $skip: (Number(page) - 1) * Number(pageSize),
      },
      {
        $limit: Number(pageSize),
      },
    ]);
    const after = Date.now();


    const filtered = await Promise.all( products.map(async(product) => {
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
        pricing: priceConversion[0],
        totalPrice: priceConversion[0].INR*stockDetails.orderMultiple,
        quantity: stockDetails.orderMultiple,
        orderMultiple: stockDetails.orderMultiple,
        categoryDetails,
        subCategoryDetails,
        manufacturerDetails,
      };
    })
  )
    return {
      products: JSON.parse(JSON.stringify(filtered)),
      manufacturers: JSON.parse(JSON.stringify(subcategory.manufacturerIds)),
      productCount: subcategory.productCount,
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
					stockPriceSize: { $ifNull: [{ $arrayElemAt: ['$stockInfo.pricing', 0] }, []] },
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

// returns ends

//PRODUCT SIMILAR ITEMS , FINDING DIFFERENCES
export async function getCurrencyData(currency) {
  try {
    const record = await Curcurrency.findOne({ currency }).lean();
    console.log("record>>", record);
    return record || { currency: [] };
  } catch (error) {
    console.error("Error fetching currency data:", error);
    return { currency: [] };
  }
}

export async function conversionRates() {
  try {
    const records = await Curcurrency.find({}).lean();

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
  if (!Array.isArray(pricing)) return [];
  const currentRates = await conversionRates();

  return pricing.map((priceItem) => {
    const { break: breakPoint, offer, ...currencies } = priceItem;
    const newPriceItem = {
      break: breakPoint,
      ...(offer !== undefined && { offer }),
    };

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
    return priceItem;
  });
}

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
      const stock = await Stock.findOne({
        productNumber: variant.productNumber,
      }).lean();
      return {
        ...variant,
        pricing: stock ? stock.pricing : [],
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

//productinfo ends

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
//Myfavourites loads starts

export async function getFavSavedData(id) {
  const records = await MyFavourite.findOne({ userId: id });
  return JSON.parse(JSON.stringify(records)) || { favorite: [] };
}
//Myfavourites loads ends

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
