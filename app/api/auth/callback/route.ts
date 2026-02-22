import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = body?.code;

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const required = {
      COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
      COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
      COGNITO_REDIRECT_URI: process.env.COGNITO_REDIRECT_URI,
      COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    };

    const missing = Object.fromEntries(
      Object.entries(required).map(([k, v]) => [k, !v])
    );

    const hasMissing = Object.values(missing).some(Boolean);
    if (hasMissing) {
      return NextResponse.json(
        { error: "Missing env vars", missing },
        { status: 500 }
      );
    }

    const tokenUrl = `${required.COGNITO_DOMAIN}/oauth2/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", required.COGNITO_CLIENT_ID!);
    params.append("redirect_uri", required.COGNITO_REDIRECT_URI!);
    params.append("code", code);

    // Cognito (confidential client) -> Basic Auth con client_secret
    const basic = Buffer.from(
      `${required.COGNITO_CLIENT_ID}:${required.COGNITO_CLIENT_SECRET}`
    ).toString("base64");

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: params.toString(),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: "Token exchange failed", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, tokens: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}
