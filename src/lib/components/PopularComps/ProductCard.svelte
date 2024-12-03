<script>
    export let product;
</script>

<div class="shadow-sm flex flex-col justify-between gap-2 border bg-white rounded-lg px-5 py-5 lg:px-10 overflow-hidden">
    <img
        src={product?.imageSrc}
        alt={product?.productName}
        class=" w-44 h-44 mx-auto object-contain rounded-t-lg"/>
    <div class="grow space-y-1 mt-4">
        <h3 class=" text-sm font-semibold">{product?.productName}</h3>
        <p class="text-gray-600 text-xs  p-2">{product?.prodDesc}</p>
    </div>
    <a
    href={product?.productNumber ?`products/${product?.category.urlName}/${product?.subCategory.urlName}/${product.productNumber}` : '#'}
        class="bg-primary-400 text-white w-full mx-auto text-sm font-medium py-2 rounded hover:bg-primary-500">
        View Details
    </a>
</div>
