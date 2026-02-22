import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const COGNITO_DOMAIN = mustEnv("COGNITO_DOMAIN"); // https://xxx.auth.region.amazoncognito.com
    const COGNITO_CLIENT_ID = mustEnv("COGNITO_CLIENT_ID");
    const COGNITO_REDIRECT_URI = mustEnv("COGNITO_REDIRECT_URI");

    const tokenUrl = `${COGNITO_DOMAIN}/oauth2/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", COGNITO_CLIENT_ID);
    params.append("redirect_uri", COGNITO_REDIRECT_URI);
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
    const response = NextResponse.json({ ok: true });

    // Cookies HttpOnly = sesión real en navegador
    // Ajusta maxAge si quieres
    const maxAge = Number(data.expires_in ?? 3600);

    response.cookies.set("qn_access_token", data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    response.cookies.set("qn_id_token", data.id_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    if (data.refresh_token) {
      response.cookies.set("qn_refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        // refresh suele durar más, pero Cognito lo controla
      });
    }

    return response;
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}
