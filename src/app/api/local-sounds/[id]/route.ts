import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";

const files: Record<string, string> = {
  button: "button.mp3",
  open: "open.mp3",
  change: "change.mp3",
  unlock: "unlock.mp3",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.LOCAL_PRIVATE_MEDIA !== "true" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(request.nextUrl.hostname) ||
    !Object.hasOwn(files, id)
  )
    return new Response(null, { status: 404 });
  try {
    const bytes = await readFile(
      path.join(process.cwd(), "music", "sfx", files[id]),
    );
    return new Response(bytes, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, no-store",
        "Cross-Origin-Resource-Policy": "same-origin",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
