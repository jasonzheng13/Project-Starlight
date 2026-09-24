import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stream byte ranges so long tracks do not have to be buffered in server memory.
export async function GET(request: Request) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.LOCAL_PRIVATE_MEDIA !== "true" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname)
  ) {
    return new Response(null, { status: 404 });
  }
  const constellation =
    new URL(request.url).searchParams.get("constellation") ?? "year-1";
  const tracks: Record<string, string[]> = {
    "year-1": [
      "sfx",
      "City of Winds and Idylls - Disc 1 City of Winds and Idylls｜Genshin Impact.mp3",
    ],
  };
  if (!Object.hasOwn(tracks, constellation))
    return new Response(null, { status: 404 });
  const filename = path.join(process.cwd(), "music", ...tracks[constellation]);
  let size: number;
  try {
    size = (await stat(filename)).size;
  } catch {
    return new Response(null, { status: 404 });
  }
  if (!size) return new Response(null, { status: 404 });
  const headers = new Headers({
    "Content-Type": "audio/mpeg",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Content-Type-Options": "nosniff",
  });
  let start = 0;
  let end = size - 1;
  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2]))
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    if (match[1]) {
      start = Number(match[1]);
      if (match[2]) end = Math.min(Number(match[2]), size - 1);
    } else {
      start = Math.max(0, size - Number(match[2]));
    }
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start > end ||
      start >= size
    )
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  }
  headers.set("Content-Length", String(end - start + 1));
  return new Response(
    Readable.toWeb(
      createReadStream(filename, { start, end }),
    ) as ReadableStream<Uint8Array>,
    { status: range ? 206 : 200, headers },
  );
}
