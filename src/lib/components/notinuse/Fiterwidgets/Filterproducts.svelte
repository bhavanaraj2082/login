<script>
    import Icon from '@iconify/svelte';
    export let paginatedProducts = [];
    export let isFavorited = [];
    export let currentQuantities = [];
    export let toggleFavorite;
    export let incrementQuantity;
    export let decrementQuantity;
    let showModal = false;
    let showCoAModal = false;
    let showSDSModal = false;
    let indexToToggle;
    let isLoggedIn = false; 
    let lotNumberSearch = '';
    let email = '';
    let password = '';
    let isChecked = false;
    let showCheckbox = false;
    let filteredProducts = [];
    let selectedCountry = '';

    $: filteredProducts = paginatedProducts.filter(product =>
        product.code.includes(lotNumberSearch)
    );

    function closeModal() {
        showModal = false;
    }

    async function validateLogin() {
        const response = await fetch('/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        console.log('Login response:', result);

        if (response.ok && result.success) {
            window.location.href = '/';
        } else {
            alert(result.error || 'Login failed');
        }
    }

    function toggleCheckbox() {
        isChecked = !isChecked;
        if (isChecked && filteredProducts.length > 0) {
            lotNumberSearch = filteredProducts[0].code;
        } else {
            lotNumberSearch = '';
        }
    }

    function handleFocus() {
        showCheckbox = true;
    }

    function handleBlur() {
        setTimeout(() => {
            showCheckbox = false;
        }, 200);
    }

    const countries = ['United Kingdom', 'Canada', 'India', 'Germany', 'France', 'Italy', 'Spain'];

    function downloadCoA(productCode) {
        const url = `/downloadCoA/${productCode}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = `CoA_${productCode}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function downloadSDS(productCode) {
        const url = `/downloadSDS/${productCode}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = `SDS_${productCode}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
</script>

<div>
    {#if paginatedProducts.length > 0}
        {#each paginatedProducts as product, index}
            <div class="flex flex-col w-[90%] border rounded-lg shadow-md p-4 m-8">
                <div class="flex justify-between items-center mb-4">
                    <div class="text-lg font-bold flex-1 text-left ml-4">
                        <a href={product.link} class="text-gray-800 hover:underline">{product.name}</a>
                    </div>
                    <button
                        on:click={() => {
                            if (!isLoggedIn) {
                                showModal = true;
                                indexToToggle = index;
                            } else {
                                toggleFavorite(index);
                            }
                        }}
                        class="bg-transparent border-none p-0 mr-2"
                        aria-label="Toggle favorite"
                    >
                        <Icon 
                            icon={isFavorited[index] ? 'prime:heart-fill' : 'prime:heart'} 
                            class={`text-3xl ${isFavorited[index] ? 'text-primary-600' : 'text-primary-400'}`} 
                        />
                    </button>
                </div>

                <div class="flex">
                    <div class="w-44 h-44 mr-4">
                        <img
                            src={product.imageUrl}
                            alt={product.code}
                            class="w-full h-full object-cover rounded-lg border"
                        />
                    </div>
                    <div class="flex flex-col flex-grow justify-center">
                        <div class="text-base ">
                            {#each [
                                { label: "Product Code", value: product.code },
                                { label: "Brand", value: product.brand },
                                { label: "Product Format", value: product.format },
                                { label: "API Family", value: product.apiFamily }
                            ] as { label, value }}
                                <div class="mb-1">
                                    <span class="m-2 text-gray-800 text-lg">{label}:</span>
                                    <span class="text-gray-800 text-lg">{value}</span>
                                </div>
                            {/each}
                        </div>
                        <div class="flex items-center mt-4">
                            <Icon icon="mdi:file-document" class="text-primary-400 w-4 h-4 mr-1 " />
                            <span class="text-primary-400 font-bold cursor-pointer" on:click={() => { showCoAModal = true; indexToToggle = index; }}>CoA</span>
                            
                            <Icon icon="mdi:file-document-outline" class="text-primary-400 w-4 h-4 ml-5" />
                            <span class="text-primary-400 font-bold cursor-pointer" on:click={() => { showSDSModal = true; indexToToggle = index; }}>SDS</span>
                        </div>
                        <div class="flex flex-col sm:flex-row items-center justify-between mt-4">
                            <span class="text-gray-700 font-bold mb-2 sm:mb-0">
                                Price: ₹{product.price.toLocaleString()}
                            </span>
                            <div class="flex items-center space-x-2 text-primary-500 border border-gray-300 rounded h-9 mb-2 sm:mb-0">
                                <button on:click={() => decrementQuantity(index)} class="font-bold w-8 h-8 rounded hover:bg-primary-500 hover:text-white">-</button>
                                <input type="text" class="w-12 h-8 text-center rounded text-base border-none bg-gray-100" value={currentQuantities[index]} readonly />
                                <button on:click={() => incrementQuantity(index)} class="font-bold w-8 h-8 rounded hover:bg-primary-500 hover:text-white">+</button>
                            </div>
                            <button class="text-primary-400 bg-white border border-primary-400 p-2 rounded text-sm font-bold w-full sm:w-auto mt-2 sm:mt-0">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    {:else}
        <p>No products found.</p>
    {/if}

    <!-- Modal for Login/Register -->
    {#if showModal}
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6 w-130 relative">
                <button
                    on:click={closeModal}
                    class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    aria-label="Close"
                >
                    <Icon icon="mdi:close" class="text-xl" />
                </button>
                <h2 class="text-xl font-bold mb-4">Please login or register to add to your favourites</h2>
                <p class="mb-4 text-gray-400">Or continue browsing without access to favourites or pricing.</p>
                <label class="block font-bold text-gray-600 mb-2">Email</label>
                <input type="email" class="border rounded w-full mb-4 p-2" placeholder="Enter your email" bind:value={email} />
                <label class="block font-bold text-gray-600 mb-2">Password</label>
                <input type="password" class="border rounded w-full mb-4 p-2" placeholder="Enter your password" bind:value={password} />
                <button on:click={validateLogin} class="bg-primary-400 text-white p-2 rounded w-full mb-4">Login</button>
                <a href="/forgotpassword" class="text-primary-400 mb-2 block text-center">Forgotten password?</a>
                <div class="flex justify-between">
                    <a href="/" class="text-gray-500" on:click|preventDefault={closeModal}>Continue browsing</a>
                    <a href="/register" class="text-primary-400">Create an account</a>
                </div>
            </div>
        </div>
    {/if}

    <!-- CoA Modal -->
    {#if showCoAModal}
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6 w-180 relative">
                <button
                    on:click={() => showCoAModal = false}
                    class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    aria-label="Close"
                >
                    <Icon icon="mdi:close" class="text-xl" />
                </button>
                <h2 class="text-xl font-bold mb-4">Certificate of Analysis</h2>
                <p class="text-gray-800 mb-4">Pack Size: 
                    <span class="font-bold border border-gray-300 rounded px-2 py-1 bg-gray-100">{paginatedProducts[indexToToggle].weight} kg</span>
                </p>
                
                <p class="mb-4 flex items-center text-primary-400">
                    CoA Specimen ({paginatedProducts[indexToToggle].code})
                    <button 
                        on:click={() => downloadCoA(paginatedProducts[indexToToggle].code)} 
                        class="text-primary-400 p-2 rounded ml-2 flex items-center"
                    >
                        <Icon icon="mdi:download" class="w-6 h-6 mr-1" />
                    </button>
                </p>
                <p class="p-2 text-gray-600 ml-10">Looking for another lot?</p>
                <div>
                    <input
                        type="text"
                        class="border rounded w-full mb-4 p-2"
                        bind:value={lotNumberSearch}
                        placeholder="Enter Lot Number"
                        on:focus={handleFocus}
                        on:blur={handleBlur}
                    />
                </div>
                {#if showCheckbox && filteredProducts.length > 0}
                    <div class="flex items-center mb-4">
                        <input 
                            type="checkbox" 
                            id="productCodeCheckbox" 
                            class="mr-2" 
                            checked={isChecked}
                            on:change={toggleCheckbox} 
                        />
                        <label for="productCodeCheckbox" class="text-gray-800">
                            {filteredProducts[0].code}
                        </label>
                    </div>
                {/if}
                {#if isChecked && filteredProducts.length > 0}
                    <div class="text-gray-500">
                        <p>Product Code: {filteredProducts[0].code}</p>
                        <p>Brand: {filteredProducts[0].brand}</p>
                        <p>Format: {filteredProducts[0].format}</p>
                        <p>API Family: {filteredProducts[0].apiFamily}</p>
                        <p>Price: ₹{filteredProducts[0].price.toLocaleString()}</p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    <!-- SDS Modal -->
    {#if showSDSModal}
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6 w-180 relative">
                <button
                    on:click={() => showSDSModal = false}
                    class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    aria-label="Close"
                >
                    <Icon icon="mdi:close" class="text-xl" />
                </button>
                <h2 class="text-xl font-bold mb-4">Safety Data Sheet</h2>
                <p class="text-gray-800 mb-4">Pack Size: 
                    <span class="font-bold border border-gray-300 rounded px-2 py-1 bg-gray-100">{paginatedProducts[indexToToggle].weight} mg</span>
                </p>
                <p class="mb-4 flex items-center text-primary-400">
                    SDS Document (United Kingdom (EU REACH)) <Icon icon="mdi:download" class="w-6 h-6 mr-1 ml-5" />
                </p>
                <p class="mb-4 text-gray-600 text-center">Find an SDS for your region.</p>

                <select bind:value={selectedCountry} class="border rounded w-full p-2 mb-4">
                    <option value="" disabled>Looking for another SDS</option>
                    {#each countries as country}
                        <option value={country}>{country}</option>
                    {/each}
                </select>
                {#if selectedCountry}
                    <button 
                        on:click={() => downloadSDS(paginatedProducts[indexToToggle].code)} 
                        class="text-white bg-primary-400 justify-centre p-2 rounded flex items-center"
                    >
                        <Icon icon="mdi:download" class="w-6 h-6 mr-1" />
                        Download SDS
                    </button>
                {/if}
            </div>
        </div>
    {/if}
</div>
