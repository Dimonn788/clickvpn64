import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext } from "react";
import { Toaster as Toaster$1 } from "sonner";
import { z } from "zod";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "./server-C_MOmld6.js";
const appCss = "/assets/styles-6AChvMSV.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const dict = {
  ru: {
    "nav.pricing": "Тарифы",
    "nav.features": "Возможности",
    "nav.faq": "FAQ",
    "nav.signin": "Войти",
    "nav.connect": "Подключиться",
    "nav.dashboard": "Кабинет",
    "nav.signout": "Выйти",
    "auth.title": "Вход по email и паролю",
    "auth.subtitle": "Введите email и пароль, чтобы войти в аккаунт",
    "auth.email": "Email",
    "auth.password": "Пароль",
    "auth.send": "Войти",
    "auth.error.generic": "Не удалось выполнить запрос",
    "dash.title": "Личный кабинет",
    "dash.overview": "Обзор",
    "dash.devices": "Устройства",
    "dash.payments": "Платежи",
    "dash.settings": "Настройки",
    "dash.subscription": "Подписка",
    "dash.subscription.none": "Активной подписки нет",
    "dash.subscription.choose": "Выберите тариф на главной",
    "dash.subscription.active": "Активна до",
    "dash.subscription.expired": "Истекла",
    "dash.subscription.pending": "Ожидает оплаты",
    "dash.key.title": "VPN-ключ",
    "dash.key.none": "Ключ появится после активации подписки",
    "dash.key.copy": "Скопировать",
    "dash.key.copied": "Скопировано",
    "dash.renew": "Продлить"
  },
  en: {
    "nav.pricing": "Pricing",
    "nav.features": "Features",
    "nav.faq": "FAQ",
    "nav.signin": "Sign in",
    "nav.connect": "Get started",
    "nav.dashboard": "Dashboard",
    "nav.signout": "Sign out",
    "auth.title": "Sign in with email and password",
    "auth.subtitle": "Enter your email and password to sign in",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.send": "Sign in",
    "auth.error.generic": "Request failed",
    "dash.title": "Dashboard",
    "dash.overview": "Overview",
    "dash.devices": "Devices",
    "dash.payments": "Payments",
    "dash.settings": "Settings",
    "dash.subscription": "Subscription",
    "dash.subscription.none": "No active subscription",
    "dash.subscription.choose": "Choose a plan on the homepage",
    "dash.subscription.active": "Active until",
    "dash.subscription.expired": "Expired",
    "dash.subscription.pending": "Awaiting payment",
    "dash.key.title": "VPN key",
    "dash.key.none": "The key will appear after activation",
    "dash.key.copy": "Copy",
    "dash.key.copied": "Copied",
    "dash.renew": "Renew"
  }
};
const I18nCtx = createContext({ locale: "ru", setLocale: () => {
}, t: (k) => k });
function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState("ru");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("locale");
    if (saved === "ru" || saved === "en") setLocaleState(saved);
  }, []);
  const setLocale = (l) => {
    setLocaleState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("locale", l);
  };
  const t = (k) => dict[locale][k] ?? k;
  return /* @__PURE__ */ jsx(I18nCtx.Provider, { value: { locale, setLocale, t }, children });
}
const useI18n = () => useContext(I18nCtx);
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$8 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ClickVPN" },
      { name: "description", content: "ClickVPN — современное веб-приложение для быстрого доступа и удобной подписки." },
      { name: "author", content: "ClickVPN" },
      { property: "og:title", content: "ClickVPN" },
      { property: "og:description", content: "ClickVPN — современное веб-приложение для быстрого доступа и удобной подписки." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@ClickVPN" },
      { name: "twitter:title", content: "ClickVPN" },
      { name: "twitter:description", content: "ClickVPN — современное веб-приложение для быстрого доступа и удобной подписки." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed47e593-f0f5-491b-9225-c7c7deda113f/id-preview-c899dec9--62923c4d-b6c9-441f-8358-a84b0e339eae.lovable.app-1780599554433.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed47e593-f0f5-491b-9225-c7c7deda113f/id-preview-c899dec9--62923c4d-b6c9-441f-8358-a84b0e339eae.lovable.app-1780599554433.png" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "ru", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$8.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(I18nProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$7 = () => import("./checkout-zi4ejkAh.js");
const search = z.object({
  plan: z.coerce.number().pipe(z.union([z.literal(1), z.literal(3), z.literal(6), z.literal(12)])).catch(6)
});
const Route$7 = createFileRoute("/checkout")({
  head: () => ({
    meta: [{
      title: "Оплата — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  validateSearch: search,
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./auth-Du-M-ezm.js");
const Route$6 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Вход — ClickVPN"
    }, {
      name: "description",
      content: "Вход в кабинет ClickVPN по email и паролю."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const login = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  email: z.string().email(),
  password: z.string().min(4)
})).handler(createSsrRpc("958e038a2d6f477fc04eb8dc9d6e74334419d2f284b951eca977b55a109e6f17"));
const getUserSession = createServerFn({
  method: "POST"
}).handler(createSsrRpc("d92fa43bbec247ecfb863954a5b34e07709e699aba9561587b24cb100141b832"));
const updateTelegram = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  telegramUsername: z.string().trim().optional()
})).handler(createSsrRpc("74da8b126c29b6fe84c0326fcb42633af810033f533e751d8ca23d58e528e62e"));
const createSubscriptionForUser = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  planMonths: z.number().int().positive(),
  vpnKey: z.string().min(1),
  startedAt: z.string(),
  expiresAt: z.string(),
  amountRub: z.number().int().nonnegative()
})).handler(createSsrRpc("b3f18c9e5613d09c1260d4b6f7e1e04b0c7814d4335dac6d61dd76120fde46aa"));
const getLatestSubscriptionForUser = createServerFn({
  method: "POST"
}).handler(createSsrRpc("ccbc9d0d2f895e51838758711c9a033ff6475debb52cdeb2e2de9a08c5276d3d"));
const getPaymentsForUser = createServerFn({
  method: "POST"
}).handler(createSsrRpc("40840fb9a02541f6ea9436e1a6a32d471ef3b9c157684a78c540d2a238c3440e"));
const getDevicesForUser = createServerFn({
  method: "POST"
}).handler(createSsrRpc("017232d6b07b332cf47198212a3708ae83968c96004fdf3ead93bbfaac003041"));
createServerFn({
  method: "POST"
}).inputValidator(z.object({
  name: z.string().min(1),
  platform: z.string().min(1)
})).handler(createSsrRpc("093c41180bc356b2e35e50742b826e37d745321915902ed9d1d7375198a69b66"));
const removeDevice = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  id: z.string().min(1)
})).handler(createSsrRpc("2164b8b07841e45bf57726f46b824a756c27ab4a6d81783275c19da66d8ac654"));
const $$splitComponentImporter$5 = () => import("./route-P9bHxE-n.js");
const Route$5 = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const result = await getUserSession();
    if (!result.user) throw redirect({
      to: "/auth"
    });
    return {
      user: result.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-XZT98yek.js");
const Route$4 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "ClickVPN — Свободный интернет без ограничений"
    }, {
      name: "description",
      content: "Один ключ для всех устройств. Простое подключение, высокая скорость, безлимитный трафик. Подписка от 109 ₽ в месяц."
    }, {
      property: "og:title",
      content: "ClickVPN — Свободный интернет без ограничений"
    }, {
      property: "og:description",
      content: "Один ключ для всех устройств. Подписка от 109 ₽ в месяц."
    }, {
      property: "og:type",
      content: "website"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./settings-CgCCnJs5.js");
const Route$3 = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [{
      title: "Настройки — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./payments-C4D9bSLL.js");
const Route$2 = createFileRoute("/_authenticated/payments")({
  head: () => ({
    meta: [{
      title: "Платежи — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./devices-3AguMY_m.js");
const Route$1 = createFileRoute("/_authenticated/devices")({
  head: () => ({
    meta: [{
      title: "Устройства — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./dashboard-DDyPP2bd.js");
const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{
      title: "Кабинет — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const CheckoutRoute = Route$7.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$8
});
const AuthRoute = Route$6.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$8
});
const AuthenticatedRouteRoute = Route$5.update({
  id: "/_authenticated",
  getParentRoute: () => Route$8
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const AuthenticatedSettingsRoute = Route$3.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPaymentsRoute = Route$2.update({
  id: "/payments",
  path: "/payments",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDevicesRoute = Route$1.update({
  id: "/devices",
  path: "/devices",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedRouteRouteChildren = {
  AuthenticatedDashboardRoute,
  AuthenticatedDevicesRoute,
  AuthenticatedPaymentsRoute,
  AuthenticatedSettingsRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute,
  CheckoutRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  updateTelegram as a,
  getPaymentsForUser as b,
  createSubscriptionForUser as c,
  getDevicesForUser as d,
  getLatestSubscriptionForUser as e,
  router as f,
  getUserSession as g,
  login as l,
  removeDevice as r,
  useI18n as u
};
