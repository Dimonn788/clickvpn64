import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Smartphone, Laptop, Tv, Tablet, Trash2, Loader2 } from "lucide-react";
import { getDevicesForUser, removeDevice as removeDeviceFromUser } from "@/lib/api/auth.functions";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/devices")({
  head: () => ({
    meta: [
      { title: "Устройства — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DevicesPage,
});

type Device = {
  id: string;
  name: string;
  platform: string;
  last_seen_at: string | null;
  created_at: string;
};

const PLATFORMS = [
  { id: "ios", label: "iOS", icon: Smartphone },
  { id: "android", label: "Android", icon: Smartphone },
  { id: "macos", label: "macOS", icon: Laptop },
  { id: "windows", label: "Windows", icon: Laptop },
  { id: "tv", label: "TV", icon: Tv },
  { id: "tablet", label: "Tablet", icon: Tablet },
];

function platformIcon(p: string) {
  return PLATFORMS.find((x) => x.id === p)?.icon ?? Smartphone;
}

function DevicesPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) return;
    setLoading(true);
    const { devices } = await getDevicesForUser();
    setDevices(devices);
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  async function removeDevice(id: string) {
    await removeDeviceFromUser({ data: { id } });
    setDevices((d) => d.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("dash.devices")}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Ваши устройства</h1>
          <p className="mt-1 text-xs text-muted-foreground">До 5 устройств одновременно по одному ключу.</p>
        </div>
      </div>

      <div className="glass rounded-2xl">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : devices.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            У вас ещё нет устройств.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {devices.map((d) => {
              const Icon = platformIcon(d.platform);
              return (
                <li key={d.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {PLATFORMS.find((p) => p.id === d.platform)?.label ?? d.platform} ·{" "}
                        добавлено {new Date(d.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDevice(d.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Отвязать
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
