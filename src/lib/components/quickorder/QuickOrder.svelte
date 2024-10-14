<script>
	import { goto } from '$app/navigation';
    import { browser } from "$app/environment";
    import Icon from "@iconify/svelte";
    import { createEventDispatcher} from "svelte";
    import * as XLSX from "xlsx";

    export let products; // prop
    let filteredProducts = [];
    console.log("products", products);

    let cart = [];
    let cartProducts = [];
    if (browser) {
     cartProducts = JSON.parse(sessionStorage.getItem("cartProducts")) || [];
    }
    let jsonData = [];
    let fileError = "";
    let dropArea;
    let rows = [
        { sku: "", quantity: 1 },
        { sku: "", quantity: 1 },
        { sku: "", quantity: 1 },
    ];
    let toggle = false;

    const dispatch = createEventDispatcher();

    function handleDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }

    function handleDragOver(event) {
        event.preventDefault(); // Prevent default to allow drop
    }
    function handleFileInputChange(event) {
        const files = event.target.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }
    function handleFileUpload(selectedfile) {
        const file = selectedfile;
        fileError = "";

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                try {
                    jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                    });
                    //console.log("logs",jsonData);
                    const keys = jsonData[0];
                    let newArr = jsonData.filter((x) => {
                        if (x.length !== 0) {
                            return x;
                        }
                    });
                    jsonData = newArr.slice(1).map((row) => {
                        return row.reduce((obj, value, index) => {
                            obj[keys[index]] = value;
                            return obj;
                        }, {});
                    });
                    console.log(jsonData);
                } catch (err) {
                    fileError = "Error parsing the file.";
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function addRows() {
        for (let i = 0; i < 5; i++) {
            rows = [...rows, { sku: "", quantity: 1 }];
        }
    }
    function handleProductFilter(productNumber) {
        console.log("first", productNumber);
        if (productNumber.length > 2) {
            filteredProducts = products.filter((product) =>
                product.productNumber.includes(productNumber),
            );
            console.log("object", filteredProducts);
        }
    }

    function getProduct(productNumber) {
        let singleproduct = products.filter(
            (product) => product.productNumber === productNumber,
        );
        let search = cart.find(crt=>crt.productNumber == singleproduct[0].productNumber)
        if(search === undefined) cart.push(singleproduct[0]);
        console.log("cart", cart);
    }

    function addToCart(rows, carts) {
        //console.log("rows", rows);
       // console.log("carts", carts);
        let addCart = carts.map((cart) => {
            let combine = rows.filter((row) => row.sku === cart.productNumber);
            //console.log("combine", combine);
            cart.Quantity = combine[0].quantity;
            return cart;
        });
        console.log("add to cart", addCart);
        sessionStorageFilter(addCart)
        cart = []
        goto('/cart')
        //sessionStorage.setItem("cartProducts", JSON.stringify(addCart));
    }

    function filterItem(productNumber) {
        return cart.filter(
            (product) => product.productNumber === productNumber,
        );
    }

    function deleteItem(productNumber) {
        cart = cart.filter(
            (product) => product.productNumber !== productNumber,
        );
        console.log("delete", cart);
        //filteredItems = cart.filter(product=>product.productNumber !== productNumber)
    }

    function bulkToCart(fileData) {
        let addCart = fileData.map((data) => {
            let combine = products.filter(
                (product) => product.productNumber == data.SKU
            );
           // console.log("combine", combine);
            data.priceSize = combine[0].priceSize;
            data.prodDesc = combine[0].prodDesc;
            data.productName = combine[0].productName;
            data.productNumber = combine[0].productNumber;
            delete data.SKU;
            return data;
        });
        console.log("bulk to cart", addCart);
        sessionStorageFilter(addCart)
        jsonData=[]
        goto('/cart')
        //sessionStorage.setItem('cartProducts',JSON.stringify(addCart))
    }

    function sessionStorageFilter(products) {
        let carts = JSON.parse(sessionStorage.getItem("cartProducts")) || []
        console.log('session Products',cart);
        if (carts.length === 0) {
            sessionStorage.setItem("cartProducts", JSON.stringify(products));
        } else {
          products.map((product) => {
                let combine = carts.filter((cart) => cart.productNumber == product.productNumber);
                console.log('session',combine);
                if(combine.length === 0){
                    carts.push(product)
                    sessionStorage.setItem('cartProducts',JSON.stringify(carts))
                }
            });
            // console.log("filtered",filtered);
            // console.log("cartproducts",cartProducts);
           
        }
    }
</script>

<main class="w-11/12 mx-auto py-5 xl:max-w-6xl">
    <h1 class=" font-bold text-lg md:text-2xl">Quick Order</h1>
    <div class=" flex justify-normal md:justify-end">
        <div
            class=" flex items-center gap-2 w-72 text-xs rounded-md p-3 border border-primary-100 shadow-sm bg-white shadow-primary-100 my-1"
        >
            <Icon
                icon="mingcute:warning-line"
                class=" text-primary-500 text-4xl shrink-0"
            /><span
                >Sign in to import items from your recent orders and quotes.</span
            >
        </div>
    </div>

    <div class=" my-4">
        <button
            on:click={() => (toggle = false)}
            class=" px-5 py-2 text-sm font-semibold {toggle
                ? 'bg-primary-200'
                : 'bg-white border-b-2 border-primary-500 text-primary-500'} "
            >Manual Entry</button
        >
        <button
            on:click={() => (toggle = true)}
            class=" px-5 py-2 text-sm font-semibold {toggle
                ? 'bg-white border-b-2 border-primary-500 text-primary-500'
                : 'bg-primary-200'} ">Bulk Upload</button
        >
    </div>

    {#if toggle}
        <div>
            <p class=" text-2s md:text-xs font-medium py-1.5">
                Type or paste product SKU (product number and pack size),
                quantity, promo code and reference number separated by commas*.
                Enter separate products on new lines.
            </p>
            <section class=" w-full mx-auto md:flex items-center gap-5">
                <div
                    class=" md:w-3/5 h-72 border-1 bg-white rounded overflow-hidden overflow-y-scroll scroll p-5"
                >
                    {#if jsonData.length > 0}
                        <div class=" text-sm">
                            {#each jsonData as { SKU, Quantity }}
                                <p>{SKU},{Quantity}</p>
                            {/each}
                        </div>
                    {:else}
                        <div class=" text-gray-300 text-sm">
                            <p>Example</p>
                            <p>TP23-47474,50</p>
                            <p>57-67574,1</p>
                            <p>23-UR474,20</p>
                            <p>T3-78894,100</p>
                        </div>
                    {/if}
                </div>
                <section class="mt-3 md:mt-0 md:w-2/5">
                    <div
                        class=" flex justify-center bg-white items-center h-12 border-1 rounded"
                    >
                    <a class=" flex items-center gap-2 text-sm font-medium text-primary-500"
                     href="/quick_order_template.csv" download>
                        <Icon icon="pajamas:download" class="text-lg" /> Download Template 
                    </a>
                    </div>
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        bind:this={dropArea}
                        on:drop={handleDrop}
                        on:dragover={handleDragOver}
                        class=" w-full flex flex-col justify-center bg-white items-center rounded h-56 mt-3 space-y-2 py-10 border-1 border-dashed"
                    >
                        <Icon
                            icon="uil:upload"
                            class=" text-3xl text-primary-500 -ml-4"
                        />

                        <p class="text-xs">
                            Drag and Drop your CSV or XLS file to upload or
                        </p>
                        <!-- <p class=" text-sm font-medium">Maximum of 400 parts per order</p> -->
                        <label for="bulkupload" class=" text-xs mr-3">
                            <span class="font-medium text-primary-600"
                                >Chooose File</span
                            >
                            <input
                                id="bulkupload"
                                class="hidden"
                                type="file"
                                accept=".xlsx, .xls, .csv,.txt"
                                on:change={handleFileInputChange}
                            />
                        </label>
                    </div>
                </section>
            </section>
            <p class=" text-2s md:text-xs font-medium py-1.5">
                *Promo codes and references numbers cannot be used when
                requesting quotes.
            </p>
        </div>
    {:else}
        <section>
            <p class=" text-2s font-medium py-1.5">
                Enter the product SKU (product number and pack size) and
                quantity for each item you would like to order.
            </p>
            {#each rows as row}
                <div class="relative md:flex gap-5 my-3">
                    <input
                        type="text"
                        bind:value={row.sku}
                        on:input={() => handleProductFilter(row.sku)}
                        class="w-full rounded outline-none border-1 px-2 py-2 text-sm"
                        placeholder="Product Number - Pack Size"
                    />
                    {#if filteredProducts.length > 0 && row.sku.length <= 4 && row.sku}
                        <ul
                            class=" absolute z-30 w-3/4 text-sm shadow-sm top-11 border-1 rounded bg-white"
                        >
                            {#each filteredProducts as { productNumber }}
                                <li>
                                    <button
                                        class=" w-full py-2 px-4 text-left hover:bg-primary-50"
                                        on:click={() => {
                                            row.sku = productNumber;
                                            getProduct(productNumber);
                                            filteredProducts = [];
                                        }}>{productNumber}</button
                                    >
                                </li>
                            {/each}
                        </ul>
                    {/if}

                    <div
                        class=" w-full md:w-72 mt-3 md:mt-0 flex items-center gap-2"
                    >
                        <input
                            type="number"
                            min="1"
                            bind:value={row.quantity}
                            class="w-2/3 grow text-center border-1 rounded bg-white font-medium h-10 outline-none py-2"
                        />
                        <button
                            class=" outline-none"
                            on:click={() => (row.quantity += 1)}
                        >
                            <Icon
                                icon="ic:round-plus"
                                class="text-lg border-1 rounded  bg-white text-primary-500 w-12 h-10 p-2"
                            />
                        </button>
                        <button
                            class=" outline-none"
                            on:click={() =>
                                row.quantity <= 1
                                    ? (row.quantity = 1)
                                    : (row.quantity -= 1)}
                        >
                            <Icon
                                icon="ic:round-minus"
                                class="text-lg border-1 rounded  bg-white text-primary-500 w-12 h-10 p-2"
                            />
                        </button>
                    </div>
                </div>
                {#each filterItem(row.sku) as { productName, productNumber, priceSize }}
                    <section
                        class=" flex flex-wrap items-center py-3 text-xs md:text-sm gap-5 md:gap-8 px-4 font-medium"
                    >

                        <div>
                            <h3 class="my-2">Product Number</h3>
                            <span>{productNumber}</span>
                        </div>
                        <div>
                            <h3 class="my-2">Product Name</h3>
                            <div>
                                {productName.length > 30
                                    ? productName.split(0, 20) + "..."
                                    : productName}
                            </div>
                        </div>
                        <div>
                            <h3 class="my-2">Pack Size</h3>
                            <span>{priceSize[0].size}</span>
                        </div>
                        <div>
                            <h3 class="my-2">Price</h3>
                            <span>{priceSize[0].price}</span>
                        </div>
                        <button
                            on:click={() => {
                                row.sku = "";
                                deleteItem(productNumber);
                            }}
                            class="self-end"
                            ><Icon
                                icon="charm:cross"
                                class=" text-xl text-left"
                            /></button
                        >
                    </section>
                {/each}
            {/each}
            <button on:click={addRows} class=" text-primary-500 uppercase text-xs md:text-sm"
                >+ add more</button
            >
        </section>
    {/if}

    <div class=" flex justify-end">
        <button
            on:click={() => {
                if (toggle) {
                    bulkToCart(jsonData);
                } else {
                    addToCart(rows, cart);
                }
            }}
            class="flex items-center gap-2 px-5 py-1 md:py-2 text-xs md:text-sm uppercase font-medium text-white bg-primary-500 rounded my-2 float-end"
        >
            Add to cart <Icon
                icon="ion:cart-outline"
                class=" text-2xl shrink-0"
            />
        </button>
    </div>
</main>

<!-- ()=>dispatch("onClick",{jsonData}) -->
