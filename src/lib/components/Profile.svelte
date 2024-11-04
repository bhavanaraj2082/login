<script>
	import ProfileContent from '$lib/components/ProfileContent.svelte';
	import Icon from '@iconify/svelte';
	import profileData from '$lib/data/Profile.json';
	export let data;
	let activeProfile = 'Personal Information';
	let searchQuery = '';

	$: filteredSections = profileData.sections.filter(
		(section) =>
			section.form.toLowerCase().includes(searchQuery.toLowerCase()) ||
			section.information.toLowerCase().includes(searchQuery.toLowerCase())
	);

	function switchForm(form) {
		activeProfile = form;
	}
</script>

<section>
	<div class="mx-auto max-w-5xl">
		<h1 class="font-bold text-xl">Profile</h1>
		<div class="flex flex-wrap sm:flex-nowrap gap-4 mt-4">
			<div class="flex flex-col gap-4 w-full md:max-w-80">
				{#each filteredSections as section}
					<div
						class={`flex  gap-4  border p-4 ${section.form === activeProfile ? 'shadow-md border-1' : ''}`}
					>
						<div
							class=" flex flex-col items-center w-10 h-10 text-center border-2 rounded-full border-primary-400 p-1"
						>
							<Icon icon={section.icon} width="2em" height="2em" class="text-primary-500" />
						</div>
						<div class="">
							<a
								href="##"
								class="text-primary-600 font-semibold hover:underline"
								on:click={() => switchForm(section.form)}
							>
								{section.form}
							</a>
							<p class="mt-2 mb-2 text-description">{section.information}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- <ProfileContent {activeProfile} {data} /> -->
		</div>
	</div>
</section>
