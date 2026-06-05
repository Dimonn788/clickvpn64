import { jsxs, jsx } from "react/jsx-runtime";
import { useSearch, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Shield, Check, Loader2, CreditCard } from "lucide-react";
import { c as createSubscriptionForUser } from "./router-CE46XRWC.js";
import { u as useAuth } from "./use-auth-AHBDJqJ0.js";
import "@tanstack/react-query";
import "sonner";
import "zod";
import "./server-C_MOmld6.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./auth-client-wqRgA7mG.js";
const PLANS = {
  1: {
    months: 1,
    price: 109,
    label: "1 месяц"
  },
  3: {
    months: 3,
    price: 299,
    label: "3 месяца"
  },
  6: {
    months: 6,
    price: 589,
    label: "6 месяцев"
  },
  12: {
    months: 12,
    price: 1099,
    label: "12 месяцев"
  }
};
function randomKey() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const b64 = btoa(String.fromCharCode(...bytes)).replace(/=/g, "");
  return `vless://${b64}@clickvpn.app:443?security=tls&type=tcp#ClickVPN`;
}
function CheckoutPage() {
  const {
    plan
  } = useSearch({
    from: "/checkout"
  });
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const months = plan;
  const p = PLANS[months];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  async function pay() {
    if (!user) {
      navigate({
        to: "/auth"
      });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const now = /* @__PURE__ */ new Date();
      const expires = new Date(now);
      expires.setMonth(expires.getMonth() + p.months);
      await createSubscriptionForUser({
        data: {
          planMonths: p.months,
          vpnKey: randomKey(),
          startedAt: now.toISOString(),
          expiresAt: expires.toISOString(),
          amountRub: p.price
        }
      });
      navigate({
        to: "/dashboard"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось обработать платёж");
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 -z-0 h-[500px] bg-aurora opacity-50", "aria-hidden": true }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-2xl px-4 py-12", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", hash: "pricing", className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }),
        " К тарифам"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary", children: /* @__PURE__ */ jsx(Shield, { className: "size-3.5 text-primary-foreground", strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "ClickVPN" }),
        /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300", children: "test mode" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-3xl font-semibold tracking-tight sm:text-4xl", children: "Оплата подписки" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Тестовая оплата — деньги не списываются." }),
      /* @__PURE__ */ jsxs("div", { className: "glass-strong mt-8 rounded-3xl p-6 sm:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Тариф" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: p.label })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: loading ? "…" : user?.email ?? "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between border-t border-white/5 pt-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "К оплате" }),
          /* @__PURE__ */ jsxs("span", { className: "text-2xl font-semibold tracking-tight", children: [
            new Intl.NumberFormat("ru-RU").format(p.price),
            " ₽"
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-2 text-sm text-muted-foreground", children: ["До 5 устройств", "Безлимитный трафик", "7 локаций", "Поддержка 24/7"].map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-4 place-items-center rounded-full bg-primary/15", children: /* @__PURE__ */ jsx(Check, { className: "size-2.5 text-primary", strokeWidth: 3 }) }),
          f
        ] }, f)) }),
        error && /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive", children: error }),
        /* @__PURE__ */ jsxs("button", { onClick: pay, disabled: busy || loading, className: "btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium disabled:opacity-60", children: [
          busy ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(CreditCard, { className: "size-4" }),
          busy ? "Обработка…" : "Оплатить"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-[11px] text-muted-foreground", children: "Нажимая «Оплатить», вы соглашаетесь с условиями сервиса." })
      ] })
    ] })
  ] });
}
export {
  CheckoutPage as component
};
