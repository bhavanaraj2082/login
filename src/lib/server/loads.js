// import {DB_URL,DB_USER,DB_PASS} from "$env/static/private"

//const pb = new PocketBase(`${DB_URL}`);

export const getChemicalProducts = async (pb) => {
	try {
		const products = await pb
			.collection('SampleChemiComponent')
			.getList(1, 10, { fields: 'productName,productNumber,priceSize,prodDesc' });
		// console.log(products.items);
		return { products: products.items };
	} catch (error) {
		console.log(error);
	}
};

export async function loadProducts(pb) {
	try {
		// Fetch all products from the PocketBase 'products' collection
		const products = await pb.collection('products').getFullList();
		return products; // Return the list of products
	} catch (error) {
		console.error('Error loading products:', error);
		return [];
	}
}

// Function to load a specific product by ID (for details page)
export async function loadProductById(productId) {
	try {
		// Fetch a single product by its ID
		const product = await pb.collection('products').getOne(productId);
		return product; // Return the product data
	} catch (error) {
		console.error('Error loading product by ID:', error);
		return null;
	}
}

//////////Product Filter ///////////////


// export const loadFirstProduct = async (pb) => {
//    // console.log('Fetching chemical products...');

    
//         const products = await pb.collection('Products').getList(1, 2000, { 
//             sort: '-created',
//             expand: 'manufacturerName,Category'
//         });

  

//         if (!products.items || products.items.length === 0) {
//             console.warn('No products found in the API response.');
//             return  [] ;
//         }

    
//         const productsWithNames = products.items.map(product => ({
//             ...product,
//             manufacturerName: product.expand?.manufacturerName?.name || 'Unknown Manufacturer',
//             categoryName: product.expand?.Category?.name || 'Unknown Category',
//         }));

//     //    console.log('Mapped products:', productsWithNames);  

//         return  productsWithNames ;
//     } 

//////////PRODUCTS FILTER WITH STOCk
export const loadFirstProduct = async (pb) => {
   
    const products = await pb.collection('Products').getList(1, 1000, { 
        sort: '-created',
    });

   // console.log("I am product", products.items);

    if (!products.items || products.items.length === 0) {
        console.warn('No products found');
        return [];
    }


 
    const stocks = await pb.collection('Stocks').getList(1, 1000, 
        { 
        expand:'partNumber'
        // sort: '-created',
    });

    
    if (!stocks.items || stocks.items.length === 0) {
        console.warn('No stock data found');
    }

    const productNames = products.items.map(product => {
        
        const stock = stocks.items.find(stockItem => 
            stockItem.expand.partNumber?.id === product.id
        );

        

        return {
            ...product,
            stockQuantity: stock ? stock.stockQuantity : 0,  
        };
    });

    // console.log('Mapped products with stock quantity:', productNames);

    return productNames;
};



export async function fetchViewedProducts(pb) {
	const records = await pb.collection('ViewedProducts').getFullList({
		sort: '-created'
	});
	const updatedRecords = records.map((record) => {
		const imgUrl = pb.files.getUrl(record, record.image);
		return {
			...record,
			image: imgUrl
		};
	});
	return updatedRecords;
}

// profile page loads function
export async function profileupdate(pb,userId){
    if (!userId) {
        console.error("Invalid user ID");
        return null;
    }
	const records = await pb.collection('Register').getFirstListItem(`id="${userId}"`,{
		expand: 'chemiDashprofile',
	});
	
	return records
} 

/*****************ProductsInfoPopup******************/
export async function loadProductsInfo(pb, productId){
    // console.log("Input ProductId:", ProductId);
    const response = await pb.collection('Products').getFirstListItem(`productNumber="${productId}"`, { expand: 'manufacturerName' });

    if (!response) {
        return {
            type: "error",
            message: "Product record not found",
        };
    }
    const PartNumber = response.id; 
    console.log("PartNumber for stock data:", PartNumber);
    let stockQuantity = 0;

    if (PartNumber) {
        try {
            const stockRecord = await pb.collection('Stocks').getFirstListItem(`partNumber="${PartNumber}"`, { expand: 'partNumber' });
            console.log("Fetched stockRecord:", stockRecord); 
            if (stockRecord && typeof stockRecord.stockQuantity !== "undefined") {
                stockQuantity = stockRecord.stockQuantity;
                console.log("Stock Quantity fetched:", stockQuantity);
            } else {
                console.log("Stock record found but stockQuantity is undefined.");
            }
        } catch (error) {
            console.error("Error fetching stockRecord:", error);
        }
    }

    const formattedRecord = {
        productId: response.id,
        productName: response.productName,
        productNumber: response.productNumber,
        prodDesc: response.prodDesc,
        imageSrc: response.imageSrc,
        safetyDatasheet: response.safetyDatasheet,
        priceSize: Array.isArray(response.priceSize)
            ? response.priceSize.map((item) => ({
                  price: item.price,
                  size: item.size,
              }))
            : [],
        properties: response.properties || {},
        description: response.description || {},
        safetyInfo: response.safetyInfo || {},
        filteredProductData: response.filteredProductData || {},
        productSynonym: response.filteredProductData?.['Synonym(S)'] || "",
        stockQuantity, // Include stock quantity only if fetched
    };

    return {
        type: "success",
        records: [formattedRecord],
    };
}; 


