<script>

    let isSameAddress = false;

    const handleIsSameAddress =(e)=>{
       e.target.checked ? isSameAddress = true : isSameAddress = false
    }
</script>

<main class=" max-w-sm mx-auto md:max-w-2xl lg:max-w-3xl">
    <h1 class=" font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl py-3">
        My Details
    </h1>

    <form
        method="POST"
        action="?/mydetails"
        class=" bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-sm border shadow-lg"
    >
        <section class="md:flex items-center gap-6">
            <div class="my-1 md:w-24 lg:w-28">
                <label class=" text-xs font-medium" for="title">Title</label><br
                />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="title"

                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
            <div class="my-1 md:w-72">
                <label class=" text-xs font-medium" for="firstname"
                    >First Name</label
                ><br />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="firstname"

                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
            <div class="my-1 md:w-72">
                <label class=" text-xs font-medium" for="lastname"
                    >Last Name</label
                ><br />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="lastname"

                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
        </section>
        <div class="my-1">
            <label class=" text-xs font-medium" for="mobilenumber"
                >Mobile Number</label
            ><br />
            <input
                class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                type="text"
                name="mobilenumber"
            />
            <small class=" text-[10px] text-red-500"></small>
        </div>
        <div class="my-1">
            <label class=" text-xs font-medium" for="email">Email</label><br />
            <input
                class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                type="text"
                name="email"
            />
            <small class=" text-[10px] text-red-500"></small>
        </div>
        <section class=" flex items-center gap-6">
            <div class="my-1 md:w-[48%]">
                <label class=" text-xs font-medium" for="organizationname"
                    >Organization Name</label
                ><br />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="organizationname"

                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
            <div class="my-1 md:w-[48%]">
                <label class=" text-xs font-medium" for="chemikartaccountno"
                    >Chemikart Account Number</label
                ><br />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="chemikartaccountno"

                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
        </section>
        <h4 class=" font-bold text-sm mt-3">Billing Address</h4>
        <div class="my-1">
            <label class=" text-xs font-medium" for="billingaddress1"
                >Address Line 1</label
            ><br />
            <input
                class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                type="text"
                name="billingaddress1"
            />
            <small class=" text-[10px] text-red-500"></small>
        </div>
        <div class="my-1">
            <label class=" text-xs font-medium" for="billingaddress2"
                >Address Line 2</label
            ><br />
            <input
                class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                type="text"
                name="billingaddress2"
            />
            <small class=" text-[10px] text-red-500"></small>
        </div>
        <section class=" flex items-center gap-6">
            <div class="my-1 md:w-[48%]">
                <label class=" text-xs font-medium" for="country">Country</label
                ><br />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="country"

                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
            <div class="my-1 md:w-[48%]">
                <label class=" text-xs font-medium" for="state">State</label><br
                />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="state"

                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
        </section>
        <section class=" flex items-center gap-6">
            <div class="my-1 md:w-[48%]">
                <label class=" text-xs font-medium" for="city">City</label><br
                />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="city"

                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
            <div class="my-1 md:w-[48%]">
                <label class=" text-xs font-medium" for="postcode"
                    >Post Code</label
                ><br />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="postcode"
                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
        </section>
        <div class="my-1">
            <h4 class=" font-bold text-sm mt-3">Delivery Address</h4>
            <div class=" flex items-center gap-2 my-1 text-xs">
                <input on:change={e=>handleIsSameAddress(e)} type="checkbox" /><span>same as Billing details</span>
            </div>
        </div>
        {#if !isSameAddress}
            <div class="my-1">
                <label class=" text-xs font-medium" for="deliveryaddress1"
                    >Address Line 1</label
                ><br />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="deliveryaddress1"
                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
            <div class="my-1">
                <label class=" text-xs font-medium" for="deliveryaddress2"
                    >Address Line 2</label
                ><br />
                <input
                    class=" outline-none text-sm mt-1 w-full border-[1.5px] p-1.5 border-gray-400 rounded-sm"
                    type="text"
                    name="deliveryaddress2"
                />
                <small class=" text-[10px] text-red-500"></small>
            </div>
        {/if}

        <button
            class=" w-full py-1.5 my-3 bg-black text-white rounded-sm text-sm font-medium"
               type="submit">Submit</button
        >
       
    </form>
</main>
