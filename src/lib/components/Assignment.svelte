<script lang="ts">
  import type { Assignment, Employee, Client } from "$lib/types";
  import EmployeeModal from "$lib/components/EmployeeModal.svelte";
  import ClientModal from "$lib/components/ClientModal.svelte";
  import AssignmentModal from "$lib/components/AssignmentModal.svelte";
  interface Props {
    assignment: Assignment;
    employee: Employee;
    client: Client;
    employees: Employee[];
    clients: Client[];
    client_mappings: Map<string, string>;
  }
  let { assignment, employee, client, employees, clients, client_mappings }: Props = $props();
</script>

<div
  class="relative p-4 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all {assignment.abnormality_score == 0 ? 'opacity-60' : ''}"
>
  <div class="flex items-center justify-between mb-2">
    <div class="flex items-center justify-between gap-2 w-full">
      {#if assignment.abnormality_score == 1}
        <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          Entspricht üblichem Muster
        </span>
      {:else}
        <span></span>
      {/if}
      <AssignmentModal {assignment} {employee} {client} />
    </div>
  </div>
  <div class="flex items-center justify-start gap-2">
    <div class="flex items-center gap-2">
      <EmployeeModal {employee} client_mappings={client_mappings} clients={clients} />
    </div>
    <div class="text-gray-400">↔</div>
    <div class="flex items-center gap-2">
      <ClientModal {client} employees={employees} />
    </div>
  </div>
</div>
