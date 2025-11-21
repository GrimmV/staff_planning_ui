<script lang="ts">
  import MyModal from "$lib/components/MyModal.svelte";
  import type { Assignment, Employee, Client } from "$lib/types";
  interface Props {
    assignment: Assignment;
    employee: Employee;
    client: Client;
  }
  let { assignment, employee, client }: Props = $props();

  // Convert decimal time to HH:MM format
  // E.g., 8.25 -> "8:15", 13.166666 -> "13:10"
  function formatTime(decimalTime: number): string {
    const minutes = Math.round(decimalTime / 1000);
    return `${minutes} Minuten`;
  }

  // Format boolean to German
  function formatBoolean(value: boolean): string {
    return value ? "Ja" : "Nein";
  }

  // Format abnormality score
  function formatAbnormalityScore(score: number): string {
    if (score === -1) return "Empfehlung zur Bearbeitung";
    if (score === 1) return "Entspricht üblichem Muster";
    return score.toString();
  }
</script>

{#snippet footerActions()}
  <button class="bg-primary-500 px-4 py-2 rounded-md" onclick={() => {}}>
    Zuordnung verbieten
  </button>
{/snippet}
<MyModal title={`${employee.name} ↔ ${client.name}`} triggerText={"..."} {footerActions}>
  <div class="space-y-4">
    <div class="space-y-2">
      <p>
        <span class="font-medium">Status:</span>
        {formatAbnormalityScore(assignment.abnormality_score)}
      </p>
      <p>
        <span class="font-medium">Priorität:</span>
        {assignment.priority / 10}
      </p>
      <p>
        <span class="font-medium">Klient-Erfahrung:</span>
        {assignment.cl_experience}
      </p>
      <p>
        <span class="font-medium">Kurzfristige Klient-Erfahrung:</span>
        {assignment.short_term_cl_experience}
      </p>
      <p>
        <span class="font-medium">Schul-Erfahrung:</span>
        {assignment.school_experience}
      </p>
      <p>
        <span class="font-medium">Zeit zur Schule:</span>
        {formatTime(assignment.timeToSchool)}
      </p>
      <p>
        <span class="font-medium">Verfügbarkeitslücke:</span>
        {assignment.availability_gap}
      </p>
      <p>
        <span class="font-medium">Geschlecht relevant:</span>
        {formatBoolean(assignment.geschlecht_relevant)}
      </p>
      <p>
        <span class="font-medium">Mobilität:</span>
        {formatBoolean(assignment.mobility)}
      </p>
      <p>
        <span class="font-medium">Qualifikationen erfüllt:</span>
        {formatBoolean(assignment.qualifications_met)}
      </p>
    </div>
  </div>
</MyModal>
