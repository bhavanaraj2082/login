<script>
    import { onMount } from 'svelte';

    let quantity = '';
    let partNumber = '';
    let errorMessage = '';

    onMount(() => {
        const quantityInput = document.getElementById('quantity');
        const partNumberInput = document.getElementById('partNumber');
        const addToCartBtn = document.querySelector('.bg-blue-500');

        addToCartBtn.addEventListener('click', function (event) {
            event.preventDefault();
            errorMessage = '';

            const quantity = quantityInput.value.trim();
            const partNumber = partNumberInput.value.trim();

            if (!validateInputs(quantity, partNumber)) {
                return;
            }

            const cartItem = {
                quantity,
                partNumber
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartJSON(cart);

            quantityInput.value = '';
            partNumberInput.value = '';
        });

        function updateCartJSON(cart) {
            const cartJSON = JSON.stringify(cart, null, 2);
            console.log('Cart JSON:', cartJSON);
        }

        function validateInputs(quantity, partNumber) {
            if (!/^\d+$/.test(quantity) || parseInt(quantity) <= 0) {
                errorMessage = 'Quantity must be a positive integer.';
                return false;
            }

            if (partNumber === '') {
                errorMessage = 'Product Name cannot be empty.';
                return false;
            }

            return true;
        }
    });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
    <section class="bg-white p-6 rounded shadow-md border max-w-md w-full">
        <div class="grid grid-cols-1 gap-4">
            <div>
                <label for="quantity" class="block text-gray-700 font-semibold">Quantity:</label>
                <input id="quantity" type="text" class="border border-gray-300 p-2 w-full rounded" bind:value={quantity} placeholder="Quantity">
            </div>

            <div>
                <label for="partNumber" class="block text-gray-700 font-semibold">Product Name:</label>
                <input id="partNumber" type="text" class="border border-gray-300 p-2 w-full rounded" bind:value={partNumber} placeholder="Product Name">
            </div>

            {#if errorMessage}
            <div class="text-red-500">
                {errorMessage}
            </div>
            {/if}

            <div class="flex justify-end">
                <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Add to Cart</button>
            </div>
        </div>

        <div class="mt-4">
            <label for="fileUpload" class="block">Upload a File:</label>
            <input id="fileUpload" type="file" class="border p-2 w-full">
        </div>

        <div class="mt-4">
            <label for="bulkText" class="block">Bulk Add:</label>
            <textarea id="bulkText" class="border p-2 w-full" placeholder="One product per line, delimiter must be a comma. (5, P4525-ND, ABC123)"></textarea>

            <div class="flex justify-end mt-2">
                <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Add Bulk Items</button>
            </div>
        </div>
    </section>
</div>
