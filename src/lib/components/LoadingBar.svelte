<script>
	  import Icon from "@iconify/svelte";
	import { isLoading } from '$lib/stores/mainStores.js';
	import { fade } from 'svelte/transition';
</script>

{#if $isLoading}
	<div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-500/40 backdrop-blur-sm"
		transition:fade={{ duration: 300 }}>
		<div class="flex flex-col items-center justify-center p-4">
			<div class="relative w-32 h-32">
				<Icon icon="eos-icons:bubble-loading" class="absolute inset-0 w-full h-full text-6xl text-primary-50 animate-spin-slow"/>
				<!-- <div class="absolute inset-0 w-full h-full border-8 border-dashed border-primary-200 border-t-primary-600 rounded-full animate-spin-slow"></div> -->
				<div class="loader loader-large absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
			</div>
			<div class="mt-4 text-white font-medium flex items-center animate-pulse">
				<span class="animate-wave-1">L</span>
				<span class="animate-wave-2">o</span>
				<span class="animate-wave-3">a</span>
				<span class="animate-wave-4">d</span>
				<span class="animate-wave-5">i</span>
				<span class="animate-wave-6">n</span>
				<span class="animate-wave-7">g</span>
				<span class="animate-wave-8">.</span>
				<span class="animate-wave-9">.</span>
				<span class="animate-wave-10">.</span>
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

	@keyframes loader-bubbles {
		0% {
			box-shadow: 0 -10px var(--bubble-color, #ffffff),
					3px 0 var(--bubble-color, #ffffff),
					5px 0 var(--primary-color, #fe5939);
		}
		30% {
			box-shadow: 3px -20px rgba(239,223,255,0),
					5px -10px var(--bubble-color, #ffffff),
					5px 0 var(--primary-color, #fe5939);
		}
		60% {
			box-shadow: 3px 0 rgba(239,223,255,0),
					4px -20px rgba(239,223,255,0),
					3px -10px var(--bubble-color, #ffffff);
		}
		61% {
			box-shadow: 3px 0 var(--primary-color, #fe5939),
					4px -20px rgba(239,223,255,0),
					3px -10px var(--bubble-color, #ffffff);
		}
		100% {
			box-shadow: 0 -10px var(--primary-color, #fe5939),
					4px -20px rgba(239,223,255,0),
					5px -20px rgba(239,223,255,0);
		}
	}

	.loader {
		display: inline-block;
		vertical-align: middle;
		position: relative;
		width: 10px;
		height: 20px;
		background: var(--primary-color, #fe5939);
	}

	.loader-large {
		width: 15px;     
		height: 30px;    
	}

	.loader:before,
	.loader:after {
		content: '';
		position: absolute;
	}

	.loader:before {
		top: -8px;
		left: -13px;
		width: 0;
		height: 0;
		border: 18px solid transparent;
		border-bottom: 20px solid var(--primary-color, #fe5939);
		border-radius: 3px;
	}

	.loader-large:before {
		top: -12px;
		left: -20px;
		border: 27px solid transparent;
		border-bottom: 30px solid var(--primary-color, #fe5939);
		border-radius: 4px;
	}

	.loader:after {
		top: -1;
		left: -1;
		width: px;
		height: 4px;
		background: var(--bubble-color, #fe5939);
		border-radius: 50%;
		animation: loader-bubbles 1s linear infinite forwards;
	}

	.loader-large:after {
		width: 6px;
		height: 6px;
	}

	:global(.animate-shimmer) {
		background-size: 200% 100%;
		animation: shimmer 2s ease-in-out infinite;
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


<!-- <script>
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
		</div> --

		<div class="flex flex-col items-center justify-center p-4">
			<div class="w-16 h-16 border-8 border-dashed border-primary-200 border-t-primary-600 rounded-full animate-spin-slow"></div>
			<div class="mt-4 text-white font-semibold text-xl flex items-center animate-pulse">
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
</style> -->