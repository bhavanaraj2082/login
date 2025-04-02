<script>
    import Icon from "@iconify/svelte";
    export let changeTabs

    const profileSections = [
        {
            id: 1,
            title: "Personal Information",
            logo: "stash:user-avatar",
            desc: "Manage your personal information and more",
        },
        {
            id: 2,
            title: "Address Book",
            logo: "carbon:location",
            desc: "Manage your addresses and more",
        },
        {
            id: 3,
            title: "Email Preferences",
            logo: "carbon:email",
            desc: "Manage your email preferences and more",
        },
        {
            id: 4,
            title: "Site Preferences",
            logo: "ep:set-up",
            desc: "Manage your site preferences and more",
        }
        // {
        //     id: 4,
        //     title: "Payment Methods",
        //     logo: "fluent:payment-32-regular",
        //     desc: "Manage your payment methods and more",
        // },
        // {
        //     id: 5,
        //     title: "Link Organizations",
        //     logo: "fa-solid:link",
        //     desc: "Manage your orgnization information and more",
        // },
    ];
</script>

<nav class="w-full mx-auto md:pr-2 lg:pr-2 space-y-3">
    {#each profileSections as { title, desc, logo },index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="shadow rounded-md px-4 py-4 bg-white hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-primary-100 cursor-pointer" on:click={changeTabs(index)}>
            <div class=" flex items-center gap-2 text-primary-500 mb-2">
                <Icon icon={logo} class=" text-xl md:text-2xl bg-primary-50 rounded-full p-1" />
                <button on:click={changeTabs(index)} class="font-semibold text-xs lg:text-sm text-primary-500 text-left">{title}</button>
            </div>
            <p class=" text-xs text-content">{desc}</p>
        </div>
    {/each}
</nav>
