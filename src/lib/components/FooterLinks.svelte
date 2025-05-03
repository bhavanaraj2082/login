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
        <div class="flex flex-col lg:flex-row pt-3 lg:px-0 px-4">
            <aside class="w-full md:w-1/3  lg:px-4">
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
                <hr class="border-b border-gray-300 mb-2 mt-1" />
                <button
                    class={`sm:text-base text-sm mt-2 font-medium mb-2 w-full whitespace-nowrap text-start transition-all duration-300 ease-in-out transform hover:bg-primary-100 rounded-r hover:scale-105 p-1 ${
                        contentComponent === Terms
                            ? "text-primary-400 border-l-4 border-primary-400 px-2 bg-primary-50 rounded-r"
                            : "text-black"
                    }`}
                    on:click={() => showSection("siteTerms")}>
                    Site Use Terms
                </button>
                <hr class="border-b border-gray-300" />
                <button
                    class={`sm:text-base text-sm mt-2 font-medium mb-2 w-full whitespace-nowrap text-start transition-all duration-300 ease-in-out transform hover:bg-primary-100 rounded-r hover:scale-105 p-1 ${
                        contentComponent === Conditions
                            ? "text-primary-400 border-l-4 border-primary-400 px-2 bg-primary-50 rounded-r"
                            : "text-black"
                    }`}
                    on:click={() => showSection("conditions")}>
                    General Terms of Sale
                </button>
                <hr class="border-b border-gray-300" />
                <button
                    class={`sm:text-base text-sm mt-2 font-medium mb-2 w-full whitespace-nowrap text-start transition-all duration-300 ease-in-out transform hover:bg-primary-100 rounded-r hover:scale-105 p-1 ${
                        contentComponent === Privacynotice
                            ? "text-primary-400 border-l-4 border-primary-400 px-2 bg-primary-50 rounded-r"
                            : "text-black"
                    }`}
                    on:click={() => showSection("privacynotice")}>
                    Privacy Notice
                </button>
                <hr class="border-b border-gray-300" />
                <button
                    class={`sm:text-base text-sm mt-2 font-medium mb-2 w-full whitespace-nowrap text-start transition-all duration-300 ease-in-out transform hover:bg-primary-100 rounded-r hover:scale-105 p-1 ${
                        contentComponent === ProductLicense
                            ? "text-primary-400 border-l-4 border-primary-400 px-2 bg-primary-50 rounded-r"
                            : "text-black"
                    }`}
                    on:click={() => showSection("productLicense")}>
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