// search bar component 
export async function fetchProductName(pb) {
	try {
	  const subCategoryRecords = await pb.collection('SubCategories').getFullList();
	  const subSubCategoryRecords = await pb.collection('SubSubCategories').getFullList();
	  const manufacturerRecords = await pb.collection('Manufacturers').getFullList();
  
	  const allRecords = [
		...subCategoryRecords.map(record => ({ name: record.name })),
		...subSubCategoryRecords.map(record => ({ name: record.name })),
		...manufacturerRecords.map(record => ({ name: record.name }))
	  ];
  
	  return allRecords;
	} catch (error) {
	  console.error('Error fetching product names:', error);
	  return [];
	}
  }





  ///Quick ORDER /////////////
  export const loadProduct = async (pb) => {
    console.log('Fetching chemical products...');
    
    const products = await pb.collection('Products').getList(1, 100, { 
        sort: '-created',
     
    });

    if (!products.items || products.items.length === 0) {
        //console.warn('No products');
        return [];
    }

   
    const productNames = products.items.map(product => ({
        ...product,
    }));

   // console.log('Mapped products:', productNames);

    return productNames;
};

export async function getProductdatas(pb) {
	const record = await pb.collection('Category').getFullList();
	console.log("records",record)
	if(record)
	{
		return {records : record}
	}
	else{
		return { error : "Products not Found" }
	}
}



export async function getSubCategoryDatas(pb, subid) {

    const records = await pb.collection('SubCategories').getFullList({
        expand: 'category'  
    });

    if (records) {
        const filteredRecords = records.filter(record => 
            record.expand.category.urlName === subid
        );
        if (filteredRecords.length > 0) {
            return { records: filteredRecords };
        } else {
            return { error: "No SubCategories found matching the urlName" };
        }
    } else {
        return { error: "SubCategories not found" };
    }
}

export async function getSubSubCategoryDatas(pb, subsubid) {

    const records = await pb.collection('SubSubCategories').getFullList({
        expand: 'subCategory,category'  
    });

    if (records) {
        const filteredRecords = records.filter(record => 
            record.expand.subCategory.urlName === subsubid
        );
        if (filteredRecords.length > 0) {
            return { records: filteredRecords };
        } else {
            return { error: "No SubSubCategories found matching the urlName" };
        }
    } else {
        return { error: "SubSubCategories not found" };
    }
}

export async function popularProducts(pb) {
	const record = await pb.collection('PopularProducts').getFullList({
		sort: 'order',
		expand: 'product,product.Category,product.subCategory'
	});
	return record
}

export async function getorderstatusdata(pb, orderid) {
	let records = await pb
		.collection('Orders')
		.getOne(`${orderid}`, { expand: 'products,shipdetails' });
	if (records) {
		return { order: records };
	} else {
		return { error: 'Error in fetching orderStatus Data' };
	}
}

export async function getProfileDetails(pb,userEmail){
	//console.log('load',userEmail);
	const records = await pb.collection('ChemiDashProfile').getFirstListItem(`email="${userEmail}"`,{expand:'userId'})
	//console.log("records",records);
	return {profileData:records}
}



///Updated Quick Order 
export const quick = async (pb) => {
   
    const products = await pb.collection('Products').getList(1, 2000, { 
        sort: '-created',
    });

   // console.log("I am product", products.items);

    if (!products.items || products.items.length === 0) {
        console.warn('No products found');
        return [];
    }


 
    const stocks = await pb.collection('Stocks').getList(1, 1000, 
        { 
        expand:'partNumber'
        // sort: '-created',
    });

    
    if (!stocks.items || stocks.items.length === 0) {
        console.warn('No stock data found');
    }

    const productNames = products.items.map(product => {
        
        const stock = stocks.items.find(stockItem => 
            stockItem.expand.partNumber?.id === product.id
        );

        

        return {
            ...product,
            stockQuantity: stock ? stock.stockQuantity : 0,  
        };
    });

    // console.log('Mapped products with stock quantity:', productNames);

    return productNames;
};

//returns loads Starts
export async function getreturnstatusdata(pb, invoiceid) {
	let records = await pb
		.collection('Orders')
		.getOne(`${invoiceid}`, { expand: 'products,shipdetails,dashuserprofileid' });

	if (records) {
		return { records: records };
	} else {
		return { error: 'Error in fetching orderStatus Data' };
	}
}

export async function getReturnSavedData(pb) {
	const records = await pb.collection('Returns').getFullList({
		sort: '-created'
	});
	return { records: records };
}
//returns loads ends
// Myfavourites loads starts
export async function getFavSavedData(pb,userProfileid) {
	const records = await pb.collection('Myfavourites').getFirstListItem(`userProfileId.email='${userProfileid}'`)
	return  records ;
}
//Myfavourites loads ends















