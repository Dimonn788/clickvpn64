import { createFileRoute, Link, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutGrid, Smartphone, Receipt, Settings as SettingsIcon, LogOut, Shield } from "lucide-react";
import { getUserSession } from "@/lib/api/auth.functions";
import { authClient } from "@/integrations/auth/auth-client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const result = await getUserSession();
    if (!result.user) throw redirect({ to: "/auth" });
    return { user: result.user };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const nav = [
    { to: "/dashboard", icon: LayoutGrid, label: t("dash.overview") },
    { to: "/devices", icon: Smartphone, label: t("dash.devices") },
    { to: "/payments", icon: Receipt, label: t("dash.payments") },
    { to: "/settings", icon: SettingsIcon, label: t("dash.settings") },
  ] as const;

  async function signOut() {
    authClient.clearToken();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[400px] bg-aurora opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 pt-6">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary">
              <Shield className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-tight">ClickVPN</span>
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            {t("nav.signout")}
          </button>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="glass h-fit rounded-2xl p-2">
          <nav className="flex flex-row gap-1 md:flex-col">
            {nav.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    "flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition md:flex-none",
                    active
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
