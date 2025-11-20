<script lang="ts">
  interface Props {
    toAssign: any[];
  }
  let { toAssign }: Props = $props();
</script>

<div class="m-2">
  <div class="flex items-center justify-between m-1 gap-2">
    <select class="w-full" placeholder="Client auswählen">
      <option value="">Zuordnung auswählen</option>
      {#each toAssign as item}
        <option value={item.id}>{item.name}</option>
      {/each}
    </select>
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded-md"
      onclick={() => {}}>Zuordnung erzwingen</button
    >
  </div>
  <button class="bg-blue-500 text-white px-4 py-2 rounded-md" onclick={() => {}}
    >Verpflichten</button
  >
</div>
