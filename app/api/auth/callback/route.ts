import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function bool(v: any) {
  return v !== undefined && v !== null && String(v).trim() !== "";
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/auth/callback",
    seen: {
      COGNITO_DOMAIN: bool(process.env.COGNITO_DOMAIN),
      COGNITO_CLIENT_ID: bool(process.env.COGNITO_CLIENT_ID),
      COGNITO_REDIRECT_URI: bool(process.env.COGNITO_REDIRECT_URI),
      COGNITO_CLIENT_SECRET: bool(process.env.COGNITO_CLIENT_SECRET),
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    if (!code) {
      return NextResponse.json({ ok: false, error: "Missing code" }, { status: 400 });
    }

    const COGNITO_DOMAIN = (process.env.COGNITO_DOMAIN || "").trim();
    const COGNITO_CLIENT_ID = (process.env.COGNITO_CLIENT_ID || "").trim();
    const COGNITO_REDIRECT_URI = (process.env.COGNITO_REDIRECT_URI || "").trim();
    const COGNITO_CLIENT_SECRET = (process.env.COGNITO_CLIENT_SECRET || "").trim();

    const missing = {
      COGNITO_DOMAIN: !COGNITO_DOMAIN,
      COGNITO_CLIENT_ID: !COGNITO_CLIENT_ID,
      COGNITO_REDIRECT_URI: !COGNITO_REDIRECT_URI,
      COGNITO_CLIENT_SECRET: !COGNITO_CLIENT_SECRET,
    };

    if (missing.COGNITO_DOMAIN || missing.COGNITO_CLIENT_ID || missing.COGNITO_REDIRECT_URI || missing.COGNITO_CLIENT_SECRET) {
      return NextResponse.json({ ok: false, error: "Missing env vars", missing }, { status: 500 });
    }

    const tokenUrl = `${COGNITO_DOMAIN.replace(/\/$/, "")}/oauth2/token`;

    const params = new URLSearchParams();
    params.set("grant_type", "authorization_code");
    params.set("client_id", COGNITO_CLIENT_ID);
    params.set("redirect_uri", COGNITO_REDIRECT_URI);
    params.set("code", code);

    const basic = Buffer.from(`${COGNITO_CLIENT_ID}:${COGNITO_CLIENT_SECRET}`).toString("base64");

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: params.toString(),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Token exchange failed", details: data }, { status: 500 });
    }

    const accessToken = typeof data?.access_token === "string" ? data.access_token : "";
    const idToken = typeof data?.id_token === "string" ? data.id_token : "";
    const refreshToken = typeof data?.refresh_token === "string" ? data.refresh_token : "";
    const expiresIn = Number.isFinite(Number(data?.expires_in)) ? Number(data.expires_in) : 3600;

    if (!accessToken || !idToken) {
      return NextResponse.json({ ok: false, error: "Missing tokens", details: data }, { status: 500 });
    }

    const r = NextResponse.json({ ok: true });

    const secure = true;

    r.cookies.set("qn_access", accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(60, expiresIn),
    });

    r.cookies.set("qn_id", idToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(60, expiresIn),
    });

    if (refreshToken) {
      r.cookies.set("qn_refresh", refreshToken, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return r;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "Server error", details: String(e?.message || e) }, { status: 500 });
  }
}
