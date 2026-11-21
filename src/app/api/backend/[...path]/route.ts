import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ path: string[] }> };

async function forward(request: Request, { params }: RouteContext) {
  const { path } = await params;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const incoming = new URL(request.url);
  const target = `${base}/${path.map(encodeURIComponent).join("/")}${incoming.search}`;
  const headers = new Headers();
  for (const name of ["authorization", "content-type", "accept"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
      cache: "no-store",
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "API server is unavailable" }, { status: 502 });
  }
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
