<script>
    const catalogues = [
        {
            title: "LGC AXIO Proficiency Testing Catalogue",
            url: "https://online.flippingbook.com/link/1014940/",
        },
        {
            title: "Dr. Ehrenstorfer Reference Materials for Food and Environmental Analysis",
            url: "https://s3-eu-west-1.amazonaws.com/lgcstandards-assets/MediaGallery/Dre/Dr.+Ehrenstorfer+Reference+Materials+for+Food+and+Environmental+Analysis+current.pdf",
        },
        {
            title: "Mikromol Reference Standards for Pharmaceutical Analysis",
            url: "https://documents.lgcstandards.com/MediaGallery/Catalogues_Publications/LGC_pharma_current.pdf",
        },
        {
            title: "VHG Aqueous Inorganic Certified Reference Materials (CRMs) & Calibration Standards",
            url: "https://documents.lgcstandards.com/MediaGallery/Catalogues_Publications/VHGAqeousInorganicDigitalCatalog.pdf",
        },
    ];
    const viewAllUrl = "/IN/en/Resources/Publications";
</script>

<div class="flex flex-col p-5 border rounded-lg shadow-md bg-white w-full md:w-[32%]">
    <h3 class="text-2xl font-bold">Our Latest Catalogues</h3>
    <div class="mt-4">
        {#each catalogues as { title, url }}
            <a
                target="_blank"
                href={url}
                class="p-2 my-3 bg-black text-white text-sm hover:underline flex justify-between"
            >
                <p class="flex-1 font-semibold">{title}</p>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    class="ml-2"
                >
                    <path
                        fill="currentColor"
                        d="M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1"
                    />
                </svg>
            </a>
        {/each}
    </div>
    <div class="flex justify-center">
        <a
            href={viewAllUrl}
            class="mt-4 text-sky-600 hover:underline font-medium"
        >
            View All
        </a>
    </div>
</div>
