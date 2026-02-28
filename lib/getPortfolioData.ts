import { portfolioData, type PortfolioData } from "@/lib/data";

/**
 * Fetch portfolio data from Firebase Realtime Database REST API.
 *
 * Uses Next.js ISR caching (revalidate every 3600 s / 1 hour).
 * Falls back to the static `portfolioData` export from data.ts
 * when the env variable is missing or the request fails.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
	const dbUrl = process.env.FIREBASE_DATABASE_URL;

	if (!dbUrl) {
		console.warn(
			"[getPortfolioData] FIREBASE_DATABASE_URL not set — using static fallback",
		);
		return portfolioData;
	}

	try {
		const res = await fetch(`${dbUrl}/.json`, {
			next: { revalidate: 3600 },
		});

		if (!res.ok) {
			throw new Error(`Firebase responded with ${res.status}`);
		}

		const data: PortfolioData = await res.json();
		return data;
	} catch (error) {
		console.error(
			"[getPortfolioData] Firebase fetch failed — using static fallback:",
			error,
		);
		return portfolioData;
	}
}
