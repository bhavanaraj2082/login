<script>
    import Icon from "@iconify/svelte";
    export let changeTabs

    const profileSections = [
        {
            id: 1,
            title: "Personal Information",
            logo: "tdesign:user-filled",
            desc: "Manage your personal information and more",
        },
        {
            id: 2,
            title: "Address Book",
            logo: "tdesign:location-filled",
            desc: "Manage your addresses and more",
        },
        {
            id: 3,
            title: "Email Preferences",
            logo: "ic:baseline-email",
            desc: "Manage your email preferences and more",
        },
        {
            id: 4,
            title: "Payment Methods",
            logo: "fluent:payment-32-filled",
            desc: "Manage your payment methods and more",
        },
        {
            id: 5,
            title: "Link Organizations",
            logo: "fa-solid:link",
            desc: "Manage your orgnization information and more",
        },
        {
            id: 6,
            title: "Site Preferences",
            logo: "pajamas:preferences",
            desc: "Manage your site preferences and more",
        }
    ];
</script>

<nav class="w-full mx-auto md:ml-6 lg:ml-10 md:pr-2 lg:pr-2 space-y-3">
    {#each profileSections as { title, desc, logo },index}
        <div class=" border shadow-sm rounded-md px-5 py-6 bg-white">
            <div class=" flex items-center gap-2 text-primary-500 mb-2">
                <Icon icon={logo} class=" text-xl md:text-2xl" />
                <button on:click={changeTabs(index)} class=" hover:underline font-bold text-4s lg:text-lg text-primary-500 text-left">{title}</button>
            </div>
            <p class=" text-xs md:text-sm text-content">{desc}</p>
        </div>
    {/each}
</nav>
