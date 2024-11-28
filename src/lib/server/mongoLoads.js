import ViewedProduct from "$lib/server/models/AlsoViewedProducts.js";

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
import Product from "$lib/server/models/Products.js";

export async function loadProductsInfo(productId) {

    // console.log(productId);
    
          // Fetch the product record by productId
          const product = JSON.parse(JSON.stringify(await Product.findOne({ productNumber: productId })));
          console.log('Product:', [product]);
  
          if (!product) {
              return {
                  type: "error",
                  message: "Product record not found",
              };
          }
  
          const partNumber = product._id;
          console.log("PartNumber for stock data:", partNumber);
  
          let stockQuantity = 0;
  
          // Format the product record
          const formattedRecord = {
              productId: product._id.toString(), // Convert ObjectId to string
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
              stockQuantity, // Include stock quantity only if fetched
          };
  
          return {
              records: [formattedRecord],
          };

  };
