import { getSubCategoryDatas } from "$lib/server/mongoLoads.js"

export const load = async ({ params }) => {
    try {
      const data = await getSubCategoryDatas(params.subid);
      return data;
    } catch (err) {
      console.error("Unexpected error in load function:", err);
      return { 
        error: "Failed to load subcategory data", 
        status: 500 
      };
    }
  }