// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { ApiResponse } from './lib/types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			apiData: ApiResponse | null;
			error?: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
