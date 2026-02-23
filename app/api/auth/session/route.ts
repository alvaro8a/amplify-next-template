import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const jar = cookies();
  const access = jar.get("qn_access")?.value || "";
  const idt = jar.get("qn_id")?.value || "";

  return NextResponse.json({
    ok: true,
    loggedIn: Boolean(access && idt),
    has: {
      qn_access: Boolean(access),
      qn_id: Boolean(idt),
      qn_refresh: Boolean(jar.get("qn_refresh")?.value || ""),
    },
  });
}
