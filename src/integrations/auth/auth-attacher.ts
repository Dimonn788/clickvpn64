import { createMiddleware } from "@tanstack/react-start";
import { authClient } from "./auth-client";

export const attachAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const token = authClient.getToken();
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
