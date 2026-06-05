import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, useLocation, Link, Outlet } from "@tanstack/react-router";
import { LayoutGrid, Smartphone, Receipt, Settings, Shield, LogOut } from "lucide-react";
import { a as authClient } from "./auth-client-wqRgA7mG.js";
import { u as useI18n } from "./router-D5xPz8bV.js";
import "@tanstack/react-query";
import "react";
import "sonner";
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
function DashboardLayout() {
  const {
    t
  } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = [{
    to: "/dashboard",
    icon: LayoutGrid,
    label: t("dash.overview")
  }, {
    to: "/devices",
    icon: Smartphone,
    label: t("dash.devices")
  }, {
    to: "/payments",
    icon: Receipt,
    label: t("dash.payments")
  }, {
    to: "/settings",
    icon: Settings,
    label: t("dash.settings")
  }];
  async function signOut() {
    authClient.clearToken();
    navigate({
      to: "/"
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 -z-0 h-[400px] bg-aurora opacity-30", "aria-hidden": true }),
    /* @__PURE__ */ jsx("div", { className: "relative mx-auto max-w-6xl px-4 pt-6", children: /* @__PURE__ */ jsxs("div", { className: "glass flex items-center justify-between rounded-2xl px-4 py-2.5", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary", children: /* @__PURE__ */ jsx(Shield, { className: "size-3.5 text-primary-foreground", strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "ClickVPN" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: signOut, className: "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "size-3.5" }),
        t("nav.signout")
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr]", children: [
      /* @__PURE__ */ jsx("aside", { className: "glass h-fit rounded-2xl p-2", children: /* @__PURE__ */ jsx("nav", { className: "flex flex-row gap-1 md:flex-col", children: nav.map((item) => {
        const active = location.pathname === item.to;
        const Icon = item.icon;
        return /* @__PURE__ */ jsxs(Link, { to: item.to, className: ["flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition md:flex-none", active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"].join(" "), children: [
          /* @__PURE__ */ jsx(Icon, { className: "size-4" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: item.label })
        ] }, item.to);
      }) }) }),
      /* @__PURE__ */ jsx("main", { className: "min-w-0", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  DashboardLayout as component
};
