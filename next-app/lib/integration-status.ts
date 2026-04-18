export type IntegrationHealth = {
  supabase: boolean
  /** Supabase project is configured; enable Google/GitHub in Supabase Dashboard → Authentication → Providers */
  oauth: boolean
  /** SMTP (host + user + pass) or RESEND_API_KEY is set for transactional email */
  email: boolean
  emailProvider: "smtp" | "resend" | "none"
}

export function getIntegrationHealth(): IntegrationHealth {
  const supabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim())

  const smtpConfigured =
    Boolean(process.env.SMTP_HOST?.trim()) &&
    Boolean(process.env.SMTP_USER?.trim()) &&
    Boolean(process.env.SMTP_PASS?.trim())

  const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim())

  return {
    supabase,
    oauth: supabase,
    email: smtpConfigured || resendConfigured,
    emailProvider: resendConfigured ? "resend" : smtpConfigured ? "smtp" : "none",
  }
}
