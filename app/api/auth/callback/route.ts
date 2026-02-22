export async function GET() {
  return NextResponse.json({
    ok: true,
    runtime: "nodejs",
    seen: {
      COGNITO_DOMAIN: Boolean(process.env.COGNITO_DOMAIN),
      COGNITO_CLIENT_ID: Boolean(process.env.COGNITO_CLIENT_ID),
      COGNITO_REDIRECT_URI: Boolean(process.env.COGNITO_REDIRECT_URI),
      COGNITO_CLIENT_SECRET: Boolean(process.env.COGNITO_CLIENT_SECRET),
    },
    // (no devuelve valores, solo true/false)
  });
}
