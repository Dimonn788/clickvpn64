import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Check, Loader2, Shield, CreditCard } from "lucide-react";
import { createSubscriptionForUser } from "@/lib/api/auth.functions";
import { useAuth } from "@/hooks/use-auth";

const PLANS = {
  1: { months: 1, price: 109, label: "1 месяц" },
  3: { months: 3, price: 299, label: "3 месяца" },
  6: { months: 6, price: 589, label: "6 месяцев" },
  12: { months: 12, price: 1099, label: "12 месяцев" },
} as const;

type PlanMonths = keyof typeof PLANS;

const search = z.object({
  plan: z.coerce.number().pipe(z.union([z.literal(1), z.literal(3), z.literal(6), z.literal(12)])).catch(6),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Оплата — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: search,
  component: CheckoutPage,
});

function randomKey() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const b64 = btoa(String.fromCharCode(...bytes)).replace(/=/g, "");
  return `vless://${b64}@clickvpn.app:443?security=tls&type=tcp#ClickVPN`;
}

function CheckoutPage() {
  const { plan } = useSearch({ from: "/checkout" });
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const months = plan as PlanMonths;
  const p = PLANS[months];

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const now = new Date();
      const expires = new Date(now);
      expires.setMonth(expires.getMonth() + p.months);

      await createSubscriptionForUser({
        data: {
          planMonths: p.months,
          vpnKey: randomKey(),
          startedAt: now.toISOString(),
          expiresAt: expires.toISOString(),
          amountRub: p.price,
        },
      });

      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось обработать платёж");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[500px] bg-aurora opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-4 py-12">
        <Link to="/" hash="pricing" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="size-3.5" /> К тарифам
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary">
            <Shield className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">ClickVPN</span>
          <span className="ml-2 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300">test mode</span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Оплата подписки</h1>
        <p className="mt-2 text-sm text-muted-foreground">Тестовая оплата — деньги не списываются.</p>

        <div className="glass-strong mt-8 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Тариф</span>
            <span className="text-sm font-medium">{p.label}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium">{loading ? "…" : user?.email ?? "—"}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-sm text-muted-foreground">К оплате</span>
            <span className="text-2xl font-semibold tracking-tight">
              {new Intl.NumberFormat("ru-RU").format(p.price)} ₽
            </span>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {["До 5 устройств", "Безлимитный трафик", "7 локаций", "Поддержка 24/7"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="grid size-4 place-items-center rounded-full bg-primary/15">
                  <Check className="size-2.5 text-primary" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {error && (
            <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          <button
            onClick={pay}
            disabled={busy || loading}
            className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
            {busy ? "Обработка…" : "Оплатить"}
          </button>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Нажимая «Оплатить», вы соглашаетесь с условиями сервиса.
          </p>
        </div>
      </div>
    </div>
  );
}
