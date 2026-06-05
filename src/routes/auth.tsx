import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Mail, Lock } from "lucide-react";
import { authClient } from "@/integrations/auth/auth-client";
import { login } from "@/lib/api/auth.functions";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Вход — ClickVPN" },
      { name: "description", content: "Вход в кабинет ClickVPN по email и паролю." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const result = await login({ data: { email, password } });
      authClient.setToken(result.token);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error.generic"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[500px] bg-aurora opacity-60" aria-hidden />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-12">
        <a href="/" className="mb-8 flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary">
            <Shield className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">ClickVPN</span>
        </a>

        <div className="glass w-full rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">{t("auth.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("auth.subtitle")}</p>

          <form onSubmit={signIn} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">{t("auth.email")}</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-background/40 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">{t("auth.password")}</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-background/40 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/60"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-60"
            >
              <Lock className="size-4" />
              {t("auth.send")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
