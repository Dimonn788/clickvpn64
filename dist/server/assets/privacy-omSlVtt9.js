import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
function PrivacyPage() {
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl space-y-6 px-4 py-12", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Политика конфиденциальности" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Мы уважаем вашу приватность. ClickVPN хранит минимальные данные: email для входа и записи подписок. Мы не передаём ваши данные третьим лицам без вашего согласия. Для вопросов — обратитесь в поддержку." }),
    /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "text-sm text-primary/90", children: "Вернуться на главную" }) })
  ] });
}
export {
  PrivacyPage as component
};
