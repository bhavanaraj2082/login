<script>
    import { onMount } from 'svelte';
    import faqData from '$lib/data/faq.json'; 

    let categories = [];
    let activeCategory = 'All Questions';
    let activeQuestion = null;
    let visibleQuestionsCount = {}; 
    let showingMore = {}; 
    const initialQuestionsToShow = 5; 

    onMount(() => {
        categories = [
            faqData.all_questions,
            faqData.products,
            faqData.orders,
            faqData.shipping,
            faqData.account,
            faqData.dr_ehrenstorfer,
            faqData.proficiency_testing
        ];

        categories.forEach(category => {
            visibleQuestionsCount[category.title] = initialQuestionsToShow;
            showingMore[category.title] = false; 
        });
    });

    const toggleQuestion = (index) => {
        activeQuestion = activeQuestion === index ? null : index;
    };

    const toggleShowMore = (category) => {
        showingMore[category] = !showingMore[category];
        visibleQuestionsCount[category] = showingMore[category]
            ? categories.find(cat => cat.title === category).faqs.length
            : initialQuestionsToShow;
    };

    const setActiveCategory = (category) => {
        if (activeCategory !== category) {
            activeCategory = category;
            activeQuestion = null;
            visibleQuestionsCount[category] = initialQuestionsToShow;
            showingMore[category] = false; 
        }
    };
</script>

<div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h1>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <aside class="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-[600px] w-full overflow-y-auto">
            <button 
                class="block w-full text-lg font-semibold py-3 text-gray-700 bg-gray-50 hover:text-blue-600 transition-all duration-300 ease-in-out rounded-md pl-4 hover:pl-6 text-left mb-2"
                on:click={() => setActiveCategory('All Questions')}>
                All Questions
            </button>

            {#each categories.slice(1) as category}
            <button 
                class="block w-full text-lg font-semibold py-3 text-gray-700 bg-gray-50 hover:text-blue-600 transition-all duration-300 ease-in-out rounded-md pl-4 hover:pl-6 text-left mb-2"
                on:click={() => setActiveCategory(category.title)} >
                {category.title}
            </button>
            {/each}
        </aside>

        <div class="col-span-3 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            {#if activeCategory === 'All Questions'}
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-700 mb-4">All Questions</h2>

                {#each faqData.all_questions.faqs.slice(0, visibleQuestionsCount['All Questions']) as question, index}
                <div class="mb-4 relative flex items-start">
                    <button
                        class={`relative w-full text-left p-4 border rounded-md shadow-sm transition-all duration-300 ease-in-out ${activeQuestion === `All Questions-${index}` ? 'bg-gray-100 border-transparent text-gray-700' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:text-[#037889]'}`}
                        on:click={() => toggleQuestion(`All Questions-${index}`)}>
                        <div class="flex justify-between items-center">
                            <span class={`relative transition-transform duration-300 ease-in-out ${activeQuestion === `All Questions-${index}` ? 'text-[#037889] font-bold' : 'hover:text-[#037889] hover:font-bold hover:translate-x-2'}`}>
                                {question.question}
                            </span>
                            <span class="text-gray-500 ml-4 text-2xl font-bold">
                                {activeQuestion === `All Questions-${index}` ? '−' : '+'}
                            </span>
                        </div>
                        <div class={`transition-all duration-300 ease-in-out overflow-hidden ${activeQuestion === `All Questions-${index}` ? 'max-h-screen' : 'max-h-0'}`}>
                            <div class={`p-4 bg-gray-100 mt-2 rounded-md text-gray-700`}>
                                {question.answer}
                            </div>
                        </div>
                    </button>
                </div>
                {/each}

                {#if faqData.all_questions.faqs.length > initialQuestionsToShow}
                <button
                    class={`w-full mt-4 p-2 rounded-md focus:outline-none transition-all duration-300 ease-in-out ${showingMore['All Questions'] ? 'bg-gray-200 text-gray-700' : 'bg-[#037889] text-white'} hover:bg-[#037889]`}
                    on:click={() => toggleShowMore('All Questions')}>
                    {showingMore['All Questions'] ? 'Show Less' : 'Show More'}
                </button>
                {/if}
            </div>
            {/if}

            {#each categories.slice(1) as category}
            {#if activeCategory === category.title}
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-700 mb-4">{category.title}</h2>

                {#each category.faqs.slice(0, visibleQuestionsCount[category.title]) as question, index}
                <div class="mb-4 relative flex items-start">
                    <button
                        class={`relative w-full text-left p-4 border rounded-md shadow-sm transition-all duration-300 ease-in-out ${activeQuestion === `${category.title}-${index}` ? 'bg-gray-100 border-transparent text-gray-700' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:text-[#037889]'}`}
                        on:click={() => toggleQuestion(`${category.title}-${index}`)}>
                        <div class="flex justify-between items-center"> 
                            <span class={`relative transition-transform duration-300 ease-in-out ${activeQuestion === `${category.title}-${index}` ? 'text-[#037889] font-bold' : 'hover:text-[#037889] hover:font-bold hover:translate-x-2'}`}>
                                {question.question}
                            </span>
                            <span class="text-gray-500 ml-4 text-2xl font-bold">
                                {activeQuestion === `${category.title}-${index}` ? '−' : '+'}
                            </span>
                        </div>
                        <div class={`transition-all duration-300 ease-in-out overflow-hidden ${activeQuestion === `${category.title}-${index}` ? 'max-h-screen' : 'max-h-0'}`}>
                            <div class={`p-4 bg-gray-100 mt-2 rounded-md text-gray-700`}>
                                {question.answer}
                            </div>
                        </div>
                    </button>
                </div>
                {/each}

                {#if category.faqs.length > initialQuestionsToShow}
                <button
                    class={`w-full mt-4 p-2 rounded-md focus:outline-none transition-all duration-300 ease-in-out ${showingMore[category.title] ? 'bg-gray-200 text-gray-700' : 'bg-[#037889] text-white'} hover:bg-[#037889]`}
                    on:click={() => toggleShowMore(category.title)}>
                    {showingMore[category.title] ? 'Show Less' : 'Show More'}
                </button>
                {/if}
            </div>
            {/if}
            {/each}
        </div>
    </div>
</div>
