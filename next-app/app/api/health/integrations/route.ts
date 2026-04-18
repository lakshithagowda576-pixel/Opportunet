import { NextResponse } from "next/server"
import { getIntegrationHealth } from "@/lib/integration-status"

export const dynamic = "force-dynamic"

export function GET() {
  const health = getIntegrationHealth()
  return NextResponse.json(health)
}
