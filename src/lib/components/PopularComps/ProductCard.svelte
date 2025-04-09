<script>
    export let product;
    import {PUBLIC_IMAGE_URL} from "$env/static/public"
</script>

<div class="shadow flex flex-col justify-between gap-2 bg-white rounded-lg px-5 py-5 lg:px-10 overflow-hidden hover:shadow-md">
    <img
        src={`${PUBLIC_IMAGE_URL}/${product?.image}`}
        alt={product?.productName}
        onerror="this.src='/fallback.jpg'"
        class=" w-44 h-44 mx-auto object-contain rounded-t-lg"/>
    <div class="grow space-y-1 mt-4">
        <h3 class=" text-sm font-semibold">{product?.productName}</h3>
        <p class="text-gray-600 text-xs  p-2">{product?.prodDesc}</p>
    </div>
    <a
    href={product?.productNumber ?`products/${product?.category.urlName}/${product?.subCategory.urlName}/${product.productNumber}` : '#'}
        class="bg-primary-400 text-white md:w-full w-10/12 mx-auto text-sm font-medium py-2 rounded-md hover:bg-primary-500 md:mb-2.5 mb-2 transition-all duration-300">
        View Details
    </a>
</div>
