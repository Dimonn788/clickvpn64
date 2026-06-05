import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Check, ArrowRight, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { getLatestSubscriptionForUser } from "@/lib/api/auth.functions";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Кабинет — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Overview,
});

type Subscription = {
  id: string;
  plan_months: number;
  status: "pending" | "active" | "expired" | "cancelled";
  vpn_key: string | null;
  expires_at: string | null;
};

function Overview() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    getLatestSubscriptionForUser().then(({ subscription }) => {
      setSub(subscription);
      setLoaded(true);
    });
  }, [user]);

  async function copyKey() {
    if (!sub?.vpn_key) return;

    async function fallbackCopy(text: string) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    }

    try {
      await navigator.clipboard.writeText(sub.vpn_key);
      toast.success(t("dash.key.copied"));
    } catch (error) {
      console.warn("Clipboard write failed, trying fallback copy:", error);
      const ok = fallbackCopy(sub.vpn_key);
      if (ok) {
        toast.success(t("dash.key.copied"));
      } else {
        toast.error("Не удалось скопировать ключ");
        console.error("Clipboard fallback failed");
        return;
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const statusLabel = sub
    ? sub.status === "active"
      ? `${t("dash.subscription.active")} ${sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : ""}`
      : sub.status === "pending"
      ? t("dash.subscription.pending")
      : t("dash.subscription.expired")
    : t("dash.subscription.none");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("dash.overview")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{t("dash.subscription")}</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">{t("dash.subscription")}</h2>
            {sub?.status === "active" && (
              <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                active
              </span>
            )}
          </div>
          <p className="mt-3 text-xl font-semibold tracking-tight">{statusLabel}</p>
          {!sub && loaded && (
            <p className="mt-1 text-xs text-muted-foreground">{t("dash.subscription.choose")}</p>
          )}
          <Link
            to="/checkout"
            search={{ plan: 6 }}
            className="btn-primary mt-5 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium"
          >
            {sub?.status === "active" ? t("dash.renew") : "Оформить"}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            <h2 className="text-sm font-medium text-muted-foreground">{t("dash.key.title")}</h2>
          </div>
          {sub?.vpn_key ? (
            <>
              <code className="mt-3 block max-h-32 overflow-auto break-all rounded-xl border border-white/10 bg-background/40 px-3 py-2.5 font-mono text-xs">
                {sub.vpn_key}
              </code>
              <button
                onClick={copyKey}
                disabled={!sub?.vpn_key}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? t("dash.key.copied") : t("dash.key.copy")}
              </button>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">{t("dash.key.none")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
