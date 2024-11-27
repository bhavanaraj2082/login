import Category from "$lib/server/models/Category";
import SubCategory from "$lib/server/models/SubCategory";
import Order from "$lib/server/models/Order";
import Products from "$lib/server/models/Products";

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
  






  

