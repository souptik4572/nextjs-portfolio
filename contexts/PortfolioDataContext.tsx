"use client";
import { createContext, useContext } from "react";
import type { PortfolioData } from "@/lib/data";

const PortfolioDataContext = createContext<PortfolioData | null>(null);

/**
 * Client-side provider that makes the server-fetched portfolio data
 * available to every "use client" component via usePortfolioData().
 */
export function PortfolioDataProvider({
	data,
	children,
}: {
	data: PortfolioData;
	children: React.ReactNode;
}) {
	return (
		<PortfolioDataContext.Provider value={data}>
			{children}
		</PortfolioDataContext.Provider>
	);
}

/**
 * Hook for client components to access portfolio data.
 * Must be rendered inside <PortfolioDataProvider>.
 */
export function usePortfolioData(): PortfolioData {
	const ctx = useContext(PortfolioDataContext);
	if (!ctx) {
		throw new Error(
			"usePortfolioData must be used within a PortfolioDataProvider",
		);
	}
	return ctx;
}
