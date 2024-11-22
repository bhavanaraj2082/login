import { writable, derived } from 'svelte/store';
import { get } from 'svelte/store';

export const filteredProducts = writable([]);
export const allProducts = writable([]);

export const ITEMS_PER_PAGE = writable(5);
export const currentPage = writable(1);
export const itemsPerPage = writable(5);
export const searchQuery = writable('');
export const selectedCategories = writable(new Set());
export const selectedManufacturers = writable(new Set());
export const sortBy = writable(''); 
export const sortOrder = writable('asc'); 
export const totalPages = writable(0);
export const pageNumbersToShow = writable([]);
export const pproducts = writable([]);
export const manufacturers = writable([]);  
export const selectedManufacturer = writable(''); 


export const paginatedProducts = derived(
  [allProducts, filteredProducts, currentPage, itemsPerPage],
  ([$allProducts, $filteredProducts, $currentPage, $itemsPerPage]) => {
    const filtered = $filteredProducts.length ? $filteredProducts : $allProducts;
    const startIdx = ($currentPage - 1) * $itemsPerPage;
    const paginated = filtered.slice(startIdx, startIdx + $itemsPerPage);
    return paginated;
  }
);


export const totalFilteredProducts = derived(
  [filteredProducts, itemsPerPage],
  ([$filteredProducts, $itemsPerPage]) => {
    return Math.ceil($filteredProducts.length / $itemsPerPage);
  }
);



