import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Shield,
  Zap,
  Smartphone,
  Infinity as InfinityIcon,
  Globe2,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClickVPN — Свободный интернет без ограничений" },
      {
        name: "description",
        content:
          "Один ключ для всех устройств. Простое подключение, высокая скорость, безлимитный трафик. Подписка от 109 ₽ в месяц.",
      },
      { property: "og:title", content: "ClickVPN — Свободный интернет без ограничений" },
      {
        property: "og:description",
        content: "Один ключ для всех устройств. Подписка от 109 ₽ в месяц.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

const MONTHLY_BASE = 109;

type Plan = {
  months: 1 | 3 | 6 | 12;
  price: number;
  label: string;
  badge?: string;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  { months: 1, price: 109, label: "1 месяц" },
  { months: 3, price: 299, label: "3 месяца" },
  { months: 6, price: 589, label: "6 месяцев", badge: "Выгодно", highlight: true },
  { months: 12, price: 1099, label: "12 месяцев", badge: "Популярный выбор" },
];

const ADVANTAGES = [
  { icon: Smartphone, title: "До 5 устройств", text: "Один ключ — телефон, ноутбук, планшет и ТВ одновременно." },
  { icon: Zap, title: "Высокая скорость", text: "Стабильное соединение и быстрый доступ к сервисам." },
  { icon: InfinityIcon, title: "Безлимитный трафик", text: "Без ограничений на объём и скорость передачи." },
  { icon: Shield, title: "Поддержка 24/7", text: "Помогаем разобраться в любое время суток." },
  { icon: MessageCircle, title: "Telegram-уведомления", text: "Статус подписки и продления — прямо в Telegram." },
  { icon: Globe2, title: "7 серверных локаций", text: "Гибкий выбор страны для надёжной работы." },
];

const FAQ = [
  {
    q: "Как подключиться?",
    a: "После оплаты в личном кабинете появится VPN-ключ. Скопируйте его и вставьте в приложение — подключение займёт меньше минуты.",
  },
  {
    q: "Как продлить подписку?",
    a: "В разделе «Обзор» нажмите «Продлить» и выберите удобный тариф. Срок действия добавится к текущему.",
  },
  {
    q: "Сколько устройств поддерживается?",
    a: "До 5 устройств одновременно по одному ключу. Управлять списком можно в разделе «Устройства».",
  },
  {
    q: "Как отвязать устройство?",
    a: "В разделе «Устройства» нажмите «Отвязать» рядом с нужным устройством. Доступ для него сразу прекращается.",
  },
  {
    q: "Какие способы оплаты доступны?",
    a: "СБП, банковские карты и криптовалюта через защищённую платформу Platega.",
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Pricing />
      <Advantages />
      <Faq />
      <Footer />
    </div>
  );
}

function Header() {
  const { t, locale, setLocale } = useI18n();
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-sm font-semibold tracking-tight">ClickVPN</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#pricing" className="transition hover:text-foreground">{t("nav.pricing")}</a>
            <a href="#features" className="transition hover:text-foreground">{t("nav.features")}</a>
            <a href="#faq" className="transition hover:text-foreground">{t("nav.faq")}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === "ru" ? "en" : "ru")}
              className="hidden rounded-lg px-2 py-1 text-xs uppercase tracking-wider text-muted-foreground transition hover:text-foreground sm:inline-flex"
              aria-label="Language"
            >
              {locale === "ru" ? "EN" : "RU"}
            </button>
            {user ? (
              <Link
                to="/dashboard"
                className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium"
              >
                {t("nav.dashboard")}
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="hidden rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
                >
                  {t("nav.signin")}
                </Link>
                <Link
                  to="/auth"
                  className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium"
                >
                  {t("nav.connect")}
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="relative grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary">
      <Shield className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[600px] bg-aurora opacity-70" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-24 sm:pt-32 sm:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="glass mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Новое поколение VPN — без настроек
          </div>

          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <span className="gradient-text">Свободный интернет</span>
            <br />
            без ограничений
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Один ключ для всех устройств. Простое подключение. Высокая скорость. Без лишних настроек.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#pricing"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
            >
              Подключиться
              <ArrowRight className="size-4" />
            </a>
            <Link
              to="/auth"
              className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-foreground/90 transition hover:text-foreground"
            >
              Войти в кабинет
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <Pill>До 5 устройств</Pill>
            <Pill>Безлимитный трафик</Pill>
            <Pill>7 локаций</Pill>
            <Pill>Оплата по СБП / картой / криптовалютой</Pill>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-1 rounded-full bg-primary/80" />
      {children}
    </span>
  );
}

