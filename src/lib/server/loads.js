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


export const loadFirstProduct = async (pb) => {
   // console.log('Fetching chemical products...');

    
        const products = await pb.collection('Products').getList(1, 2000, { 
            sort: '-created',
            expand: 'manufacturerName,Category'
        });

      //  console.log('API response:', products);  

        if (!products.items || products.items.length === 0) {
            console.warn('No products found in the API response.');
            return  [] ;
        }

    
        const productsWithNames = products.items.map(product => ({
            ...product,
            manufacturerName: product.expand?.manufacturerName?.name || 'Unknown Manufacturer',
            categoryName: product.expand?.Category?.name || 'Unknown Category',
        }));

    //    console.log('Mapped products:', productsWithNames);  

        return  productsWithNames ;
    } 













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
export const loadProductsInfo = async (pb) => {
	const response = await pb.collection('Products').getList(2, 1, {}); 
	
	const formattedRecords = response.items.map(record => ({
		productId: record.id,
		productName: record.productName,
		productNumber: record.productNumber,
		prodDesc: record.prodDesc,
		imageSrc: record.imageSrc,
		safetyDatasheet: record.safetyDatasheet,
		priceSize: Array.isArray(record.priceSize) ? record.priceSize.map(item => ({
			price: item.price,
			size: item.size,
		})) : [],
		properties: record.properties || {},
		description: record.description || {},
		safetyInfo: record.safetyInfo || {},
		productSynonym: record.filteredProductData[`Synonym(S)`] || "",
	}));
	
	console.log("Formatted Product Records:", formattedRecords);

	return {
		type: "success",
		records: formattedRecords,
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





  ///Quick ORDER 
  export const loadProduct = async (pb) => {
    console.log('Fetching chemical products...');
    
    const products = await pb.collection('Products').getList(1, 2000);

    if (!products.items || products.items.length === 0) {
        //console.warn('No products');
        return [];
    }

    // Map the products without category and manufacturer information
    const productNames = products.items.map(product => ({
        ...product,
    }));

    console.log('Mapped products:', productNames);

    return productNames;
};
