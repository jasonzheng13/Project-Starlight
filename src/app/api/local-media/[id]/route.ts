import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const files: Record<string, string> = {
  "year-1-memory-1": "first_year_1.png",
  "year-1-memory-2": "first_year_2.png",
  "year-1-memory-3": "first_year_3.png",
};

// This is a local preview adapter, not authentication. Production fails closed.
// An allowlist prevents caller-controlled paths from reaching the filesystem.
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const hostname = new URL(request.url).hostname;
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.LOCAL_PRIVATE_MEDIA !== "true" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(hostname)
  ) {
    return new Response(null, { status: 404 });
  }
  const { id } = await context.params;
  const filename = Object.hasOwn(files, id) ? files[id] : undefined;
  if (!filename) return new Response(null, { status: 404 });
  try {
    const file = await readFile(
      path.join(process.cwd(), "pictures", "first_year", filename),
    );
    return new Response(file, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Cross-Origin-Resource-Policy": "same-origin",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