function Pricing() {
  const [selected, setSelected] = useState<Plan["months"]>(6);
  const selectedPlan = useMemo(() => PLANS.find((p) => p.months === selected)!, [selected]);

  const regular = selectedPlan.months * MONTHLY_BASE;
  const savings = regular - selectedPlan.price;

  return (
    <section id="pricing" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Простые тарифы</h2>
          <p className="mt-4 text-muted-foreground">
            Чем длиннее подписка — тем выгоднее. Без скрытых платежей и автопродлений.
          </p>
        </div>

        {/* Switch */}
        <div className="mt-10 flex justify-center">
          <div className="glass inline-flex rounded-2xl p-1">
            {PLANS.map((p) => {
              const active = p.months === selected;
              return (
                <button
                  key={p.months}
                  onClick={() => setSelected(p.months)}
                  className={[
                    "relative rounded-xl px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-gradient-to-br from-white to-[oklch(0.78_0_0)] text-primary-foreground shadow-[0_8px_24px_-8px_oklch(1_0_0/0.3)]"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured card */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 size-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedPlan.badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <Sparkles className="size-3" />
                      {selectedPlan.badge}
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                      Экономия {formatPrice(savings)}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight">{selectedPlan.label}</h3>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-5xl font-semibold tracking-tight">{formatPrice(selectedPlan.price)}</span>
                  {savings > 0 && (
                    <span className="text-base text-muted-foreground line-through">{formatPrice(regular)}</span>
                  )}
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  ≈ {formatPrice(Math.round(selectedPlan.price / selectedPlan.months))} в месяц
                </p>

                <ul className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  {["До 5 устройств", "Безлимитный трафик", "7 локаций", "Поддержка 24/7"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="grid size-4 place-items-center rounded-full bg-primary/15">
                        <Check className="size-2.5 text-primary" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/checkout"
                search={{ plan: selectedPlan.months }}
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium sm:min-w-[180px]"
              >
                Оформить
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function Advantages() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Всё, что нужно</h2>
          <p className="mt-4 text-muted-foreground">
            Минимум настроек, максимум пользы. Подключайтесь в один клик и пользуйтесь интернетом без ограничений.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition hover:border-foreground/15 hover:bg-card/70"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <div className="relative grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <Icon className="size-5" strokeWidth={2} />
              </div>
              <h3 className="relative mt-5 text-base font-semibold tracking-tight">{title}</h3>
              <p className="relative mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Частые вопросы</h2>
          <p className="mt-4 text-muted-foreground">Коротко и по делу.</p>
        </div>

        <div className="mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <button
                key={item.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="block w-full px-6 py-5 text-left transition hover:bg-card/70"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition ${isOpen ? "rotate-180 text-foreground" : ""}`}
                  />
                </div>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden text-sm text-muted-foreground">{item.a}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border border-border glass-strong p-8 text-center sm:p-12">
          <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Готовы начать прямо сейчас?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Оформите подписку за минуту — ключ появится в личном кабинете сразу после оплаты.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#pricing"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
            >
              Подключиться
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-medium text-foreground/80">ClickVPN</span>
          <span className="opacity-60">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="transition hover:text-foreground">Условия</a>
          <a href="#" className="transition hover:text-foreground">Политика</a>
          <a href="#" className="transition hover:text-foreground">Поддержка</a>
        </div>
      </div>
    </footer>
  );
}
