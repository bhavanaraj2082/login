<script>
	import { isLoading } from '$lib/stores/mainStores.js';
	import { fade } from 'svelte/transition';
</script>

{#if $isLoading}
	<div 
		class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/30 backdrop-blur-sm"
		transition:fade={{ duration: 300 }}>
		<!-- <div class="absolute top-0 left-0 w-full h-1.5 bg-gray-100/30 overflow-hidden">
			<div class="h-full bg-gradient-to-r from-primary-500 via-primary-700 to-primary-500 animate-shimmer relative">
				<div class="absolute inset-0 animate-progress-pulse bg-white/20"></div>
			</div>
		</div> -->

		<div class="flex flex-col items-center justify-center p-4">
			<div class="w-16 h-16 border-8 border-primary-200 border-t-primary-600 rounded-full animate-spin-slow"></div>
			<div class="mt-4 text-white font-medium flex items-center animate-pulse">
				<span class="animate-wave-1">C</span>
				<span class="animate-wave-2">h</span>
				<span class="animate-wave-3">e</span>
				<span class="animate-wave-4">m</span>
				<span class="animate-wave-5">i</span>
				<span class="animate-wave-6">k</span>
				<span class="animate-wave-7">a</span>
				<span class="animate-wave-8">r</span>
				<span class="animate-wave-9">t</span>
				<span class="animate-wave-10"></span>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	@keyframes progress-pulse {
		0%, 100% {
			opacity: 0;
		}
		50% {
			opacity: 0.5;
		}
	}

	@keyframes wave {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	:global(.animate-shimmer) {
		background-size: 200% 100%;
		animation: shimmer 2s ease-in-out infinite;
	}

	:global(.animate-progress-pulse) {
		animation: progress-pulse 1.5s ease-in-out infinite;
	}

	:global(.animate-wave-1) { animation: wave 1s ease-in-out infinite; }
	:global(.animate-wave-2) { animation: wave 1s ease-in-out infinite 0.1s; }
	:global(.animate-wave-3) { animation: wave 1s ease-in-out infinite 0.2s; }
	:global(.animate-wave-4) { animation: wave 1s ease-in-out infinite 0.3s; }
	:global(.animate-wave-5) { animation: wave 1s ease-in-out infinite 0.4s; }
	:global(.animate-wave-6) { animation: wave 1s ease-in-out infinite 0.5s; }
	:global(.animate-wave-7) { animation: wave 1s ease-in-out infinite 0.6s; }
	:global(.animate-wave-8) { animation: wave 1s ease-in-out infinite 0.7s; }
	:global(.animate-wave-9) { animation: wave 1s ease-in-out infinite 0.8s; }
	:global(.animate-wave-10) { animation: wave 1s ease-in-out infinite 0.9s; }
</style>