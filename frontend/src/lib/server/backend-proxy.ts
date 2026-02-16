import { NextRequest, NextResponse } from "next/server";

import { backendApiUrl } from "@/lib/config";

export async function proxyToBackend(request: NextRequest, endpointPath: string) {
  try {
    const targetUrl = `${backendApiUrl}${endpointPath}`;
    const method = request.method;
    const body = method === "GET" || method === "HEAD" ? undefined : await request.text();

    const response = await fetch(targetUrl, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body,
      cache: "no-store"
    });

    const rawBody = await response.text();

    return new NextResponse(rawBody || null, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json"
      }
    });
  } catch {
    return NextResponse.json(
      { message: "Backend service unavailable. Is the backend server running?" },
      { status: 502 }
    );
  }
}
