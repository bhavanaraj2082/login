export async function load() {
  try {
    await pb.admins.authWithPassword("team@partskeys.com", "eICwDzXNaqXjtmD0qHEUpb7PxfgKtJva");
    console.log("Authentication success");
    
} catch (error) {
    return {
      error: "Authentication failed. Please check credentials.",
    };
  }

  const productData = await loadProductsInfo(pb);

  if (productData.type === "error") {
    return {
      error: productData.message,
    };
  }
  console.log("Product Records1111:", productData);

  return productData;

}


export const actions ={
  checkavailabilityproduct: async ({ request }) => {
  try {
    await pb.admins.authWithPassword(
      `team@partskeys.com`,
      `eICwDzXNaqXjtmD0qHEUpb7PxfgKtJva`
    );

    const data = Object.fromEntries(await request.formData());
    console.log("Formatted Data:", data);
      
    const record = await checkavailabilityproduct(data, pb);     
      return {
        record: record    
      };
  
  } catch (error) {
    console.error("error:", error);
  }
}
}