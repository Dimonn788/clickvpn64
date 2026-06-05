import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  addDeviceForUser,
  createSubscription,
  getDevicesByUser,
  getLatestSubscription,
  getPaymentsByUser,
  getUserFromRequest,
  requireAuthenticatedUser,
  signInOrRegister,
  updateTelegramUsername,
} from "@/integrations/auth/auth.server";

export type AuthUser = {
  id: string;
  email: string;
  telegram_username: string | null;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_months: number;
  status: string;
  vpn_key: string | null;
  started_at: string;
  expires_at: string;
  created_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  subscription_id: string;
  amount_rub: number;
  status: string;
  provider: string;
  created_at: string;
};

export type Device = {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  last_seen_at: string | null;
  created_at: string;
};

export const login = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      password: z.string().min(4),
    }),
  )
  .handler(async ({ data }) => {
    const { user, token } = signInOrRegister(data.email, data.password);
    return { user, token };
  });

export const getUserSession = createServerFn({ method: "POST" }).handler(
  async () => {
    const user = getUserFromRequest();
    return { user };
  },
);

export const updateTelegram = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      telegramUsername: z.string().trim().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const user = requireAuthenticatedUser();
    updateTelegramUsername(user.id, data.telegramUsername ?? null);
    return { user: getUserFromRequest() };
  });

export const createSubscriptionForUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      planMonths: z.number().int().positive(),
      vpnKey: z.string().min(1),
      startedAt: z.string(),
      expiresAt: z.string(),
      amountRub: z.number().int().nonnegative(),
    }),
  )
  .handler(async ({ data }) => {
    const user = requireAuthenticatedUser();
    const subscription = createSubscription(
      user.id,
      data.planMonths,
      data.vpnKey,
      data.startedAt,
      data.expiresAt,
      data.amountRub,
    );
    return { subscription };
  });

export const getLatestSubscriptionForUser = createServerFn({ method: "POST" }).handler(
  async () => {
    const user = requireAuthenticatedUser();
    return { subscription: getLatestSubscription(user.id) ?? null };
  },
);

export const getPaymentsForUser = createServerFn({ method: "POST" }).handler(async () => {
  const user = requireAuthenticatedUser();
  return { payments: getPaymentsByUser(user.id) };
});

export const getDevicesForUser = createServerFn({ method: "POST" }).handler(async () => {
  const user = requireAuthenticatedUser();
  return { devices: getDevicesByUser(user.id) };
});

export const addDevice = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      platform: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const user = requireAuthenticatedUser();
    const device = addDeviceForUser(user.id, data.name, data.platform);
    return { device };
  });

export const removeDevice = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = requireAuthenticatedUser();
    removeDeviceForUser(user.id, data.id);
    return { success: true };
  });
