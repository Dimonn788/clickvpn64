import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowRight, Sparkles, Check, Smartphone, Zap, Infinity, Shield, MessageCircle, Globe2, ChevronDown } from "lucide-react";
import { u as useAuth } from "./use-auth-AHBDJqJ0.js";
import { u as useI18n } from "./router-CE46XRWC.js";
import "./auth-client-wqRgA7mG.js";
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
const MONTHLY_BASE = 109;
const PLANS = [{
  months: 1,
  price: 109,
  label: "1 месяц"
}, {
  months: 3,
  price: 299,
  label: "3 месяца"
}, {
  months: 6,
  price: 589,
  label: "6 месяцев",
  badge: "Выгодно",
  highlight: true
}, {
  months: 12,
  price: 1099,
  label: "12 месяцев",
  badge: "Популярный выбор"
}];
const ADVANTAGES = [{
  icon: Smartphone,
  title: "До 5 устройств",
  text: "Один ключ — телефон, ноутбук, планшет и ТВ одновременно."
}, {
  icon: Zap,
  title: "Высокая скорость",
  text: "Стабильное соединение и быстрый доступ к сервисам."
}, {
  icon: Infinity,
  title: "Безлимитный трафик",
  text: "Без ограничений на объём и скорость передачи."
}, {
  icon: Shield,
  title: "Поддержка 24/7",
  text: "Помогаем разобраться в любое время суток."
}, {
  icon: MessageCircle,
  title: "Telegram-уведомления",
  text: "Статус подписки и продления — прямо в Telegram."
}, {
  icon: Globe2,
  title: "7 серверных локаций",
  text: "Гибкий выбор страны для надёжной работы."
}];
const FAQ = [{
  q: "Как подключиться?",
  a: "После оплаты в личном кабинете появится VPN-ключ. Скопируйте его и вставьте в приложение — подключение займёт меньше минуты."
}, {
  q: "Как продлить подписку?",
  a: "В разделе «Обзор» нажмите «Продлить» и выберите удобный тариф. Срок действия добавится к текущему."
}, {
  q: "Сколько устройств поддерживается?",
  a: "До 5 устройств одновременно по одному ключу. Управлять списком можно в разделе «Устройства»."
}, {
  q: "Как отвязать устройство?",
  a: "В разделе «Устройства» нажмите «Отвязать» рядом с нужным устройством. Доступ для него сразу прекращается."
}, {
  q: "Какие способы оплаты доступны?",
  a: "СБП, банковские карты и криптовалюта через защищённую платформу Platega."
}];
function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}
function LandingPage() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Pricing, {}),
    /* @__PURE__ */ jsx(Advantages, {}),
    /* @__PURE__ */ jsx(Faq, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function Header() {
  const {
    t,
    locale,
    setLocale
  } = useI18n();
  const {
    user
  } = useAuth();
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl px-4 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "glass flex items-center justify-between rounded-2xl px-4 py-2.5", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Logo, {}),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "ClickVPN" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-7 text-sm text-muted-foreground md:flex", children: [
      /* @__PURE__ */ jsx("a", { href: "#pricing", className: "transition hover:text-foreground", children: t("nav.pricing") }),
      /* @__PURE__ */ jsx("a", { href: "#features", className: "transition hover:text-foreground", children: t("nav.features") }),
      /* @__PURE__ */ jsx("a", { href: "#faq", className: "transition hover:text-foreground", children: t("nav.faq") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => setLocale(locale === "ru" ? "en" : "ru"), className: "hidden rounded-lg px-2 py-1 text-xs uppercase tracking-wider text-muted-foreground transition hover:text-foreground sm:inline-flex", "aria-label": "Language", children: locale === "ru" ? "EN" : "RU" }),
      user ? /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium", children: [
        t("nav.dashboard"),
        /* @__PURE__ */ jsx(ArrowRight, { className: "size-3.5" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Link, { to: "/auth", className: "hidden rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex", children: t("nav.signin") }),
        /* @__PURE__ */ jsxs(Link, { to: "/auth", className: "btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium", children: [
          t("nav.connect"),
          /* @__PURE__ */ jsx(ArrowRight, { className: "size-3.5" })
        ] })
      ] })
    ] })
  ] }) }) });
}
function Logo() {
  return /* @__PURE__ */ jsx("div", { className: "relative grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary", children: /* @__PURE__ */ jsx(Shield, { className: "size-3.5 text-primary-foreground", strokeWidth: 2.5 }) });
}
function Hero() {
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-grid", "aria-hidden": true }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 -z-0 h-[600px] bg-aurora opacity-70", "aria-hidden": true }),
    /* @__PURE__ */ jsx("div", { className: "relative mx-auto max-w-6xl px-4 pt-24 pb-24 sm:pt-32 sm:pb-32", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "size-3.5 text-primary" }),
        "Новое поколение VPN — без настроек"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl", children: [
        /* @__PURE__ */ jsx("span", { className: "gradient-text", children: "Свободный интернет" }),
        /* @__PURE__ */ jsx("br", {}),
        "без ограничений"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg", children: "Один ключ для всех устройств. Простое подключение. Высокая скорость. Без лишних настроек." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxs("a", { href: "#pricing", className: "btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium", children: [
          "Подключиться",
          /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/auth", className: "glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-foreground/90 transition hover:text-foreground", children: "Войти в кабинет" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Pill, { children: "До 5 устройств" }),
        /* @__PURE__ */ jsx(Pill, { children: "Безлимитный трафик" }),
        /* @__PURE__ */ jsx(Pill, { children: "7 локаций" }),
        /* @__PURE__ */ jsx(Pill, { children: "Оплата по СБП / картой / криптовалютой" })
      ] })
    ] }) })
  ] });
}
function Pill({
  children
}) {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: "size-1 rounded-full bg-primary/80" }),
    children
  ] });
}
function Pricing() {
  const [selected, setSelected] = useState(6);
  const selectedPlan = useMemo(() => PLANS.find((p) => p.months === selected), [selected]);
  const regular = selectedPlan.months * MONTHLY_BASE;
  const savings = regular - selectedPlan.price;
  return /* @__PURE__ */ jsx("section", { id: "pricing", className: "relative scroll-mt-24 py-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-balance text-4xl font-semibold tracking-tight sm:text-5xl", children: "Простые тарифы" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: "Чем длиннее подписка — тем выгоднее. Без скрытых платежей и автопродлений." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "glass inline-flex rounded-2xl p-1", children: PLANS.map((p) => {
      const active = p.months === selected;
      return /* @__PURE__ */ jsx("button", { onClick: () => setSelected(p.months), className: ["relative rounded-xl px-4 py-2 text-sm font-medium transition", active ? "bg-gradient-to-br from-white to-[oklch(0.78_0_0)] text-primary-foreground shadow-[0_8px_24px_-8px_oklch(1_0_0/0.3)]" : "text-muted-foreground hover:text-foreground"].join(" "), children: p.label }, p.months);
    }) }) }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto mt-10 max-w-3xl", children: /* @__PURE__ */ jsxs("div", { className: "glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -left-16 bottom-0 size-56 rounded-full bg-white/10 blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            selectedPlan.badge && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "size-3" }),
              selectedPlan.badge
            ] }),
            savings > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300", children: [
              "Экономия ",
              formatPrice(savings)
            ] })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "mt-4 text-2xl font-semibold tracking-tight", children: selectedPlan.label }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-baseline gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xl font-semibold tracking-tight", children: formatPrice(selectedPlan.price) }),
            savings > 0 && /* @__PURE__ */ jsx("span", { className: "text-base text-muted-foreground line-through", children: formatPrice(regular) })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
            "≈ ",
            formatPrice(Math.round(selectedPlan.price / selectedPlan.months)),
            " в месяц"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2", children: ["До 5 устройств", "Безлимитный трафик", "7 локаций", "Поддержка 24/7"].map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "grid size-4 place-items-center rounded-full bg-primary/15", children: /* @__PURE__ */ jsx(Check, { className: "size-2.5 text-primary", strokeWidth: 3 }) }),
            f
          ] }, f)) })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/checkout", search: {
          plan: selectedPlan.months
        }, className: "btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium sm:min-w-[180px]", children: [
          "Оформить",
          /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
        ] })
      ] })
    ] }) })
  ] }) });
}
function Advantages() {
  return /* @__PURE__ */ jsx("section", { id: "features", className: "relative scroll-mt-24 py-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-balance text-4xl font-semibold tracking-tight sm:text-5xl", children: "Всё, что нужно" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: "Минимум настроек, максимум пользы. Подключайтесь в один клик и пользуйтесь интернетом без ограничений." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: ADVANTAGES.map(({
      icon: Icon,
      title,
      text
    }) => /* @__PURE__ */ jsxs("div", { className: "group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition hover:border-foreground/15 hover:bg-card/70", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition group-hover:opacity-100" }),
      /* @__PURE__ */ jsx("div", { className: "relative grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20", children: /* @__PURE__ */ jsx(Icon, { className: "size-5", strokeWidth: 2 }) }),
      /* @__PURE__ */ jsx("h3", { className: "relative mt-5 text-base font-semibold tracking-tight", children: title }),
      /* @__PURE__ */ jsx("p", { className: "relative mt-1.5 text-sm text-muted-foreground", children: text })
    ] }, title)) })
  ] }) });
}
function Faq() {
  const [open, setOpen] = useState(0);
  return /* @__PURE__ */ jsx("section", { id: "faq", className: "relative scroll-mt-24 py-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-balance text-4xl font-semibold tracking-tight sm:text-5xl", children: "Частые вопросы" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: "Коротко и по делу." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40", children: FAQ.map((item, i) => {
      const isOpen = open === i;
      return /* @__PURE__ */ jsxs("button", { onClick: () => setOpen(isOpen ? null : i), className: "block w-full px-6 py-5 text-left transition hover:bg-card/70", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium sm:text-base", children: item.q }),
          /* @__PURE__ */ jsx(ChevronDown, { className: `size-4 text-muted-foreground transition ${isOpen ? "rotate-180 text-foreground" : ""}` })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `grid transition-all duration-300 ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`, children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden text-sm text-muted-foreground", children: item.a }) })
      ] }, item.q);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-16 overflow-hidden rounded-3xl border border-border glass-strong p-8 text-center sm:p-12", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-balance text-2xl font-semibold tracking-tight sm:text-3xl", children: "Готовы начать прямо сейчас?" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-3 max-w-md text-sm text-muted-foreground", children: "Оформите подписку за минуту — ключ появится в личном кабинете сразу после оплаты." }),
      /* @__PURE__ */ jsx("div", { className: "mt-7 flex flex-wrap items-center justify-center gap-3", children: /* @__PURE__ */ jsxs("a", { href: "#pricing", className: "btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium", children: [
        "Подключиться",
        /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
      ] }) })
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-border/70 py-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Logo, {}),
      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground/80", children: "ClickVPN" }),
      /* @__PURE__ */ jsxs("span", { className: "opacity-60", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear()
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsx("a", { href: "#", className: "transition hover:text-foreground", children: "Условия" }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "transition hover:text-foreground", children: "Политика" }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "transition hover:text-foreground", children: "Поддержка" })
    ] })
  ] }) });
}
export {
  LandingPage as component
};
