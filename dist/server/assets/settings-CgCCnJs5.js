import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Mail, Send, Loader2, Check } from "lucide-react";
import { u as useI18n, g as getUserSession, a as updateTelegram } from "./router-CE46XRWC.js";
import { u as useAuth } from "./use-auth-AHBDJqJ0.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
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
function SettingsPage() {
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
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
  async function save(e) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    await updateTelegram({
      data: {
        telegramUsername: tg.trim().replace(/^@/, "") || void 0
      }
    });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: t("dash.settings") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl", children: "Настройки аккаунта" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Mail, { className: "size-4" }),
        "Email"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 font-medium", children: user?.email ?? "—" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Используется для входа по email и паролю." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Send, { className: "size-4" }),
        "Telegram"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Привяжите username, чтобы получать уведомления о подписке и продлении." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground", children: "@" }),
          /* @__PURE__ */ jsx("input", { value: tg, onChange: (e) => setTg(e.target.value), placeholder: "username", className: "w-full rounded-xl border border-white/10 bg-background/40 py-2.5 pl-7 pr-3.5 text-sm outline-none transition focus:border-primary/60" })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-60", children: [
          busy ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }) : saved ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : null,
          saved ? "Сохранено" : "Сохранить"
        ] })
      ] })
    ] })
  ] });
}
export {
  SettingsPage as component
};
