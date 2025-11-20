<script lang="ts">
  import type {
    Employee,
    Client,
    Assignment as AssignmentType,
  } from "$lib/types";
  interface Props {
    assignment: AssignmentType;
    employee: Employee;
    client: Client;
  }
  let { assignment, employee, client }: Props = $props();
</script>

<div class="m-2">
  <button class="bg-blue-500 text-white px-4 py-2 rounded-md" onclick={() => {}}>Verbieten</button>
</div>