export const pageNumbers = derived(
  [totalPages, currentPage],
  ([$totalPages, $currentPage]) => {
    const maxPagesToShow = 5;
    let pages = [];
    let startPage = Math.max(1, $currentPage - 2);
    let endPage = Math.min($totalPages, $currentPage + 2);

    if (endPage - startPage < maxPagesToShow) {
      if (startPage > 1) {
        startPage = endPage - maxPagesToShow + 1;
      } else {
        endPage = startPage + maxPagesToShow - 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
);


export const updateFilteredProducts = () => {
  const currentProducts = get(allProducts); 
  const searchQueryValue = get(searchQuery); 
  const selectedCategoriesValue = get(selectedCategories); 
  const selectedManufacturersValue = get(selectedManufacturers); 
  const sortByValue = get(sortBy); 
  const sortOrderValue = get(sortOrder); 

  let filteredProductsList = currentProducts;


  filteredProductsList = filteredProductsList.filter(product =>
    product.productName.toLowerCase().includes(searchQueryValue.toLowerCase())
  );


  if (selectedCategoriesValue.size > 0) {
    filteredProductsList = filteredProductsList.filter(product =>
      selectedCategoriesValue.has(product.subsubCategory)
    );
  }


  if (selectedManufacturersValue.size > 0) {
    filteredProductsList = filteredProductsList.filter(product =>
      selectedManufacturersValue.has(product.manufacturerName)
    );
  }
  
  
 
 
function formatPriceToNumber(priceString) {
  if (!priceString) return 0;
  const formattedPrice = String(priceString)
      .replace(/[^\d.-]/g, '') 
      .trim();
  return parseFloat(formattedPrice) || 0; 
}


filteredProductsList.sort((a, b) => {
let fieldA, fieldB;

if (sortByValue === 'price') {

  const priceA = a.priceSize && a.priceSize.length > 0
    ? formatPriceToNumber(a.priceSize[0]?.price) 
    : 0; 
  
  const priceB = b.priceSize && b.priceSize.length > 0
    ? formatPriceToNumber(b.priceSize[0]?.price) 
    : 0; 
  
  fieldA = priceA;
  fieldB = priceB;
} else {

  fieldA = a[sortByValue]?.toLowerCase();
  fieldB = b[sortByValue]?.toLowerCase();
}


if (sortOrderValue === 'asc') {
  return fieldA < fieldB ? -1 : (fieldA > fieldB ? 1 : 0);
} else {
  return fieldB < fieldA ? -1 : (fieldB > fieldA ? 1 : 0); 
}
});

 
  filteredProducts.set(filteredProductsList);
};


export const updatePage = (direction) => {
  const currentPageValue = get(currentPage); 
  const itemsPerPageValue = get(itemsPerPage); 
  const filteredProductsCount = get(filteredProducts).length; 

  const totalPagesValue = Math.ceil(filteredProductsCount / itemsPerPageValue);

  let newPage = currentPageValue;

  if (direction === 'next' && newPage < totalPagesValue) {
    newPage++;
  } else if (direction === 'prev' && newPage > 1) {
    newPage--;
  } else if (typeof direction === 'number') {
    newPage = direction;
  }

  currentPage.set(newPage);
};

export  function getPageNumbers() {
    const pagesToShow = [];
    const maxPagesToShow = 5; 

    let startPage = Math.max(1, currentPage - 2); 
    let endPage = Math.min(totalPages, currentPage + 2); 

    if (endPage - startPage < maxPagesToShow) {
        if (startPage > 1) {
            startPage = endPage - maxPagesToShow + 1;
        } else {
            endPage = startPage + maxPagesToShow - 1;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pagesToShow.push(i);
    }

    return pagesToShow;
}

   export  function updatePageNumbersToShow(totalPages) {
  
  const screenWidth = window.innerWidth;
  const maxPagesToShow = screenWidth <= 640 ? 2 : 5; 

  let pageNumbers = [];
  
  if (totalPages <= maxPagesToShow) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {

    pageNumbers.push(1);
    
    if (currentPage > 2) pageNumbers.push('...');
    
   
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 1) pageNumbers.push('...');
    pageNumbers.push(totalPages);
  }

  
  pageNumbersToShow = pageNumbers;
}

export function loadManufacturers(products) {
  const uniqueManufacturers = new Set();
  products.forEach(product => {
    if (product.manufacturerName) {
      uniqueManufacturers.add(product.manufacturerName);
    }
  });
  manufacturers.set(Array.from(uniqueManufacturers));
}


export function addCategory(category) {
  categories.update(currentCategories => [...currentCategories, category]); 
}


export const categories = writable([]);
export const loading = writable(false);
export const error = writable(null);


export const cartItems = writable([]);


export function handleSortChange(newSortBy) {
  sortBy.set(newSortBy);
  updateFilteredProducts();  
}

export function handleSortOrderChange(newSortOrder) {
  sortOrder.set(newSortOrder);
  updateFilteredProducts();  
}


export const authedUser = writable({
  email: ''

});


export const filteredCategories = derived(
  [categories, searchQuery],
  ([$categories, $searchQuery]) => {
    return $categories.filter(category =>
      category.toLowerCase().includes($searchQuery.toLowerCase())
    );
  }
);

export const updateCategories = (products) => {
  const categorySet = new Set();
  products.forEach(product => {
    if (product.categories && Array.isArray(product.categories)) {
      product.categories.forEach(category => categorySet.add(category));
    }
  });
  categories.set([...categorySet]); 
};

export const toggleCategory = (category) => {
  selectedCategories.update((currentSelected) => {
    const updated = new Set(currentSelected);
    if (updated.has(category)) {
      updated.delete(category);
    } else {
      updated.add(category);
    }
    return updated;
  });
};


export const getSubCategories = (products, category) => {
  if (!products || !Array.isArray(products)) {
    console.error('Invalid products array:', products);
    return [];
  }

  if (!category || typeof category !== 'string') {
    console.error('Invalid category parameter:', category);
    return [];
  }

  const subcategories = new Set();

  products.forEach((product, index) => {
    if (product && Array.isArray(product.categories)) {
      if (product.categories.includes(category)) {
        if (Array.isArray(product.subcategories)) {
          product.subcategories.forEach(subcategory => subcategories.add(subcategory));
        } else {
          console.error(`Invalid subcategories for product at index ${index}:`, product);
        }
      }
    } else {
      console.error(`Invalid or mismatched categories for product at index ${index}:`, product);
    }
  });

  return [...subcategories];
};
