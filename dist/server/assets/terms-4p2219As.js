import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
function TermsPage() {
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl space-y-6 px-4 py-12", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Условия использования" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Добро пожаловать в ClickVPN. Пользуясь сервисом, вы соглашаетесь с простыми и честными правилами: использовать сервис законно, не пытаться обходить платный доступ и не публиковать чужие данные. Это упрощённая страница — для полного текста политики обратитесь в поддержку." }),
    /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "text-sm text-primary/90", children: "Вернуться на главную" }) })
  ] });
}
export {
  TermsPage as component
};
