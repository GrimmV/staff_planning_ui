import { fetchStaffPlanningData } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		// Initial body for the POST request - empty object for now
		// This can be customized based on what the API expects
		const body = {};
		
		const data = await fetchStaffPlanningData(body);
		
		return {
			apiData: data
		};
	} catch (error) {
		console.error('Failed to load staff planning data:', error);
		
		// Return error information so the component can handle it
		return {
			apiData: null,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
};

