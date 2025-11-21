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
  <button type="button" class="btn variant-filled" onclick={() => {}}>Verbieten</button>
</div>
