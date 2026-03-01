import PortfolioSkeleton from "@/components/PortfolioSkeleton";

/**
 * Next.js App Router automatically wraps page.tsx in a <Suspense>
 * boundary using this component as the fallback.
 *
 * Shown while the async `getPortfolioData()` fetch resolves.
 */
export default function Loading() {
  return <PortfolioSkeleton />;
}
