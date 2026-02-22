import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// GET solo para comprobar que la ruta EXISTE (evita el “404” al abrirla en navegador)
export async function GET() {
  return json({
    ok: true,
    route: "/api/auth/callback",
    methods: ["POST"],
  });
}

export async function POST(req: Request) {
  try {
    // 1) Lee code (acepta JSON o form)
    let code: string | undefined;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      code = body?.code;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      code = params.get("code") || undefined;
    } else {
      // fallback: intenta JSON
      const body = await req.json().catch(() => ({}));
      code = body?.code;
    }

    if (!code) return json({ error: "Missing code" }, 400);

    // 2) Env obligatorias
    const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN || ""; // ej: quantum-nexus-login.auth.eu-north-1.amazoncognito.com
    const CLIENT_ID = process.env.COGNITO_CLIENT_ID || "";
    const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || ""; // si tu App Client tiene “secret de cliente”
    const REDIRECT_URI = process.env.COGNITO_REDIRECT_URI || ""; // DEBE coincidir EXACTO con Cognito

    if (!COGNITO_DOMAIN || !CLIENT_ID || !REDIRECT_URI) {
      return json(
        {
          error: "Missing env vars",
          missing: {
            COGNITO_DOMAIN: !COGNITO_DOMAIN,
            COGNITO_CLIENT_ID: !CLIENT_ID,
            COGNITO_REDIRECT_URI: !REDIRECT_URI,
            COGNITO_CLIENT_SECRET: !CLIENT_SECRET, // no siempre obligatorio
          },
        },
        500
      );
    }

    // 3) Token endpoint
    const tokenUrl = `https://${COGNITO_DOMAIN}/oauth2/token`;

    const params = new URLSearchParams();
    params.set("grant_type", "authorization_code");
    params.set("client_id", CLIENT_ID);
    params.set("redirect_uri", REDIRECT_URI);
    params.set("code", code);

    // Si hay secret, lo mandamos como Basic Auth (lo correcto para clientes con secret)
    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    if (CLIENT_SECRET) {
      const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
      headers["Authorization"] = `Basic ${basic}`;
    }

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers,
      body: params.toString(),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return json(
        {
          error: "Token exchange failed",
          status: res.status,
          details: data,
        },
        400
      );
    }

    // 4) Guardamos tokens en cookies (Aurora podrá “reconocer usuario” leyendo id_token luego)
    const response = json({ ok: true }, 200);

    // id_token suele traer email/sub, access_token sirve para llamadas, refresh_token si existe
    if (data?.id_token) {
      response.cookies.set("qn_id_token", data.id_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1h
      });
    }
    if (data?.access_token) {
      response.cookies.set("qn_access_token", data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1h
      });
    }
    if (data?.refresh_token) {
      response.cookies.set("qn_refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 días
      });
    }

    return response;
  } catch (e: any) {
    return json(
      {
        error: "Server error",
        details: String(e?.message || e),
      },
      500
    );
  }
}
