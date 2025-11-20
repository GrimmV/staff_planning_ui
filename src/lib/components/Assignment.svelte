<script lang="ts">
  import type { Assignment, Employee, Client } from "$lib/types";

  interface Props {
    assignment: Assignment;
    employee: Employee;
    client: Client;
    openPopover: (e: MouseEvent, type: "employee" | "client" | "assignment", itemId: string) => void;
  }
  let { assignment, employee, client, openPopover }: Props = $props();
</script>

<div
  class="relative p-4 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all {assignment.abnormality_score == 0 ? 'opacity-60' : ''}"
>
  <div class="flex items-center justify-between mb-2">
    <div class="flex items-center justify-between gap-2 w-full">
      {#if assignment.abnormality_score == 0}
        <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          Entspricht üblichem Muster
        </span>
      {/if}
      <button
        onclick={(e) => {
          e.stopPropagation();
          openPopover(e, "assignment", assignment.ma + assignment.klient);
        }}
        class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        aria-label="Open assignment options"
        title="Assignment options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
    </div>
  </div>
  <div class="flex items-center justify-start gap-2">
    <div class="flex items-center gap-2">
      <button
        onclick={(e) => {
          e.stopPropagation();
          openPopover(e, "employee", employee.id);
        }}
        class="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors text-left"
      >
        {employee.id}
      </button>
    </div>
    <div class="text-gray-400">↔</div>
    <div class="flex items-center gap-2">
      <button
        onclick={(e) => {
          e.stopPropagation();
          openPopover(e, "client", client.id);
        }}
        class="text-green-600 hover:text-green-800 font-medium hover:underline transition-colors text-left"
      >
        {client.id}
      </button>
    </div>
  </div>
</div>
