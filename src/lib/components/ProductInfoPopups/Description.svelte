<script>
  import { PUBLIC_WEBSITE_URL } from "$env/static/public";
  export let data;
</script>

{#each data.records as product}
  {#if product.description && ((Array.isArray(product.description) && product.description.length > 0) || (typeof product.description === "object" && Object.keys(product.description).length > 0))}
    <div
      class="md:w-11/12 max-w-7xl p-4 mx-auto text-justify bg-white shadow rounded m-10"
      id="des"
    >
      <h3 class="text-xl font-bold text-heading uppercase mb-3">Description</h3>
      {#if Array.isArray(product.description)}
        <ul class="list-disc pl-6">
          {#each product.description as item}
            <li class="text-gray-700 text-sm mt-2 break-words">{item}</li>
          {/each}
        </ul>
      {:else}
        <ul>
          {#each Object.entries(product.description) as [key, value]}
            <li class="text-gray-700 text-sm mt-2 break-words">
              <strong class="text-sm font-bold capitalize">{key}:</strong>
              {value}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  {#if product.safetyInfo}
    {#if Array.isArray(product.safetyInfo)}
      {#if product.safetyInfo.length > 0}
        <section
          class="md:w-11/12 max-w-7xl p-4 mx-auto text-justify bg-white shadow rounded m-10"
        >
          <h2 class="text-xl font-bold mb-3">SAFETY INFORMATION</h2>
          <ul class="list-disc pl-5">
            {#each product.safetyInfo as item}
              {#if item.includes(":")}
                <li class="text-gray-600 text-sm font-normal mt-1">
                  <strong class="font-semibold">
                    {@html item.split(/:(.+)/)[0]}:
                  </strong>
                  {@html item.split(/:(.+)/)[1].trim()}
                </li>
              {:else}
                <li class="text-gray-600 text-sm font-normal mt-1">{item}</li>
              {/if}
            {/each}
          </ul>
        </section>
      {/if}
    {:else if Object.values(product.safetyInfo).filter( (value) => value?.trim() ).length > 0}
      <section
        class="md:w-11/12 max-w-7xl p-4 mx-auto text-justify bg-white shadow rounded m-10"
      >
        <h2 class="text-xl font-bold mb-3">SAFETY INFORMATION</h2>
        <div class="grid grid-cols-2 gap-9 md:grid-cols-3">
          {#each Object.entries(product.safetyInfo).filter( ([key, value]) => value?.trim() ) as [key, value]}
            <div>
              <h3 class="font-semibold text-base">{key}</h3>
              {#if ["Pictograms", "Precautionary Statements", "Hazard Statements"].includes(key)}
                <p
                  class="text-primary-500 text-sm font-medium mt-1 cursor-pointer"
                >
                  <a
                    href="{PUBLIC_WEBSITE_URL}/safety/hazard-and-precautionary-statements#{key
                      .toLowerCase()
                      .replace(' ', '-')}"
                  >
                    {value}
                  </a>
                </p>
              {:else}
                <p class="text-gray-600 text-sm font-normal mt-1">{value}</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}
  {/if}
{/each}
