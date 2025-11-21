<script lang="ts">
  import "../app.css";
  import type {
    Employee,
    Client,
    Assignment as AssignmentType,
    ApiResponse,
  } from "$lib/types";
  import AssignmentComponent from "$lib/components/Assignment.svelte";
  import type { PageData } from "./$types";
  import EmployeeModal from "$lib/components/EmployeeModal.svelte";
  import ClientModal from "$lib/components/ClientModal.svelte";
  interface PageDataWithApi {
    apiData: ApiResponse | null;
    error?: string;
  }

  let { data }: { data: PageDataWithApi } = $props();

  // Transform API data to component state - use $derived to reactively update when data changes
  const employees: Employee[] = $derived(data.apiData?.mas || []);
  const clients: Client[] = $derived(data.apiData?.clients || []);
  const assignments: AssignmentType[] = $derived(
    data.apiData?.assignment_info.assigned_pairs || []
  );

  // Get unassigned IDs from API response
  const unassignedEmployeeIds = $derived(
    new Set(
      data.apiData?.assignment_info.unassigned_employees.map(
        (e: { id: string; unreachable: boolean }) => e.id
      ) || []
    )
  );
  const unassignedClientIds = $derived(
    new Set(
      data.apiData?.assignment_info.unassigned_clients.map(
        (c: { id: string; unreachable: boolean }) => c.id
      ) || []
    )
  );

  // Computed: Get assigned employee IDs
  const assignedEmployeeIds = $derived(
    new Set(assignments.map((a) => a.employeeId))
  );

  // Computed: Get assigned client IDs
  const assignedClientIds = $derived(
    new Set(assignments.map((a) => a.clientId))
  );

  // Computed: Unassigned employees (from API unassigned list)
  const unassignedEmployees = $derived(
    employees.filter((e) => unassignedEmployeeIds.has(e.id))
  );

  console.log(unassignedEmployees);

  // Computed: Unassigned clients (from API unassigned list)
  const unassignedClients = $derived(
    clients.filter((c) => unassignedClientIds.has(c.id))
  );

  console.log(unassignedClients);

  // Derived: Mapping of employee IDs to employee names
  const employeeIdToName = $derived(
    new Map(employees.map((e) => [e.id, e.name]))
  );

  // Derived: Mapping of client IDs to client names
  const clientIdToName = $derived(
    new Map(clients.map((c) => [c.id, c.name]))
  );

  // Computed: Visible assignments (not less relevant, or less relevant if toggle is on)
  const focusAssignments = $derived(
    assignments.filter((a) => a.abnormality_score == -1)
  );

  // Computed: Hidden assignments (less relevant when toggle is off)
  const commonAssignments = $derived(
    assignments.filter((a) => a.abnormality_score == 1)
  );

  function getEmployeeById(id: string): Employee | undefined {
    return employees.find((e) => e.id === id);
  }

  function getClientById(id: string): Client | undefined {
    return clients.find((c) => c.id === id);
  }
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Personalplanung</h1>
    {#if data.error}
      <div
        class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        <p class="font-semibold">Fehler beim Laden der Daten:</p>
        <p>{data.error}</p>
      </div>
    {/if}

    {#if !data.apiData}
      <div
        class="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded"
      >
        <p>
          Keine Daten verfügbar. Bitte überprüfen Sie Ihre API-Konfiguration.
        </p>
      </div>
    {/if}

    <!-- Unassigned Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">
        Nicht zugeordnet
      </h2>

      <!-- Unassigned Employees -->
      {#if unassignedEmployees.length > 0}
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-700 mb-2">
            Mitarbeiter*innen
          </h3>
          <div class="flex flex-wrap gap-2">
            {#each unassignedEmployees as employee}
              <EmployeeModal {employee} client_mappings={clientIdToName} clients={clients} />
            {/each}
          </div>
        </div>
      {/if}

      <!-- Unassigned Clients -->
      {#if unassignedClients.length > 0}
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-2">Klient*innen</h3>
          <div class="flex flex-wrap gap-2">
            {#each unassignedClients as client}
              <ClientModal {client} employees={employees} />
            {/each}
          </div>
        </div>
      {/if}

      {#if unassignedEmployees.length === 0 && unassignedClients.length === 0}
        <p class="text-gray-500 italic">
          Alle Mitarbeiter*innen und Klient*innen sind zugeordnet.
        </p>
      {/if}
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Zugeordnet</h2>
      {#if focusAssignments.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-1">
            <h3 class="text-lg font-medium text-gray-700 mb-2">
              Empfehlungen zur Bearbeitung
            </h3>
            {#each focusAssignments as assignment}
              {@const employee = getEmployeeById(assignment.ma)}
              {@const client = getClientById(assignment.klient)}
              {#if employee && client}
                <AssignmentComponent {assignment} {employee} {client} client_mappings={clientIdToName} employees={employees} clients={clients}/>
              {/if}
            {/each}
          </div>
          <div class="col-span-1 border-l border-gray-200 pl-4">
            <h3 class="text-lg font-medium text-gray-700 mb-2">
              Übliche Zuordnungen
            </h3>
            {#each commonAssignments as assignment}
              {@const employee = getEmployeeById(assignment.ma)}
              {@const client = getClientById(assignment.klient)}
              {#if employee && client}
                <AssignmentComponent {assignment} {employee} {client} client_mappings={clientIdToName} employees={employees} clients={clients}/>
              {/if}
            {/each}
          </div>
        </div>
      {:else}
        <p class="text-gray-500 italic">Keine Zuordnungen gefunden.</p>
      {/if}
    </section>
  </div>
</div>