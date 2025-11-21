<script lang="ts">
  import MyModal from "$lib/components/MyModal.svelte";
  import type { Client, Employee } from "$lib/types";
  interface Props {
    client: Client;
    employees: Employee[];
  }
  let { client, employees }: Props = $props();

  // Format datetime string to human-readable date (German format)
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // Convert decimal time to HH:MM format
  // E.g., 8.25 -> "8:15", 13.166666 -> "13:10"
  function formatTime(decimalTime: number): string {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  // Format required sex
  function formatSex(sex: string): string {
    if (sex === "w") return "weiblich";
    if (sex === "m") return "männlich";
    return sex || "Nicht angegeben";
  }
</script>

{#snippet footerActions()}
  <div class="flex flex-col gap-2 justify-center items-center">
    <div class="flex items-center justify-between gap-2">
      <select placeholder="Mitarbeiter auswählen">
        <option value="">Mitarbeiter auswählen</option>
        {#each employees as employee}
          <option value={employee.id}>{employee.name}</option>
        {/each}
      </select>
      <button class="bg-primary-500 px-4 py-2 rounded-md" onclick={() => {}}>
        Zuordnung erzwingen
      </button>
    </div>
    <div class="flex items-center justify-between gap-2">
      <button class="bg-primary-500 px-4 py-2 rounded-md" onclick={() => {}}>
        Klient verpflichten
      </button>
    </div>
  </div>
{/snippet}

<MyModal title={client.name} triggerText={client.name} triggerVariant="secondary" {footerActions}>
  <div class="space-y-4">
    <div class="space-y-2">
      <p>
        <span class="font-medium">Verfügbar bis:</span>
        {formatDate(client.available_until)}
      </p>
      <p><span class="font-medium">Priorität:</span> {client.priority / 10}</p>
      <p>
        <span class="font-medium">Erforderliches Geschlecht:</span>
        {formatSex(client.requiredSex)}
      </p>
      <p>
        <span class="font-medium">Schule:</span>
        {client.school ? client.school : "Nicht angegeben"}
      </p>
      <p>
        <span class="font-medium">Zeitfenster:</span>
        {client.timeWindow.map(formatTime).join(" bis ")} Uhr
      </p>
      <p>
        <span class="font-medium">Benötigte Qualifikationen:</span>
        {client.neededQualifications.length > 0
          ? client.neededQualifications.join(", ")
          : "Keine"}
      </p>
    </div>
  </div>
</MyModal>
