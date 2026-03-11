import type { PortfolioData } from "@/lib/data";

/**
 * Fetch portfolio data from Firebase Realtime Database REST API.
 *
 * Uses Next.js ISR caching (revalidate every 300 s / 5 minutes).
 * Throws if FIREBASE_DATABASE_URL is not set or the request fails.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
	const dbUrl = process.env.FIREBASE_DATABASE_URL;

	if (!dbUrl) {
		throw new Error(
			"[getPortfolioData] FIREBASE_DATABASE_URL is not set",
		);
	}

	const res = await fetch(`${dbUrl}/.json`, {
		next: { revalidate: 300 },
	});

	if (!res.ok) {
		throw new Error(`[getPortfolioData] Firebase responded with ${res.status}`);
	}

	const data: PortfolioData = await res.json();
	return data;
}
