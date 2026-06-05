import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, KeyRound, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { u as useI18n, e as getLatestSubscriptionForUser } from "./router-D5xPz8bV.js";
import { u as useAuth } from "./use-auth-CZ6S1gGb.js";
import "@tanstack/react-query";
import "zod";
import "./server-0JC-SxFr.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./auth-client-wqRgA7mG.js";
function Overview() {
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
  const [sub, setSub] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!user) return;
    getLatestSubscriptionForUser().then(({
      subscription
    }) => {
      setSub(subscription);
      setLoaded(true);
    });
  }, [user]);
  async function copyKey() {
    if (!sub?.vpn_key) return;
    async function fallbackCopy(text) {
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
  const statusLabel = sub ? sub.status === "active" ? `${t("dash.subscription.active")} ${sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : ""}` : sub.status === "pending" ? t("dash.subscription.pending") : t("dash.subscription.expired") : t("dash.subscription.none");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: t("dash.overview") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl", children: t("dash.subscription") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium text-muted-foreground", children: t("dash.subscription") }),
          sub?.status === "active" && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300", children: "active" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-xl font-semibold tracking-tight", children: statusLabel }),
        !sub && loaded && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: t("dash.subscription.choose") }),
        /* @__PURE__ */ jsxs(Link, { to: "/checkout", search: {
          plan: 6
        }, className: "btn-primary mt-5 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium", children: [
          sub?.status === "active" ? t("dash.renew") : "Оформить",
          /* @__PURE__ */ jsx(ArrowRight, { className: "size-3.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(KeyRound, { className: "size-4 text-primary" }),
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium text-muted-foreground", children: t("dash.key.title") })
        ] }),
        sub?.vpn_key ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("code", { className: "mt-3 block max-h-32 overflow-auto break-all rounded-xl border border-white/10 bg-background/40 px-3 py-2.5 font-mono text-xs", children: sub.vpn_key }),
          /* @__PURE__ */ jsxs("button", { onClick: copyKey, disabled: !sub?.vpn_key, className: "mt-4 inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60", children: [
            copied ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3.5" }),
            copied ? t("dash.key.copied") : t("dash.key.copy")
          ] })
        ] }) : /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: t("dash.key.none") })
      ] })
    ] })
  ] });
}
export {
  Overview as component
};
