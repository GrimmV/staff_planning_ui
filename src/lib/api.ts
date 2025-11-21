import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { ApiResponse } from './types';

const CACHE_KEY = 'staff-planning-api-cache';

// Helper functions for localStorage cache management
function loadCacheFromStorage(): Map<string, ApiResponse> {
	if (!browser) {
		return new Map();
	}

	try {
		const cached = localStorage.getItem(CACHE_KEY);
		if (cached) {
			const parsed = JSON.parse(cached) as Record<string, ApiResponse>;
			return new Map(Object.entries(parsed));
		}
	} catch (error) {
		console.warn('Failed to load cache from localStorage:', error);
	}
	
	return new Map();
}

function saveCacheToStorage(cache: Map<string, ApiResponse>): void {
	if (!browser) {
		return;
	}

	try {
		const cacheObject = Object.fromEntries(cache);
		localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
	} catch (error) {
		console.warn('Failed to save cache to localStorage:', error);
	}
}

// Initialize cache from localStorage
const responseCache = loadCacheFromStorage();

export async function fetchStaffPlanningData(body: unknown): Promise<ApiResponse> {
	const apiUrl = env.PUBLIC_API_URL;
	
	if (!apiUrl) {
		throw new Error('PUBLIC_API_URL environment variable is not set');
	}

	// Create a cache key from the stringified body
	const bodyString = JSON.stringify(body);
	
	// Check if we have a cached response for this body
	if (responseCache.has(bodyString)) {
		console.log('Returning cached response');
		return responseCache.get(bodyString)!;
	}

	try {
		const response = await fetch(apiUrl + "/recommendations", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: bodyString,
		});

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
		}

		const data: ApiResponse = await response.json();
		
		// Cache the response for future use
		responseCache.set(bodyString, data);
		saveCacheToStorage(responseCache);
		
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to fetch staff planning data: ${error.message}`);
		}
		throw new Error('Failed to fetch staff planning data: Unknown error');
	}
}

