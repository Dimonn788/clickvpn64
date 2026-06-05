import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "ru" | "en";

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
    "dash.renew": "Продлить",
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
    "dash.renew": "Renew",
  },
} as const;

export type TKey = keyof (typeof dict)["ru"];

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (k: TKey) => string };
const I18nCtx = createContext<Ctx>({ locale: "ru", setLocale: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "ru" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("locale", l);
  };

  const t = (k: TKey) => dict[locale][k] ?? k;
  return <I18nCtx.Provider value={{ locale, setLocale, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
