declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
    NEXT_PUBLIC_SUPABASE_PROJECT_ID?: string;
    /** Server-only secret key (writes). Never expose to the client. */
    SUPABASE_SECRET_KEY?: string;
    /** Optional comma-separated admin emails. If unset, any authenticated user can edit. */
    ADMIN_EMAILS?: string;
  }
}
