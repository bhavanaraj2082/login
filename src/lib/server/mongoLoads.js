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
