<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { X } from '@lucide/svelte';

	interface Props {
		open?: boolean;
		title?: string;
		description?: string;
		children?: () => any;
		showCloseButton?: boolean;
		showTrigger?: boolean;

		triggerText?: string;
        triggerVariant?: 'primary' | 'secondary';   
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		showFooter?: boolean;
		footerActions?: () => any;
	}

	let {
		open = $bindable(false),
		title = 'Modal Title',
		description,
		children,
		showCloseButton = true,
		showTrigger = true,
		triggerText = 'Open Modal',
		triggerVariant = 'primary',
		size = 'md',
		showFooter = true,
		footerActions
	}: Props = $props();

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'max-w-full mx-4'
	};

	function handleClose() {
		open = false;
	}
</script>

<Dialog open={open} onOpenChange={(details) => (open = details.open)}>
	{#if showTrigger}
		<Dialog.Trigger class="btn variant-filled bg-{triggerVariant}-500">
			{triggerText}
		</Dialog.Trigger>
	{/if}
	<Portal>
		<Dialog.Backdrop class=" bg-black/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content
				class="card {sizeClasses[size]} w-full bg-surface-100-900 shadow-xl p-0 overflow-hidden overflow-y-auto"
			>
				<!-- Header -->
				<div class="flex items-center justify-between p-6 border-b border-surface-300-700">
					<div class="flex-1">
						<Dialog.Title class="text-2xl font-bold text-on-surface">
							{title}
						</Dialog.Title>
						{#if description}
							<Dialog.Description class="mt-2 text-sm text-on-surface-600-300">
								{description}
							</Dialog.Description>
						{/if}
					</div>
					{#if showCloseButton}
						<Dialog.CloseTrigger
							class="btn variant-ghost surface-base p-2 ml-4"
							onclick={handleClose}
						>
							<X class="w-5 h-5" />
						</Dialog.CloseTrigger>
					{/if}
				</div>

				<!-- Body -->
				<div class="p-6 max-h-[400px] overflow-y-auto">
					{#if children}
						{@render children()}
					{:else}
						<p class="text-on-surface">
							This is the modal content. You can pass custom content using the children prop.
						</p>
					{/if}
				</div>

				<!-- Footer -->
				{#if showFooter}
					<div class="flex items-center justify-end gap-3 p-6 border-t border-surface-300-700">
						{#if footerActions}
							{@render footerActions()}
						{:else}
							<Dialog.CloseTrigger class="btn variant-ghost surface-base" onclick={handleClose}>
								Cancel
							</Dialog.CloseTrigger>
							<Dialog.CloseTrigger class="btn variant-filled bg-primary-500" onclick={handleClose}>
								Confirm
							</Dialog.CloseTrigger>
						{/if}
					</div>
				{/if}
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>

