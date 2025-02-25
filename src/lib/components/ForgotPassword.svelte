<script>
    import { createEventDispatcher } from 'svelte';
    import Icon from '@iconify/svelte';
    import { enhance } from '$app/forms';
    import { toast } from 'svelte-sonner';
    import { applyAction } from '$app/forms';
    import { Toaster } from 'svelte-sonner';
    import { authedUser } from '$lib/stores/mainStores.js';

    let form;
    let email = '';
    let emailError = '';
    let token = '';
    let loading = false;

    const dispatch = createEventDispatcher();

    function handleSubmit() {
        const emailaddress = form.resetrequest.record.email;
        dispatch('email', emailaddress);
    }

    let heading = 'Request';
    if (form) {
        heading = 'Validate';
    }

    $: successMessage = '';
    $: errorMessage = '';
</script>


<main class="my-10">
    <div
        class="max-w-80 sm:max-w-xs md:max-w-sm lg:max-w-sm border rounded-md shadow-lg mx-auto mt-10 border-primary-300"
    >
        <h1 class="text-center text-xl lg:text-2xl text-white bg-primary-500 py-2 rounded-t-sm">
            Password Reset
        </h1>
        <div class="px-10 py-6">
            <div class="flex items-center justify-center">
                <p class="text-black text-sm font-bold">{heading}</p>
            </div>
            <div class="flex items-center justify-center py-5 text-gray-400">
                <div class="flex flex-row items-center justify-center">
                    <Icon icon={'ep:success-filled'} class=" text-primary-600 text-3xl" />
                    <hr
                        class={`${form ? 'bg-primary-600 text-3xl lg:w-16 md:w-24 w-5 xs:w-5 h-1 rounded' : 'lg:w-14 md:w-24 w-5 xs:w-5 h-1 bg-primary-200 rounded text-lg'}`}
                    />
                </div>
                <div class="flex flex-row">
                    <Icon
                        icon={form ? 'ep:success-filled' : 'bi:2-circle'}
                        class={`${form ? 'text-primary-600 text-3xl' : ''} text-2xl`}
                    />
                    <hr
                        class={`${form ? 'mt-3.5' : 'mt-2.5'} lg:w-14 md:w-24 w-5 xs:w-5 h-1 bg-primary-200 rounded text-lg`}
                    />
                </div>
                <div class="flex flex-row">
                    <Icon icon="bi:3-circle" class=" text-2xl" />
                </div>
            </div>

            {#if successMessage}
                <div class="mt-4 p-4 text-sm bg-green-100 text-green-800 rounded border border-gray-200">
                    {successMessage}
                </div>
            {/if}

            {#if errorMessage}
                <div class="mt-4 p-4 text-sm bg-red-100 rounded border border-gray-200">
                    {errorMessage}
                </div>
            {/if}

            {#if !form}
                <div>
                    <form
                        use:enhance={() => {
                            return async ({ result }) => {
                                loading = false;
                                if (result.data.success === true) {
                                    successMessage =
                                        'Password reset link sent successfully! Please check your email to proceed.';
                                    toast.success(result.data.message);
                                    email = '';
                                    emailError = '';
                                    form = true;
                                    heading = 'Validate';
                                } else {
                                    successMessage = '';
                                    toast.error(result.data.message);
                                }
                                await applyAction(result);
                            };
                        }}
                        method="POST"
                        action="?/resetrequestStep1"
                        on:submit={() => {
                            loading = true;
                        }}
                    >
                        <div class="border p-4 border-primary-50 rounded-md bg-primary-100 text-gray-600 my-5">
                            <p class="text-xs float-start font-medium my-3">
                                Enter your email to receive a password reset link.
                            </p>
                            {#if $authedUser.email}
                                <input
                                    class="w-full text-xs border-gray-400 p-2 rounded-sm"
                                    name="email"
                                    placeholder="email..."
                                    type="email"
                                    value={$authedUser.email}
                                    readonly
                                />
                            {:else}
                                <input
                                    class="w-full text-xs border-gray-400 p-2 rounded-sm"
                                    name="email"
                                    placeholder="email..."
                                    type="email"
                                    bind:value={email}
                                    on:input={() => {
                                        const emailRegex = /^\S+@\S+.\S+$/;
                                        emailError =
                                            !email || !emailRegex.test(email) ? 'Please enter a valid email address' : '';
                                    }}
                                />
                            {/if}
                            <p class="text-red-500 text-left ml-px text-xs">{emailError}</p>
                            <Icon
                                icon={form?.invalid ? 'typcn:warning' : ''}
                                class="w-5 h-5 text-red-500 inline pr-1"
                            />
                            <p class="text-black text-xs py-0.5 inline">{form?.invalid || ''}</p>
                        </div>

                        <div class="flex justify-between items-center">
                            <button
                                type="submit"
                                class="w-[120px] py-1.5 text-sm rounded-md font-medium bg-primary-600 text-white my-3 hover:bg-primary-400"
                                disabled={loading}
                            >
                                {#if loading}
                                    <div class="flex items-center">
                                        <Icon
                                            icon="svg-spinners:pulse-rings-3"
                                            class="text-3xl font-bold animate-spin"
                                        />
                                        <span class="ml-1 text-xs"> Submitting... </span>
                                    </div>
                                {:else}
                                    Submit
                                {/if}
                            </button>
                        </div>
                    </form>
                </div>
            {/if}
        </div>
    </div>
</main>


<Toaster position="bottom-right" richColors />