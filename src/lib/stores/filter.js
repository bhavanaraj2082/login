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
export const sortBy = writable('productName'); 
export const sortOrder = writable('asc'); 
export const totalPages = writable(0);
export const pageNumbersToShow = writable([]);
export const pproducts = writable([]);


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
      selectedCategoriesValue.has(product.categoryName)
    );
  }


  if (selectedManufacturersValue.size > 0) {
    filteredProductsList = filteredProductsList.filter(product =>
      selectedManufacturersValue.has(product.manufacturerName)
    );
  }


  filteredProductsList.sort((a, b) => {
    let fieldA, fieldB;

    if (sortByValue === 'price') {
      fieldA = a.priceSize[0]?.price; 
      fieldB = b.priceSize[0]?.price;
    } else {
      fieldA = a[sortByValue]?.toLowerCase();
      fieldB = b[sortByValue]?.toLowerCase();
    }

    if (sortOrderValue === 'asc') {
      return fieldA < fieldB ? -1 : 1;
    } else {
      return fieldA > fieldB ? -1 : 1;
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

   export   function updatePageNumbersToShow(totalPages) {
  
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



export const manufacturers = writable([]);  


export const selectedManufacturer = writable(''); 


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
  email: '',

});


