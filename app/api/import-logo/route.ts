import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const CONTENT_TYPE_EXT: Record<string, string> = {
  "image/svg+xml": "svg",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

const MAX_BYTES = 2 * 1024 * 1024;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function extFromUrl(url: string): string | null {
  const m = url.split("?")[0].match(/\.(svg|png|jpe?g|webp|gif|ico)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : null;
}

export async function POST(request: Request) {
  try {
    const { url, slug } = (await request.json()) as {
      url?: unknown;
      slug?: unknown;
    };

    if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }
    if (typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const safeSlug = slugify(slug);
    if (!safeSlug) {
      return NextResponse.json({ error: "Slug normalises to empty" }, { status: 400 });
    }

    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream fetch failed (${res.status})` },
        { status: 502 },
      );
    }

    const contentType = (res.headers.get("content-type") || "")
      .split(";")[0]
      .trim()
      .toLowerCase();
    const ext = CONTENT_TYPE_EXT[contentType] ?? extFromUrl(url);
    if (!ext) {
      return NextResponse.json(
        { error: `Unsupported content-type: ${contentType || "unknown"}` },
        { status: 415 },
      );
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "Logo too large" }, { status: 413 });
    }

    const dir = path.join(process.cwd(), "public", "images", "companies");
    await fs.mkdir(dir, { recursive: true });
    const fileName = `${safeSlug}.${ext}`;
    await fs.writeFile(path.join(dir, fileName), buf);

    return NextResponse.json({ path: `/images/companies/${fileName}` });
  } catch (err) {
    console.error("import-logo failed:", err);
    return NextResponse.json(
      { error: "Failed to import logo" },
      { status: 500 },
    );
  }
}
