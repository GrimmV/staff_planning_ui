import { env } from '$env/dynamic/public';
import type { ApiResponse } from './types';

export async function fetchStaffPlanningData(body: unknown): Promise<ApiResponse> {
	const apiUrl = env.PUBLIC_API_URL;

	console.log(apiUrl);
	
	if (!apiUrl) {
		throw new Error('PUBLIC_API_URL environment variable is not set');
	}

	try {
		const response = await fetch(apiUrl + "/recommendations", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({}),
		});

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
		}

		const data: ApiResponse = await response.json();
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to fetch staff planning data: ${error.message}`);
		}
		throw new Error('Failed to fetch staff planning data: Unknown error');
	}
}

