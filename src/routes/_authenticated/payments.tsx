import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Receipt, Loader2 } from "lucide-react";
import { getPaymentsForUser } from "@/lib/api/auth.functions";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({
    meta: [
      { title: "Платежи — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentsPage,
});

type Payment = {
  id: string;
  amount_rub: number;
  status: string;
  provider: string;
  created_at: string;
};

function statusBadge(status: string) {
  if (status === "succeeded") return "text-emerald-300 bg-emerald-400/15";
  if (status === "pending") return "text-amber-300 bg-amber-400/15";
  return "text-muted-foreground bg-white/5";
}

function PaymentsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getPaymentsForUser().then(({ payments }) => {
      setItems(payments);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("dash.payments")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">История платежей</h1>
      </div>

      <div className="glass rounded-2xl">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Платежей пока нет.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {items.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                    <Receipt className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat("ru-RU").format(p.amount_rub)} ₽
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString("ru-RU")} · {p.provider}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadge(p.status)}`}>
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
