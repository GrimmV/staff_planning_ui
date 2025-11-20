<script lang="ts">
	interface Props {
		open?: boolean;
		x?: number;
		y?: number;
		title?: string;
	}
	
	let { open = $bindable(false), x = $bindable(0), y = $bindable(0), title = $bindable('') }: Props = $props();
	
	function handleClose() {
		open = false;
	}
	
	$effect(() => {
		if (!open) return;
		
		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				handleClose();
			}
		}
		
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	});
</script>

{#if open}
	<div
		class="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[200px] max-w-[400px]"
		style="left: {x}px; top: {y}px;"
		role="dialog"
		aria-modal="true"
		aria-labelledby="popover-title"
	>
		<div class="flex justify-between items-center mb-2">
			{#if title}
				<h3 id="popover-title" class="font-semibold text-lg">{title}</h3>
			{/if}
			<button
				onclick={handleClose}
				class="ml-auto text-gray-500 hover:text-gray-700 text-2xl leading-none"
				aria-label="Close"
			>
				×
			</button>
		</div>
		<div>
			<slot />
		</div>
	</div>
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-40 bg-black/20"
		onclick={handleClose}
		role="button"
		tabindex="-1"
	></div>
{/if}

