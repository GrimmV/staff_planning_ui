<script lang="ts">
    import MyModal from "$lib/components/MyModal.svelte";
    import KeyValueDisplay from "$lib/components/KeyValueDisplay.svelte";
    import type { Employee, Client } from "$lib/types";
    interface Props {
        employee: Employee;
        client_mappings: Map<string, string>;
        clients: Client[];
    }
    let { employee, client_mappings, clients }: Props = $props();

    // Helper function to map client IDs to names
    function mapClientKey(key: string): string {
        return client_mappings.get(key) || key;
    }

    // Format datetime string to human-readable date (German format)
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
    }

    // Convert decimal time to HH:MM format
    // E.g., 8.25 -> "8:15", 13.166666 -> "13:10"
    function formatTime(decimalTime: number): string {
        const hours = Math.floor(decimalTime);
        const minutes = Math.round((decimalTime - hours) * 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }

    // Format sex
    function formatSex(sex: string): string {
        if (sex === 'w') return 'weiblich';
        if (sex === 'm') return 'männlich';
        return sex || 'Nicht angegeben';
    }

</script>


{#snippet footerActions()}
  <div class="flex flex-col gap-2 justify-center items-center">
    <div class="flex items-center justify-between gap-2">
      <select placeholder="Mitarbeiter auswählen">
        <option value="">Klient auswählen</option>
        {#each clients as client}
          <option value={client.id}>{client.name}</option>
        {/each}
      </select>
      <button class="bg-primary-500 px-4 py-2 rounded-md" onclick={() => {}}>
        Zuordnung erzwingen
      </button>
    </div>
    <div class="flex items-center justify-between gap-2">
      <button class="bg-primary-500 px-4 py-2 rounded-md" onclick={() => {}}>
        Mitarbeiter verpflichten
      </button>
    </div>
  </div>
{/snippet}

<MyModal title={employee.name} triggerText={employee.name} {footerActions}>
  <div class="space-y-4">    
    <div class="space-y-2">
      <p><span class="font-medium">Verfügbarkeit:</span> {employee.availability.map(formatTime).join(" bis ")} Uhr</p>
      <p><span class="font-medium">Verfügbar bis:</span> {formatDate(employee.available_until)}</p>
      <p><span class="font-medium">Hat Auto:</span> {employee.hasCar ? "Ja" : "Nein"}</p>
      <p><span class="font-medium">Qualifikationen:</span> {employee.qualifications.length > 0 ? employee.qualifications.join(", ") : "Keine"}</p>
      <p><span class="font-medium">Geschlecht:</span> {formatSex(employee.sex)}</p>
    </div>

    <KeyValueDisplay 
      data={employee.cl_experience}     
      keyMapper={mapClientKey}
      label="Klient-Erfahrung"
      emptyMessage="Keine Klient-Erfahrung"
    />

    <KeyValueDisplay 
      data={employee.short_term_cl_experience} 
      keyMapper={mapClientKey}
      label="Kurzfristige Klient-Erfahrung"
      emptyMessage="Keine kurzfristige Klient-Erfahrung"
    />

    <KeyValueDisplay 
      data={employee.school_experience} 
      label="Schul-Erfahrung"
      emptyMessage="Keine Schul-Erfahrung"
    />

    <KeyValueDisplay 
      data={employee.timeToSchool} 
      label="Zeit zur Schule"
      emptyMessage="Keine Daten verfügbar"
    />
  </div>
</MyModal>
