<script lang="ts">
	interface Props {
		data: Record<string, any>;
		keyMapper?: (key: string) => string;
		emptyMessage?: string;
		label?: string;
	}

	let { data, keyMapper, emptyMessage = "Keine Daten", label }: Props = $props();

	const entries = Object.entries(data || {});
	const hasData = entries.length > 0;

	function getDisplayKey(key: string): string {
		return keyMapper ? keyMapper(key) : key;
	}

	function formatValue(value: any): string {
		if (value === null || value === undefined) {
			return "N/A";
		}
		if (typeof value === "boolean") {
			return value ? "Ja" : "Nein";
		}
		if (typeof value === "number") {
			return value.toString();
		}
		return String(value);
	}
</script>

{#if label}
	<h3 class="text-lg font-semibold text-on-surface mb-2">{label}</h3>
{/if}

{#if hasData}
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
		{#each entries as [key, value]}
			<div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-2 rounded bg-surface-200-800">
				<span class="text-sm font-medium text-on-surface-600-300 min-w-[120px]">
					{getDisplayKey(key)}:
				</span>
				<span class="text-sm text-on-surface flex-1">{formatValue(value)}</span>
			</div>
		{/each}
	</div>
{:else}
	<p class="text-sm text-on-surface-600-300 italic">{emptyMessage}</p>
{/if}

