import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const tokenUrl = `https://quantum-nexus-login.auth.eu-north-1.amazoncognito.com/oauth2/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.COGNITO_CLIENT_ID || "");
    params.append("redirect_uri", process.env.COGNITO_REDIRECT_URI || "");
    params.append("code", code);

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Token exchange failed", details: data },
        { status: 400 }
      );
    }

    // data: { access_token, id_token, refresh_token?, expires_in, token_type }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}
