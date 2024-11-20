<script>
    export let product;
</script>

<div    
    class="shadow-sm flex flex-col justify-between border bg-white rounded-lg pb-6 overflow-hidden"
>
    <img
        src={product?.imageSrc}
        alt={product?.productName}
        class="w-48 h-48 mx-auto object-contain rounded-t-lg mb-4"
    />
    <div class="flex-1 space-y-2">
        <h3 class="text-xl font-semibold">{product?.productName}</h3>
        <p class="text-gray-600 h-16 p-2">{product?.prodDesc}</p>
    </div>
    <a
    href={`products/${product.expand?.Category?.urlName}/${product.expand?.subCategory?.urlName}/${product.productNumber}`}
        class="bg-primary-400 text-white w-5/6 mx-auto py-2.5 rounded hover:bg-primary-500 mt-4"
    >
        View Details
    </a>
</div>
