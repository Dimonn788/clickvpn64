import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Send, Mail, Loader2, Check } from "lucide-react";
import { updateTelegram, getUserSession } from "@/lib/api/auth.functions";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Настройки — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [tg, setTg] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserSession().then((result) => {
      if (result.user) {
        setTg(result.user.telegram_username ?? "");
      }
    });
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    await updateTelegram({ data: { telegramUsername: tg.trim().replace(/^@/, "") || undefined } });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("dash.settings")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Настройки аккаунта</h1>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="size-4" />
          Email
        </div>
        <p className="mt-2 font-medium">{user?.email ?? "—"}</p>
        <p className="mt-1 text-xs text-muted-foreground">Используется для входа по email и паролю.</p>
      </div>

      <form onSubmit={save} className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Send className="size-4" />
          Telegram
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Привяжите username, чтобы получать уведомления о подписке и продлении.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
            <input
              value={tg}
              onChange={(e) => setTg(e.target.value)}
              placeholder="username"
              className="w-full rounded-xl border border-white/10 bg-background/40 py-2.5 pl-7 pr-3.5 text-sm outline-none transition focus:border-primary/60"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : saved ? <Check className="size-3.5" /> : null}
            {saved ? "Сохранено" : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
