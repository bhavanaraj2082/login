<script>
  import { enhance } from "$app/forms";
  import RecommendProducts from "$lib/components/RecommendProducts/RecommendProducts.svelte";
  let productName = "";
  let products = [];
  let message = "";
  let errormessage = "";


</script>

<div class="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-md bg-white">
  <h1 class="text-2xl font-semibold mb-5">Product Information</h1>
  <form
    method="post"
    action="?/fetchrecommended"
    use:enhance={() => {
      return async ({ result }) => {
        console.log("I am use enhance");

        console.log(result);

        if (result.data.record && result.type === "success") {
          // console.log(`${result.data.message}`);
          
          products = result.data.record;
          message = "Recommended products data fetched succesfully";
        } else {
          console.error(`${result.data.error}`, result.data.details);
          errormessage =
            "There was an error fetching recommended products. Please try again.";
          alert(
            "There was an error fetching recommended products. Please try again."
          );
        }
      };
    }}
  >
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700" for="productName"
        >Product Name</label
      >
      <input
        type="text"
        id="productName"
        name="productName"
        placeholder="make sure the product name is present in database"
        bind:value={productName}
        required
        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
    </div>
    <button
      type="submit"
      class="w-full bg-primary-500 text-white font-semibold py-2 rounded-md hover:bg-primary-600 transition"
    >
      Submit
    </button>
  </form>
</div>

{#if products.length > 0}
  <div class="mt-10">
    <RecommendProducts data={products} />
  </div>
{/if}
