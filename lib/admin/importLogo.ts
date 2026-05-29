/**
 * Asks the server to download `url` and store it under
 * `/public/images/companies/<slug>.<ext>`. Returns the resulting public
 * path on success, or the original URL on failure (e.g. running on a
 * read-only deployment filesystem) so the caller can degrade gracefully.
 */
export async function importLogo(url: string, slug: string): Promise<string> {
  if (!url) return url;
  try {
    const res = await fetch("/api/import-logo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, slug }),
    });
    if (!res.ok) return url;
    const data = (await res.json()) as { path?: string };
    return data.path || url;
  } catch {
    return url;
  }
}
