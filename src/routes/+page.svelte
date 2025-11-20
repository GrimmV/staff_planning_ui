<script lang="ts">
  import "../app.css";
  import Popover from "$lib/components/Popover.svelte";
  import type {
    Employee,
    Client,
    Assignment as AssignmentType,
    ApiResponse,
  } from "$lib/types";
  import AssignmentComponent from "$lib/components/Assignment.svelte";
  import IndividualPopover from "$lib/components/IndividualPopover.svelte";
  import AssignmentPopover from "$lib/components/AssignmentPopover.svelte";
  import type { PageData } from "./$types";

  interface PageDataWithApi {
    apiData: ApiResponse | null;
    error?: string;
  }

  let { data }: { data: PageDataWithApi } = $props();

  console.log(data);

  // Transform API data to component state - use $derived to reactively update when data changes
  const employees: Employee[] = $derived(data.apiData?.mas || []);
  const clients: Client[] = $derived(data.apiData?.clients || []);
  const assignments: AssignmentType[] = $derived(
    data.apiData?.assignment_info.assigned_pairs || []
  );

  console.log(assignments);
  console.log(employees);
  console.log(clients); 

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

  console.log(unassignedEmployeeIds);
  console.log(unassignedClientIds);

  let showLessRelevant = $state(false);

  // Popover state
  let popoverOpen = $state(false);
  let popoverX = $state(0);
  let popoverY = $state(0);
  let popoverTitle = $state("");
  let popoverContent = $state<"employee" | "client" | "assignment" | null>(
    null
  );
  let popoverItemId = $state<string | null>(null);

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

  // Computed: Visible assignments (not less relevant, or less relevant if toggle is on)
  const focusAssignments = $derived(
    assignments.filter((a) => a.abnormality_score == 1)
  );

  // Computed: Hidden assignments (less relevant when toggle is off)
  const commonAssignments = $derived(
    assignments.filter((a) => a.abnormality_score == 0)
  );

  function getEmployeeById(id: string): Employee | undefined {
    return employees.find((e) => e.id === id);
  }

  function getClientById(id: string): Client | undefined {
    return clients.find((c) => c.id === id);
  }

  function openPopover(
    event: MouseEvent,
    type: "employee" | "client" | "assignment",
    itemId: string
  ) {
    // Get the button element that was clicked
    const button = event.currentTarget as HTMLElement;
    if (!button) return;

    // Get button position
    const rect = button.getBoundingClientRect();
    const padding = 8;
    const popoverWidth = 400;
    const popoverHeight = 200;

    // Position popover below the button, aligned to left edge
    let x = rect.left;
    let y = rect.bottom + padding;

    // If popover would go off right edge, align to right edge of button
    if (x + popoverWidth > window.innerWidth) {
      x = rect.right - popoverWidth;
    }

    // If popover would go off bottom edge, position above button instead
    if (y + popoverHeight > window.innerHeight) {
      y = rect.top - popoverHeight - padding;
    }

    // Ensure popover doesn't go off left or top edges
    x = Math.max(padding, x);
    y = Math.max(padding, y);

    popoverX = x;
    popoverY = y;
    popoverContent = type;
    popoverItemId = itemId;

    // Set title based on type
    if (type === "employee") {
      const employee = getEmployeeById(itemId);
      popoverTitle = employee ? `Employee: ${employee.name}` : "Employee";
    } else if (type === "client") {
      const client = getClientById(itemId);
      popoverTitle = client ? `Client: ${client.name}` : "Client";
    } else if (type === "assignment") {
      const assignment = assignments.find((a) => a.id === itemId);
      if (assignment) {
        const employee = getEmployeeById(assignment.ma);
        const client = getClientById(assignment.klient);
        popoverTitle = `Assignment: ${employee?.name} ↔ ${client?.name}`;
      } else {
        popoverTitle = "Assignment";
      }
    }

    popoverOpen = true;
  }

  function closePopover() {
    popoverOpen = false;
    popoverContent = null;
    popoverItemId = null;
  }
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Staff Planning</h1>

    {#if data.error}
      <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p class="font-semibold">Error loading data:</p>
        <p>{data.error}</p>
      </div>
    {/if}

    {#if !data.apiData}
      <div class="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <p>No data available. Please check your API configuration.</p>
      </div>
    {/if}

    <!-- Unassigned Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Unassigned</h2>

      <!-- Unassigned Employees -->
      {#if unassignedEmployees.length > 0}
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-700 mb-2">Employees</h3>
          <div class="flex flex-wrap gap-2">
            {#each unassignedEmployees as employee}
              <button
                onclick={(e) => openPopover(e, "employee", employee.id)}
                class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors cursor-pointer"
              >
                {employee.id}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Unassigned Clients -->
      {#if unassignedClients.length > 0}
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-2">Clients</h3>
          <div class="flex flex-wrap gap-2">
            {#each unassignedClients as client}
              <button
                onclick={(e) => openPopover(e, "client", client.id)}
                class="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors cursor-pointer"
              >
                {client.id}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      {#if unassignedEmployees.length === 0 && unassignedClients.length === 0}
        <p class="text-gray-500 italic">
          Alle Mitarbeiter*innen und Kunden sind zugeordnet.
        </p>
      {/if}
    </section>

    {#if focusAssignments.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-1">
			<h3 class="text-lg font-medium text-gray-700 mb-2">Empfehlungen zur Bearbeitung</h3>
          {#each focusAssignments as assignment}
            {@const employee = getEmployeeById(assignment.ma)}
            {@const client = getClientById(assignment.klient)}
            {#if employee && client}
              <AssignmentComponent
                {assignment}
                {employee}
                {client}
                {openPopover}
              />
            {/if}
          {/each}
        </div>
		<div class="col-span-1 border-l border-gray-200 pl-4">
			<h3 class="text-lg font-medium text-gray-700 mb-2">Übliche Zuordnungen</h3>
			{#each commonAssignments as assignment}
			  {@const employee = getEmployeeById(assignment.ma)}
			  {@const client = getClientById(assignment.klient)}
			  {#if employee && client}
				<AssignmentComponent
				  {assignment}
				  {employee}
				  {client}
				  {openPopover}
				/>
			  {/if}
			{/each}
		</div>
	</div>
    {:else}
      <p class="text-gray-500 italic">Keine Zuordnungen gefunden.</p>
    {/if}
  </div>
</div>

<!-- Popover -->
<Popover
  bind:open={popoverOpen}
  bind:x={popoverX}
  bind:y={popoverY}
  bind:title={popoverTitle}
>
  {#if popoverContent === "employee" && popoverItemId}
    {@const employee = getEmployeeById(popoverItemId)}
    {#if employee}
      <IndividualPopover toAssign={clients} />
    {/if}
  {:else if popoverContent === "client" && popoverItemId}
    {@const client = getClientById(popoverItemId)}
    {#if client}
      <IndividualPopover toAssign={employees} />
    {/if}
  {:else if popoverContent === "assignment" && popoverItemId}
    {@const assignment = assignments.find((a) => a.id === popoverItemId)}
    {#if assignment}
      {@const employee = getEmployeeById(assignment.employeeId)}
      {@const client = getClientById(assignment.clientId)}
      {#if employee && client}
        <AssignmentPopover {assignment} {employee} {client} />
      {/if}
    {/if}
  {/if}
</Popover>
