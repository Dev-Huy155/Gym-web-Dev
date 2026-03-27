import { useEffect, useMemo, useState } from "react";
import { Bell, Pin } from "lucide-react";
import { getAnnouncements, type BroadcastAnnouncement } from "../lib/storage";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Announcements() {
  const [announcements, setAnnouncements] = useState<BroadcastAnnouncement[]>([]);

  useEffect(() => {
    const loadAnnouncements = () => {
      const nextItems = getAnnouncements().filter(
        (item) => item.active && (item.audience === "public" || item.audience === "all"),
      );
      setAnnouncements(nextItems);
    };

    loadAnnouncements();

    const intervalId = window.setInterval(loadAnnouncements, 3000);
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === "elite_fitness_announcements") {
        loadAnnouncements();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const visibleAnnouncements = useMemo(
    () =>
      [...announcements]
        .sort((left, right) => Number(right.pinned) - Number(left.pinned))
        .slice(0, 4),
    [announcements],
  );

  return (
    <section id="announcements" className="bg-zinc-950 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 text-sm text-red-300">
              <Bell className="h-4 w-4" />
              Thong bao moi nhat
            </p>
            <h2 className="text-3xl text-white md:text-4xl">Cap nhat lich va dat cho</h2>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400 md:text-base">
              Admin co the dua thong bao len day de nguoi dung, huan luyen vien va nhan vien
              theo doi thay doi lich, phong tap va cac dieu chinh quan trong.
            </p>
          </div>
          <a
            href="/portal"
            className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-red-500/40 hover:bg-red-500/10 md:inline-flex"
          >
            Mo portal nhan su
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {visibleAnnouncements.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg text-white">{item.title}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {item.audience === "public" ? "Nguoi dung" : "Toan he thong"}
                    </p>
                  </div>
                </div>
                {item.pinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-300">
                    <Pin className="h-3.5 w-3.5" />
                    Ghim
                  </span>
                )}
              </div>
              <p className="text-sm leading-7 text-zinc-300">{item.content}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
                <span>{item.createdBy}</span>
                <span>{formatDateTime(item.updatedAt)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
