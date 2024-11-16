<script>
    import { onMount } from 'svelte';  
    import Terms from '$lib/components/Footerlinks/SiteTerms.svelte';
    import ProductLicense from '$lib/components/Footerlinks/Condition.svelte';
    import Privacynotice from '$lib/components/Footerlinks/Privacy.svelte';
    import Conditions from '$lib/components/Footerlinks/ProductLicence.svelte'; 

    let currentSection = 'siteTerms';  
   
    function showSection(section) {
        currentSection = section;
        let url = '';  
      
        if (section === 'siteTerms') {
            url = '/terms/site-and-terms'; 
        } else if (section === 'productLicense') {
            url = '/terms/product-license';
        } else if (section === 'Privacynotice') {
            url = '/terms/privacy-notice';
        } else if (section === 'Conditions') {
            url = '/terms/conditions';
        } else if (section === 'CopyRightConsent') {
            url = '/terms/copy-consent'; 
        }

        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', url);  
        }
    }

    function handlePopState() {
        const path = window.location.pathname;
        if (path === '/terms/site-and-terms') {
            currentSection = 'siteTerms';
        } else if (path === '/terms/product-license') {
            currentSection = 'productLicense';
        } else if (path === '/terms/privacy-notice') {
            currentSection = 'Privacynotice';
        } else if (path === '/terms/conditions') {
            currentSection = 'Conditions';
        } else if (path === '/terms/copy-consent') {
            currentSection = 'CopyRightConsent'; 
        }
    }

    onMount(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('popstate', handlePopState);

            const path = window.location.pathname;
            if (path === '/terms') {
                // Redirect to /terms/site-and-terms when at /terms
                window.history.replaceState({}, '', '/terms/site-and-terms');
                currentSection = 'siteTerms';  
            } else if (path === '/terms/site-and-terms') {
                currentSection = 'siteTerms';
            } else if (path === '/terms/product-license') {
                currentSection = 'productLicense';
            } else if (path === '/terms/privacy-notice') {
                currentSection = 'Privacynotice';
            } else if (path === '/terms/conditions') {
                currentSection = 'Conditions';
            } else {
                currentSection = 'siteTerms';  
            }
        }
    });

    import { onDestroy } from 'svelte';
    onDestroy(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('popstate', handlePopState);
        }
    });
</script>

<main class="flex flex-col md:flex-row p-6 min-h-screen">
    <aside class="w-full md:w-1/4 p-4">
        {#if currentSection === 'siteTerms'}
            <h1 class="text-3xl font-semibold mb-8">Site Use Terms</h1> 
        {:else if currentSection === 'productLicense'}
            <h1 class="text-3xl font-semibold mb-8">Product License</h1> 
        {:else if currentSection === 'Privacynotice'}
            <h1 class="text-3xl font-semibold mb-8">Privacy Notice</h1> 
        {:else if currentSection === 'Conditions'}
            <h2 class="text-2xl font-semibold mb-8">General Terms of Sale</h2> 
        {/if}

        <hr class="border-t-2 border-gray-400 mb-2 mt-15" />

        <button 
            class={`text-xl font-semibold mb-2 ${currentSection === 'siteTerms' ? 'text-orange-500' : 'text-black'}`} 
            on:click={() => showSection('siteTerms')}
        >
            Site Use Terms
        </button>
        <hr class="border-t-2 border-gray-400" />
       
        <button 
            class={`text-xl mt-2 font-semibold mb-2 ${currentSection === 'productLicense' ? 'text-orange-500' : 'text-black'}`} 
            on:click={() => showSection('productLicense')}
        >
            Product License
        </button>
        <hr class="border-t-2 border-gray-400" />
    
        <button 
            class={`text-xl mt-2 font-semibold mb-2 ${currentSection === 'Privacynotice' ? 'text-orange-500' : 'text-black'}`} 
            on:click={() => showSection('Privacynotice')}
        >
            Privacy Notice
        </button>
        <hr class="border-t-2 border-gray-400" />
        
        <button 
            class={`text-xl mt-2 font-semibold mb-2 ${currentSection === 'Conditions' ? 'text-orange-500' : 'text-black'}`} 
            on:click={() => showSection('Conditions')}
        >
            General Terms of Sale
        </button>
        <hr class="border-t-2 border-gray-400" />
    </aside> 

    <div class="w-full md:w-3/4 p-4">
        {#if currentSection === 'siteTerms'}
            <Terms />
        {:else if currentSection === 'productLicense'}
        <Conditions />
        {:else if currentSection === 'Privacynotice'}
            <Privacynotice />
        {:else if currentSection === 'Conditions'}
             <ProductLicense />
        {/if}
    </div>
</main>
