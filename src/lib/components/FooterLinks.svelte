<script>
    import { page } from '$app/stores';  
    import Terms from '$lib/components/Footerlinks/SiteTerms.svelte';
    import ProductLicense from '$lib/components/Footerlinks/Condition.svelte';
    import Privacynotice from '$lib/components/Footerlinks/Privacy.svelte';
    import Conditions from '$lib/components/Footerlinks/ProductLicence.svelte'; 

    let contentComponent;
    $: {
        if ($page.url.pathname === '/terms/site-and-terms') {
            contentComponent = Terms;
        } else if ($page.url.pathname === '/terms/product-license') {
            contentComponent = ProductLicense;
        } else if ($page.url.pathname === '/terms/privacy-notice') {
            contentComponent = Privacynotice;
        } else if ($page.url.pathname === '/terms/conditions') {
            contentComponent = Conditions;
        }
    }

    function showSection(section) {
        let url = '';  
        let component;

        if (section === 'siteTerms') {
            url = '/terms/site-and-terms'; 
            component = Terms;
        } else if (section === 'productLicense') {
            url = '/terms/product-license';
            component = ProductLicense;
        } else if (section === 'privacynotice') {
            url = '/terms/privacy-notice';
            component = Privacynotice;
        } else if (section === 'conditions') {
            url = '/terms/conditions';
            component = Conditions;
        }

        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', url);
        }

        contentComponent = component;
    }
</script>
<div class="lg:w-11/12 mx-auto max-w-7xl">

<div class="flex flex-col md:flex-row lg:p-6 ">
    <aside class="w-full lg:w-1/3 lg:p-4">
        <h1 class="text-3xl font-semibold mb-8">
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

        <hr class="border-t-1 border-gray-400 mb-2 mt-12" />

        <!-- Sidebar Buttons -->
        <button 
            class={`text-xl font-semibold mb-2 ${contentComponent === Terms ? 'text-primary-400' : 'text-black'}`} 
            on:click={() => showSection('siteTerms')}
        >
            Site Use Terms
        </button>
        <hr class="border-t-1 border-gray-400" />
        
        <button 
            class={`text-xl mt-2 font-semibold mb-2 ${contentComponent === Conditions ? 'text-primary-400' : 'text-black'}`} 
            on:click={() => showSection('conditions')}
        >
            General Terms of Sale  
        </button>
        <hr class="border-t-1 border-gray-400" />
    
        <button 
            class={`text-xl mt-2 font-semibold mb-2 ${contentComponent === Privacynotice ? 'text-primary-400' : 'text-black'}`} 
            on:click={() => showSection('privacynotice')}
        >
            Privacy Notice
        </button>
        <hr class="border-t-1 border-gray-400" />
        
        <button 
            class={`text-xl mt-2 font-semibold mb-2 ${contentComponent === ProductLicense ? 'text-primary-400' : 'text-black'}`} 
            on:click={() => showSection('productLicense')}
        >
            Product Licenses
        </button>
        <hr class="border-t-1 border-gray-400" />
    </aside> 

    <!-- Content Section -->
    <div class="w-full md:w-3/4 lg:p-4">
        {#if contentComponent}
            <svelte:component this={contentComponent} />
        {:else}
            <p>Loading...</p>
        {/if}
    </div>
</div>
</div>