// export const quick = async (pb) => {
//     // Fetch products
//     const products = await pb.collection('Products').getList(1, 1000, {
//         sort: '-created',
//     });

//     if (!products.items || products.items.length === 0) {
//         console.warn('No products found');
//         return [];
//     }

//     // Fetch stocks
//     const stocks = await pb.collection('Stocks').getList(1, 1000, {
//         expand: 'partNumber',
//     });

//     if (!stocks.items || stocks.items.length === 0) {
//         console.warn('No stock data found');
//     }

//     // // Debug: Log all products and stocks
//     // console.log('Products:', products.items);
//     // console.log('Stocks:', stocks.items);

//     // Map products with stock data
//     const productNames = products.items.map(product => {
//         // Find stock for the current product based on `partNumber` expansion
//         const stock = stocks.items.find(stockItem => 
//             stockItem.expand.partNumber?.id === product.id
//         );


//         return {
//             ...product,
//             stockQuantity: stock ? stock.stockQuantity : 0,
//         };
//     });

//     // Filter to check the specific ProductNumber
//     const testProduct = productNames.find(product => product.productNumber === '775118');

//     // Debug: Log result for the specific ProductNumber
//     console.log('Test Product 775118:', testProduct);

//     return productNames;
// };


export async function RelatedProductData(pb, productId) {
    const product = await pb.collection('Products').getFirstListItem(
      `productNumber="${productId}"`, 
      { expand: 'subsubCategory' }
    );

    let subsubCategoryId = product.expand.subsubCategory.id;
    const relatedProducts = await pb.collection('Products').getList(1, 8, {
      filter: `subsubCategory="${subsubCategoryId}"`,  
      expand: 'subCategory,manufacturerName,subsubCategory,Category',
    });

   
    for (let relatedProduct of relatedProducts.items) {
        const stockData = await pb.collection('Stocks').getFirstListItem(
          `partNumber.productNumber="${relatedProduct.productNumber}"`,  
          { expand: 'partNumber' }  
        ).catch(() => {
            return { stockQuantity: 0 };  
        });

        relatedProduct.stockQuantity = stockData.stockQuantity || 0;  
    }
    return relatedProducts.items;
}

export async function RelatedApplicationData(pb, name) {
    const relatedProducts = await pb.collection('Products').getList(1, 8, {
        filter: `description.Application~"${name}"||subsubCategory.name~"${name}" || subCategory.name~"${name}"`,  
        expand: 'subCategory,manufacturerName,subsubCategory,Category',
    });
    return relatedProducts;
}


//Checking similar and differences in product details
export async function DifferentProductData(pb, productId) {
    try {
        const product = await pb.collection('Products').getFirstListItem(
            `productNumber="${productId}"`, 
            { expand: 'subsubCategory' }
        );
        const subsubCategoryId = product.expand.subsubCategory.id;
        const differentProducts = await pb.collection('Products').getList(1, 4, {
            filter: `subsubCategory="${subsubCategoryId}"`,
            expand: 'subCategory,manufacturerName,subsubCategory,Category',
        });
        for (let relatedProduct of differentProducts.items) {
            const stockData = await pb.collection('Stocks').getFirstListItem(
                `partNumber.productNumber="${relatedProduct.productNumber}"`,
                { expand: 'partNumber' }
            ).catch(() => {
                return { stockQuantity: 0 }; 
            });
            relatedProduct.stockQuantity = stockData.stockQuantity || 0;
        }
        return differentProducts.items;
    } catch (error) {
        throw new Error("Failed to load different product data");
    }
}


///////Filter  Based on sub categories

export async function loadProductsubcategory(pb, { SubUrl }) {
    // console.log("Input SubUrl:", SubUrl);
    
    const response = await pb.collection('SubCategories').getFirstListItem(`urlName="${SubUrl}"`, { expand: 'category' });
    const subcategoryID = response.id;


    const stockRecords = await pb.collection('Products').getList(1, 300, {
        filter: `subCategory="${subcategoryID}"`,
        expand: 'subCategory,Category,manufacturerName,subsubCategory',
    });

    
    const stocks = await pb.collection('Stocks').getList(1, 1000, { 
        expand: 'partNumber',
    });


    const productNames = stockRecords.items.map(product => {
        const stock = stocks.items.find(stockItem => 
            stockItem.expand.partNumber?.id === product.id
        );

        return {
            ...product,
            manufacturerName: product.expand?.manufacturerName?.name || 'Unknown Manufacturer',
            Category: product.expand?.Category?.name || 'Unknown Category',
            subsubCategory: product.expand?.subsubCategory?.name || 'Unknown Category',
            stockQuantity: stock ? stock.stockQuantity : 0,  
        };
    });

   // console.log("I am product from load",productNames);
    return {
        type: "success",
        records: productNames,  
    };
}
