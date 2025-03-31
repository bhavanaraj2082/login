<script>
    import { page } from "$app/stores";
    import Terms from "$lib/components/Footerlinks/SiteTerms.svelte";
    import ProductLicense from "$lib/components/Footerlinks/Condition.svelte";
    import Privacynotice from "$lib/components/Footerlinks/Privacy.svelte";
    import Conditions from "$lib/components/Footerlinks/ProductLicence.svelte";
    import PageNotFound from "$lib/components/PageNotFound.svelte";

    let contentComponent;

    try {
        {
            const pathname = $page.url.pathname;

            if (pathname === "/terms/site-and-terms") {
                contentComponent = Terms;
            } else if (pathname === "/terms/product-license") {
                contentComponent = ProductLicense;
            } else if (pathname === "/terms/privacy-notice") {
                contentComponent = Privacynotice;
            } else if (pathname === "/terms/conditions") {
                contentComponent = Conditions;
            } else {
                throw new Error("Page Not Found");
            }
        }
    } catch (error) {
        contentComponent = PageNotFound;
    }

    function showSection(section) {
        let url = "";
        let component;

        if (section === "siteTerms") {
            url = "/terms/site-and-terms";
            component = Terms;
        } else if (section === "productLicense") {
            url = "/terms/product-license";
            component = ProductLicense;
        } else if (section === "privacynotice") {
            url = "/terms/privacy-notice";
            component = Privacynotice;
        } else if (section === "conditions") {
            url = "/terms/conditions";
            component = Conditions;
        }

        if (typeof window !== "undefined") {
            window.history.pushState({}, "", url);
        }

        contentComponent = component;
    }
</script>

{#if contentComponent === PageNotFound}
    <PageNotFound />
{:else}
    <div class="w-11/12 mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row pt-3 lg:px-4 px-4">
            <aside class="w-full md:w-1/3 lg:px-4">
                <h1 class="text-heading font-bold text-xl md:text-2xl">
                    {#if contentComponent === Terms}
                        Site Use Terms
                    {:else if contentComponent === ProductLicense}
                        Product Licenses
                    {:else if contentComponent === Privacynotice}
                        Privacy Notice
                    {:else if contentComponent === Conditions}
                        General Terms
                    {/if}
                </h1>

                <hr class="border-b border-gray-300 mb-2 mt-4" />

                <button
                    class={`sm:text-xl text-md mt-3 hover:scale-105 font-medium mb-2 whitespace-normal text-black w-full text-left pl-3 cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 hover:border-l-4 hover:border-primary-400 hover:pl-2 hover:bg-primary-50 hover:rounded-r ${contentComponent === Terms ? "text-primary-400 border-l-4 border-primary-400 px-2 bg-primary-50" : "text-black"}`}
                    on:click={() => showSection("siteTerms")}
                >
                    Site Use Terms
                </button>
                <hr class="border-b border-gray-300" />

                <button
                    class={`sm:text-xl text-md mt-3 hover:scale-105 font-medium mb-2 whitespace-normal text-black w-full text-left pl-3 cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 hover:border-l-4 hover:border-primary-400 hover:pl-2 hover:bg-primary-50 hover:rounded-r ${contentComponent === Conditions ? "text-primary-400 border-l-4 border-primary-400 px-2 bg-primary-50" : "text-black"}`}
                    on:click={() => showSection("conditions")}
                >
                    General Terms of Sale
                </button>
                <hr class="border-b border-gray-300" />
                <button
                    class={`sm:text-xl text-md mt-3 hover:scale-105 font-medium mb-2 whitespace-normal text-black w-full text-left pl-3 cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 hover:border-l-4 hover:border-primary-400 hover:pl-2 hover:bg-primary-50 hover:rounded-r ${contentComponent === Privacynotice ? "text-primary-400 border-l-4 border-primary-400 px-2 bg-primary-50" : "text-black"}`}
                    on:click={() => showSection("privacynotice")}
                >
                    Privacy Notice
                </button>

                <hr class="border-b border-gray-300" />
                <button
                    class={`sm:text-xl text-md mt-3 hover:scale-105 font-medium mb-2 whitespace-normal text-black w-full text-left pl-3 cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 hover:border-l-4 hover:border-primary-400 hover:pl-2 hover:bg-primary-50 hover:rounded-r ${contentComponent === ProductLicense ? "text-primary-400 border-l-4 border-primary-400 px-2 bg-primary-50" : "text-black"}`}
                    on:click={() => showSection("productLicense")}
                >
                    Product Licenses
                </button>

                <hr class="border-b border-gray-300" />
            </aside>
            <div class="w-full md:w-3/4 lg:p-2">
                {#if contentComponent}
                    <svelte:component this={contentComponent} />
                {:else}
                    <p>Loading...</p>
                {/if}
            </div>
        </div>
    </div>
{/if}
