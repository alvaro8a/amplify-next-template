import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function missingEnv() {
  return {
    COGNITO_DOMAIN: !process.env.COGNITO_DOMAIN,
    COGNITO_CLIENT_ID: !process.env.COGNITO_CLIENT_ID,
    COGNITO_REDIRECT_URI: !process.env.COGNITO_REDIRECT_URI,
    COGNITO_CLIENT_SECRET: !process.env.COGNITO_CLIENT_SECRET,
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/auth/callback",
    seen: {
      COGNITO_DOMAIN: Boolean(process.env.COGNITO_DOMAIN),
      COGNITO_CLIENT_ID: Boolean(process.env.COGNITO_CLIENT_ID),
      COGNITO_REDIRECT_URI: Boolean(process.env.COGNITO_REDIRECT_URI),
      COGNITO_CLIENT_SECRET: Boolean(process.env.COGNITO_CLIENT_SECRET),
    },
  });
}

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const missing = missingEnv();
    if (
      missing.COGNITO_DOMAIN ||
      missing.COGNITO_CLIENT_ID ||
      missing.COGNITO_REDIRECT_URI ||
      missing.COGNITO_CLIENT_SECRET
    ) {
      return NextResponse.json({ error: "Missing env vars", missing }, { status: 500 });
    }

    const tokenUrl = `${process.env.COGNITO_DOMAIN}/oauth2/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.COGNITO_CLIENT_ID as string);
    params.append("redirect_uri", process.env.COGNITO_REDIRECT_URI as string);
    params.append("code", code);

    const basic = Buffer.from(
      `${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`
    ).toString("base64");

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: "Token exchange failed", details: data }, { status: 500 });
    }

    const accessToken = String(data?.access_token || "");
    const idToken = String(data?.id_token || "");
    const refreshToken = String(data?.refresh_token || "");
    const expiresIn = Number(data?.expires_in || 3600);

    if (!accessToken || !idToken) {
      return NextResponse.json(
        { error: "Token exchange returned no tokens", details: data },
        { status: 500 }
      );
    }

    const resp = NextResponse.json({ ok: true });

    const secure = true;
    const sameSite: "lax" | "strict" | "none" = "lax";

    resp.cookies.set("qn_access", accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      path: "/",
      maxAge: Math.max(60, expiresIn),
    });

    resp.cookies.set("qn_id", idToken, {
      httpOnly: true,
      secure,
      sameSite,
      path: "/",
      maxAge: Math.max(60, expiresIn),
    });

    if (refreshToken) {
      resp.cookies.set("qn_refresh", refreshToken, {
        httpOnly: true,
        secure,
        sameSite,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return resp;
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}
