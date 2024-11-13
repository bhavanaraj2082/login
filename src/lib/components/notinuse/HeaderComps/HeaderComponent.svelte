<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  let selectedFlag = "src/lib/data/HeaderComponent/images/India.JPG"; // Default flag
  let selectedName = "India"; //Default Name
  let showFlagModal = false;
  let showCart = false;
  let showPreview = false;
  let showSearchPreview = false;
  let showBarPreview = false;
  let searchQuery = "";
  let suggestions = [];
  let products = [];

  function toggleCart() {
    showCart = !showCart;
    if (showCart) {
      showPreview = false; // Hide preview when showing login/signup page
    }
  }
  function handleClick() {
    toggleCart();
  }
  function handleMouseEnter() {
    if (!showCart) {
      showPreview = true;
    }
  }

  function handleMouseLeave() {
    showPreview = false;
  }

  const flags = [
    { imgUrl: "src/lib/data/HeaderComponent/images/Germany.JPG", name: "Germany" },
    { imgUrl: "src/lib/data/HeaderComponent/images/US.JPG", name: "USA" },
    { imgUrl: "src/lib/data/HeaderComponent/images/UK.JPG", name: "UK" },
    { imgUrl: "src/lib/data/HeaderComponent/images/France.JPG", name: "France" },
    { imgUrl: "src/lib/data/HeaderComponent/images/Canada.JPG", name: "Canada" },
    { imgUrl: "src/lib/data/HeaderComponent/images/India.JPG", name: "India" },
    { imgUrl: "src/lib/data/HeaderComponent/images/Indonesia.JPG", name: "Indonesia" },
    { imgUrl: "src/lib/data/HeaderComponent/images/Italy.JPG", name: "Italy" },
    { imgUrl: "src/lib/data/HeaderComponent/images/Mexico.JPG", name: "Mexico" },
    { imgUrl: "src/lib/data/HeaderComponent/images/Nepal.JPG", name: "Nepal" },
    // Add more flags as needed
  ];

  function toggleModal() {
    showFlagModal = !showFlagModal;
  }

  function selectFlag(flag, name) {
    selectedFlag = flag;
    selectedName = name;
    showFlagModal = false; // Close modal after selection
  }

  async function fetchProducts() {
    const response = await fetch("src/lib/data/HeaderComponent/data/products.json");
    const data = await response.json();
    products = data.products;
    console.log(products);
  }

  onMount(() => {
    // Fetch products on component mount
    fetchProducts();
  });

  function handleSearchClick() {
    showSearchPreview = true; // Show the search preview when the input is clicked
  }
  function handleBarclick() {
    console.log("here");

    showBarPreview = !showBarPreview;
  }

  function handleSearchInput(event) {
    searchQuery = event.target.value;
    suggestions = products.filter((product) =>
      product.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function handleSearchClose() {
    showSearchPreview = false; // Close the search preview
    searchQuery = ""; // Clear search input
    suggestions = []; // Clear suggestions
  }

  function handleSearchbtn(suggestion) {
    console.log(suggestion);
    goto(`/${suggestion}`);
  }
</script>

<link
  href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
  rel="stylesheet"
/>
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
/>
<link
  href="/node_modules/bootstrap/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
{#if showSearchPreview && !showBarPreview}
  <header class="bg-gray-100 py-6">
    <!-- Search Preview -->
    <div
      class="fixed top-0 left-0 w-full bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded shadow-md w-full">
        <div class="flex">
          <input
            type="text"
            placeholder="Search by product name, keyword, code or CAS"
            class="border rounded-l-lg p-2 flex-grow"
            on:input={handleSearchInput}
            bind:value={searchQuery}
            on:keydown={(event) => event.key === "Enter" && handleSearchClose()}
          />
          <button
            class="bg-blue-500 text-white rounded-r-lg px-4"
            on:click={handleSearchClose}
          >
            Search
          </button>
        </div>
        {#if suggestions.length > 0}
          <ul class="mt-2 border rounded">
            {#each suggestions as suggestion}
              <li
                class="p-2 hover:bg-gray-200 cursor-pointer"
                on:click={() => {
                  searchQuery = suggestion;
                  handleSearchbtn(suggestion);
                }}
              >
                {suggestion}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
    <br />
  </header>
{:else if !showSearchPreview && !showBarPreview}
  <header class="bg-gray-100 fixed">
    <!-- full screen header start-->
    <div class="large-view">
      <!-- Top Part -->
      <div class="flex justify-between items-center p-2 bg-white text-sm px-6">
        <!-- Left Section -->
        <nav class="flex space-x-4 mx-2">
          <a
            href="/about"
            class="text-black  border-r-2 pr-4 no-underline">About Us</a
          >
          <a
            href="/quality"
            class="text-black  border-r-2 pr-4 no-underline">Quality</a
          >
          <a
            href="/resources"
            class="text-black  border-r-2 pr-4 no-underline">Resources</a
          >
          <a
            href="/help&support"
            class="text-black  border-r-2 pr-4 no-underline"
            >Help & Support</a
          >
          <a href="/contactus" class="text-black  no-underline"
            >Contact Us</a
          >
        </nav>
        <!-- Right Section -->
        <div class="flex items-center space-x-4 mx-2">
          <span class="text-black font-semibold border-r-2 pr-4"
            ><i class="fa-solid fa-phone p-2 text-base" style="color: #080808;"
            ></i>+49 (0)281 9887 0</span
          >
          <span class="text-black font-semibold pr-4"
            ><i
              class="fa-solid fa-envelope p-2 text-base"
              style="color: #080808;"
            ></i>webde@lgcgroup.com</span
          >

          <!-- flagButton -->
          <div class="relative inline-block text-left">
            <button
              on:click={toggleModal}
              class="flagbtn flex items-center bg-gray-100 rounded-full px-4 py-2 text-gray-700"
            >
              <!-- <span class="mr-2 text-xl">{selectedFlag}</span> -->
              <img
                src={selectedFlag}
                alt=" selected Flag"
                class="mr-2 h-5 w-7.5"
              />
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
          {#if showFlagModal}
            <div
              class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div class="bg-gray-100 rounded-md w-3/5 p-6 shadow-lg">
                <h2 class="text-lg font-semibold mb-4">
                  Select Your Nationality
                </h2>
                <ul class="max-h-64 overflow-y-auto">
                  {#each flags as { imgUrl, name }}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <li
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      on:click={() => selectFlag(imgUrl)}
                    >
                      <img src={imgUrl} alt={name} class="mr-2 w-1/6" />
                      {name}
                    </li>
                  {/each}
                </ul>
                <button
                  on:click={toggleModal}
                  class="mt-4 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:text-white hover:bg-red-500"
                >
                  Close
                </button>
              </div>
            </div>
          {/if}
          <!-- ********* -->
        </div>
      </div>
      <!-- flag button end -->
      <!-- Bottom Part -->
      <div
        class="flex justify-between items-center  bg-white border-t px-10"
      >
        <img src="src/lib/data/HeaderComponent/images/Logo.JPG" alt="Logo" class="w-1/12 h-1/12 " />

        <!-- input -->
        <div
          class="flex items-center border rounded-3xl p-2 px-6 w-1/2 bg-gray-100 focus:bg-white text-gray-400"
        >
          <input
            on:focus={handleSearchClick}
            type="text"
            placeholder="Search by product name, keyword, code or CAS"
            class="border-none focus:outline-none flex-grow text-base bg-gray-100 focus:text-black"
          />
          <i
            class="fa-solid fa-magnifying-glass fa-beat-fade"
            style="color: #242424;"
          ></i>
        </div>

        <!-- input end -->

        <button
          class="border-2 border-gray-300 text-black font-semibold rounded-3xl lg:px-3 lg:py-2 lg:text-nowrap md:px-2 md:py-2 md:text-nowrap "
          ><a href="/bulkOrder" class="no-underline text-black"
            ><i
              class="fa-regular fa-clipboard pr-2 text-xl"
              style="color: #050505;"
            ></i>Bulk Order</a
          ></button
        >

        <!-- Login and signupo option -->
        <button
          on:click={handleClick}
          on:mouseenter={handleMouseEnter}
          on:mouseleave={handleMouseLeave}
          class=" text-black rounded px-4 py-2 text-2xl relative flex items-center justify-center"
          ><i class="fa-solid fa-user" style="color: #030303;"></i>
          <!-- Login Preview -->
          {#if showPreview && !showCart}
            <div
              class="text-lg absolute pt-2 top-full w-64 h-auto origin-top-left transform scale-90 transition-transform duration-300 ease-in-out bg-white shadow-lg border rounded-lg"
            >
              <div class="p-2 flex flex-col items-center">
                <div
                  class="border-1 loginbutton text-white p-1 w-full text-center py-2"
                >
                  <a href="/login" class="text-white no-underline">Login</a>
                </div>
                <div>or</div>
                <div class=" p-1 py-2 createbtn">
                  <a href="/createaccount no-underline">Create account</a>
                </div>
              </div>
            </div>
          {/if}
        </button>
        <!-- ********* -->

        <a href="#" class=" text-black rounded px-4 py-2 text-3xl"
          ><i class="fa-regular fa-heart" style="color: #050505;"></i></a
        >
        <span class="relative">
          <a href="/cart" class=" text-black rounded px-4 py-2 text-3xl"
            ><i class="fa-solid fa-cart-shopping" style="color: #050505;"
            ></i></a
          ><sup
            class="superfix absolute border-1 border-black px-1 rounded-lg text-white text-sm left-12"
            >0</sup
          ></span
        >
        <!-- fetch the cart items from local storage (once cart widget is made functional and cart details is added to localstorage) -->
      </div>
    </div>
    <!-- full screen header end -->

    <!-- small screen header start -->
    <div
      class="mobile-view flex justify-between items-center py-4 bg-white border-t px-5"
    >
      <img src="src/lib/data/HeaderComponent/images/Logo.JPG" alt="Logo" class="w-1/12" />

      <!-- input -->
      <div class="flex items-center p-2 px-6 focus:bg-white text-gray-400">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <i
          on:click={handleSearchClick}
          class="fa-solid fa-magnifying-glass fa-beat-fade"
          style="color: #242424;"
        ></i>
      </div>

      <!-- input end -->
      <a href="/bulkOrder" class="no-underline text-black"
        ><i class="fa-regular fa-clipboard pr-2 text-xl" style="color: #050505;"
        ></i></a
      >

      <!-- Login and signupo option -->
      <button
        on:click={handleClick}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
        class=" text-black rounded px-4 py-2 text-xl relative flex items-center justify-center"
        ><i class="fa-solid fa-user" style="color: #030303;"></i>
        <!-- Login Preview -->
        {#if showPreview && !showCart}
          <div
            class="text-lg absolute pt-2 top-full w-64 h-auto origin-top-left transform scale-90 transition-transform duration-300 ease-in-out bg-white shadow-lg border rounded-lg"
          >
            <div class="p-2 flex flex-col items-center">
              <div
                class="border-1 loginbutton text-white p-1 w-full text-center py-2"
              >
                <a href="/login" class="text-white no-underline">Login</a>
              </div>
              <div>or</div>
              <div class=" p-1 py-2 createbtn">
                <a href="/createaccount" class="no-underline">Create account</a>
              </div>
            </div>
          </div>
        {/if}
      </button>
      <!-- ********* -->

      <a href="#" class=" text-black rounded py-2 text-xl"
        ><i class="fa-regular fa-heart" style="color: #050505;"></i></a
      >
      <span class="relative">
        <a href="/cart" class=" text-black rounded px-4 py-2 text-xl"
          ><i class="fa-solid fa-cart-shopping" style="color: #050505;"></i></a
        ><sup
          class="superfix absolute border-1 border-black px-1 rounded-lg text-white text-sm left-8"
          >0</sup
        ></span
      >
      <button on:focus={handleBarclick}>
        <i class="fa-solid fa-bars" style="color: #121212;"></i>
      </button>

      <!-- fetch the cart items from local storage (once cart widget is made functional and cart details is added to localstorage) -->
    </div>

    <!-- small screen header end -->
  </header>
{:else if showBarPreview}
 
    
<div class="bg-white shadow-md md:hidden">
  <div class="p-2">
    <!-- Flag Button -->
    <div class="flex flex-col items-start mb-2">
      <button
        on:click={toggleModal}
        class="flagbtn flex items-center bg-gray-100 rounded-full px-2 py-1 text-gray-700 text-sm"
      >
        <img src={selectedFlag} alt="Selected Flag" class="mr-2 h-5 w-1/3" />
        <span class="p-1 sm:p-0 text-base">{selectedName}</span>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      {#if showFlagModal}
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div class="bg-gray-100 rounded-md w-11/12 sm:w-3/5 p-6 shadow-lg md:p-1">
            <h2 class="text-lg font-semibold mb-4 text-sm">Select Your Nationality</h2>
            <ul class="max-h-64 overflow-y-auto">
              {#each flags as { imgUrl, name }}
                <li
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer text-sm"
                  on:click={() => selectFlag(imgUrl, name)}
                >
                  <img src={imgUrl} alt={name} class="mr-2 w-1/4 md:mr-0" />
                  <span class="text-xs">{name}</span>
                </li>
              {/each}
            </ul>
            <button
              on:click={toggleModal}
              class="mt-4 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:text-white hover:bg-red-500 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      {/if}
    </div>

    <!-- Close Button -->
    <div class="text-right  mb-2">
      <button on:click={handleBarclick} class="text-3xl">
        <i class="fa-solid fa-xmark" style="color: #050505;"></i>
      </button>
    </div>

    <!-- Contact Info -->
    <div class="flex flex-col sm:flex-row justify-between border-t ">
      <span class="text-black font-semibold pr-4 text-sm flex items-center border-r">
        <i class="fa-solid fa-phone p-2 text-base" style="color: #080808;"></i>
        <span class="p-2 text-sm text-nowrap ">+49 (0)281 9887 0</span>
      </span>
      <span class="text-black font-semibold pr-4 text-sm flex items-center border-l">
        <i class="fa-solid fa-envelope p-2 text-base" style="color: #080808;"></i>
        webde@lgcgroup.com
      </span>
    </div>
  </div>
    <table class="secondTable border w-full p-2 ">
      <tr>
        <td><a href="/about" class="block py-1">About us</a></td>
      </tr>
      <tr>
        <td><a href="/quality" class="block py-1">Quality</a></td>
      </tr>
      <tr>
        <td><a href="/resources" class="block py-1">Resources</a></td>
      </tr>
      <tr>
        <td><a href="/help&support" class="block py-1">Help & Support</a></td>
      </tr>
      <tr>
        <td><a href="/contactus" class="block py-1">Contact us</a></td>
      </tr>
    </table>
  </div>
{/if}

<style>
  header {
    width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .superfix,
  .loginbutton {
    background-color: #007088;
  }
  .createbtn a {
    color: #007088;
  }
  .createbtn a:hover,
  .loginbutton a:hover {
    font-weight: 600;
  }
  .flagbtn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 116, 204, 0.6);
  }
  @media (max-width: 768px) {
    .large-view {
      display: none;
      /* Hide large view on small screens */
    }
    .mobile-view {
      display: flex; /* Show mobile view on small screens */
    }
  }
  @media (min-width: 769px) {
    .mobile-view {
      display: none; /* Hide mobile view on larger screens */
    }
  }
  .secondTable tr td a{
   font-size: x-large;
    font-weight: 400;
    color: white;
    text-decoration: none;
  }

  .secondTable tr td{
    
    padding: 1rem;
  }
  .secondTable{
    background: #003e57;
  }
</style>
