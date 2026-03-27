import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Bell, CalendarDays, DoorOpen, LogOut, Megaphone } from "lucide-react";
import {
  getAnnouncements,
  getPortalSession,
  getRoomBookings,
  getStaffSchedules,
  loginAdminAccount,
  pushAdminNotification,
  saveRoomBooking,
  saveStaffSchedule,
  setPortalSession,
  type AccountRole,
  type BroadcastAnnouncement,
  type RoomBookingRecord,
  type StaffScheduleRecord,
  type UserSession,
} from "../lib/storage";

const PORTAL_ROLES: AccountRole[] = ["staff", "trainer", "manager", "admin", "super_admin"];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(value: string) {
  switch (value) {
    case "approved":
      return "Da duyet";
    case "updated":
      return "Da cap nhat";
    case "cancelled":
      return "Da huy";
    case "rejected":
      return "Tu choi";
    default:
      return "Cho duyet";
  }
}

function statusClass(value: string) {
  switch (value) {
    case "approved":
      return "bg-emerald-500/15 text-emerald-300";
    case "updated":
      return "bg-blue-500/15 text-blue-300";
    case "cancelled":
    case "rejected":
      return "bg-rose-500/15 text-rose-300";
    default:
      return "bg-amber-500/15 text-amber-300";
  }
}

const defaultScheduleForm = {
  department: "Training",
  scheduleDate: "",
  shiftLabel: "Ca sang",
  startTime: "06:00",
  endTime: "10:00",
  notes: "",
};

const defaultRoomForm = {
  roomName: "Phong Yoga",
  bookingDate: "",
  startTime: "09:00",
  endTime: "10:00",
  attendees: "10",
  purpose: "",
};

export default function StaffPortal() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => getPortalSession());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [scheduleForm, setScheduleForm] = useState(defaultScheduleForm);
  const [roomForm, setRoomForm] = useState(defaultRoomForm);
  const [scheduleRecords, setScheduleRecords] = useState<StaffScheduleRecord[]>([]);
  const [roomRecords, setRoomRecords] = useState<RoomBookingRecord[]>([]);
  const [announcements, setAnnouncements] = useState<BroadcastAnnouncement[]>([]);

  useEffect(() => {
    const loadData = () => {
      setScheduleRecords(getStaffSchedules());
      setRoomRecords(getRoomBookings());
      setAnnouncements(getAnnouncements().filter((item) => item.active && item.audience !== "public"));
    };

    loadData();

    const intervalId = window.setInterval(loadData, 3000);
    window.addEventListener("storage", loadData);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const mySchedules = useMemo(
    () => scheduleRecords.filter((item) => item.requesterId === currentUser?.id),
    [currentUser?.id, scheduleRecords],
  );

  const myRoomBookings = useMemo(
    () => roomRecords.filter((item) => item.requesterId === currentUser?.id),
    [currentUser?.id, roomRecords],
  );

  const pendingCount = useMemo(
    () => [...mySchedules, ...myRoomBookings].filter((item) => item.status === "pending").length,
    [myRoomBookings, mySchedules],
  );

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const session = loginAdminAccount(username, password);

      if (!PORTAL_ROLES.includes(session.role)) {
        throw new Error("Tai khoan nay khong co quyen vao portal nhan su");
      }

      setPortalSession(session);
      setCurrentUser(session);
      setUsername("");
      setPassword("");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Khong the dang nhap");
    }
  };

  const handleLogout = () => {
    setPortalSession(null);
    setCurrentUser(null);
  };

  const handleScheduleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    saveStaffSchedule({
      requesterId: currentUser.id,
      requesterName: currentUser.fullName,
      requesterRole: currentUser.role,
      department: scheduleForm.department,
      scheduleDate: scheduleForm.scheduleDate,
      shiftLabel: scheduleForm.shiftLabel,
      startTime: scheduleForm.startTime,
      endTime: scheduleForm.endTime,
      notes: scheduleForm.notes,
    });

    pushAdminNotification({
      title: "Yeu cau lich lam moi",
      message: `${currentUser.fullName} vua dang ky ${scheduleForm.shiftLabel} ngay ${scheduleForm.scheduleDate}.`,
      type: "staff_schedule",
    });

    setScheduleForm(defaultScheduleForm);
    setScheduleRecords(getStaffSchedules());
  };

  const handleRoomSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    saveRoomBooking({
      requesterId: currentUser.id,
      requesterName: currentUser.fullName,
      requesterRole: currentUser.role,
      roomName: roomForm.roomName,
      bookingDate: roomForm.bookingDate,
      startTime: roomForm.startTime,
      endTime: roomForm.endTime,
      attendees: Number(roomForm.attendees) || 0,
      purpose: roomForm.purpose,
    });

    pushAdminNotification({
      title: "Yeu cau dat phong moi",
      message: `${currentUser.fullName} vua dat ${roomForm.roomName} ngay ${roomForm.bookingDate}.`,
      type: "room_booking",
    });

    setRoomForm(defaultRoomForm);
    setRoomRecords(getRoomBookings());
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.18),_transparent_32%),linear-gradient(135deg,#0f172a_0%,#111827_55%,#020617_100%)] p-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-200">
              Portal nhan su Elite Fitness
            </p>
            <h1 className="mt-6 text-4xl leading-tight">
              Dang ky lich lam, dat phong va nhan thong bao dieu phoi
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300">
              Huan luyen vien va nhan vien gui yeu cau tai day. Admin nhan toan bo thong bao,
              co the sua lich va dua thay doi len trang nguoi dung.
            </p>
          </div>

          <form onSubmit={handleLogin} className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
            <h2 className="text-2xl">Dang nhap nhan su</h2>
            <p className="mt-2 text-sm text-zinc-400">Dung tai khoan trainer, staff, manager hoac admin.</p>
            {error && (
              <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}
            <div className="mt-6 space-y-4">
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                placeholder="Username"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="mt-6 w-full rounded-2xl bg-red-600 px-5 py-3 font-medium hover:bg-red-500">
              Dang nhap portal
            </button>
            <div className="mt-5 text-sm text-zinc-400">
              Tai khoan mau: trainer1 / staff123, staff1 / staff123
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-red-300">Staff Portal</p>
            <h1 className="text-2xl">Dieu phoi lich nhan su va phong tap</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <div className="text-sm">{currentUser.fullName}</div>
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">{currentUser.role}</div>
            </div>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:border-red-500/50 hover:bg-red-500/10">
              <LogOut className="h-4 w-4" />
              Dang xuat
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Yeu cau cho duyet", String(pendingCount)],
            ["Lich da gui", String(mySchedules.length)],
            ["Dat phong da gui", String(myRoomBookings.length)],
            ["Thong bao", String(announcements.length)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-zinc-400">{label}</p>
              <p className="mt-3 text-3xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="mb-6 flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-blue-300" />
                <div>
                  <h2 className="text-xl">Dang ky lich lam</h2>
                  <p className="text-sm text-zinc-400">Gui yeu cau de admin xac nhan hoac dieu chinh.</p>
                </div>
              </div>
              <form onSubmit={handleScheduleSubmit} className="grid gap-4 md:grid-cols-2">
                <select value={scheduleForm.department} onChange={(event) => setScheduleForm((current) => ({ ...current, department: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                  <option>Training</option>
                  <option>Front Desk</option>
                  <option>Operations</option>
                  <option>Customer Care</option>
                </select>
                <input type="date" value={scheduleForm.scheduleDate} onChange={(event) => setScheduleForm((current) => ({ ...current, scheduleDate: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" required />
                <select value={scheduleForm.shiftLabel} onChange={(event) => setScheduleForm((current) => ({ ...current, shiftLabel: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                  <option>Ca sang</option>
                  <option>Ca chieu</option>
                  <option>Ca toi</option>
                  <option>Ca dac biet</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="time" value={scheduleForm.startTime} onChange={(event) => setScheduleForm((current) => ({ ...current, startTime: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" required />
                  <input type="time" value={scheduleForm.endTime} onChange={(event) => setScheduleForm((current) => ({ ...current, endTime: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" required />
                </div>
                <textarea value={scheduleForm.notes} onChange={(event) => setScheduleForm((current) => ({ ...current, notes: event.target.value }))} className="min-h-28 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none md:col-span-2" placeholder="Ghi chu cho admin" />
                <button type="submit" className="rounded-2xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 md:col-span-2">
                  Gui yeu cau lich lam
                </button>
              </form>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="mb-6 flex items-center gap-3">
                <DoorOpen className="h-5 w-5 text-emerald-300" />
                <div>
                  <h2 className="text-xl">Dat phong</h2>
                  <p className="text-sm text-zinc-400">Dang ky phong, khung gio va so nguoi.</p>
                </div>
              </div>
              <form onSubmit={handleRoomSubmit} className="grid gap-4 md:grid-cols-2">
                <select value={roomForm.roomName} onChange={(event) => setRoomForm((current) => ({ ...current, roomName: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                  <option>Phong Yoga</option>
                  <option>Phong HIIT</option>
                  <option>Studio PT</option>
                  <option>Phong Dance</option>
                </select>
                <input type="date" value={roomForm.bookingDate} onChange={(event) => setRoomForm((current) => ({ ...current, bookingDate: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="time" value={roomForm.startTime} onChange={(event) => setRoomForm((current) => ({ ...current, startTime: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" required />
                  <input type="time" value={roomForm.endTime} onChange={(event) => setRoomForm((current) => ({ ...current, endTime: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" required />
                </div>
                <input type="number" min="1" value={roomForm.attendees} onChange={(event) => setRoomForm((current) => ({ ...current, attendees: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" required />
                <textarea value={roomForm.purpose} onChange={(event) => setRoomForm((current) => ({ ...current, purpose: event.target.value }))} className="min-h-28 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none md:col-span-2" placeholder="Muc dich dat phong" required />
                <button type="submit" className="rounded-2xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-500 md:col-span-2">
                  Gui yeu cau dat phong
                </button>
              </form>
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="mb-5 flex items-center gap-3">
                <Bell className="h-5 w-5 text-amber-300" />
                <h2 className="text-xl">Lich cua toi</h2>
              </div>
              <div className="space-y-4">
                {mySchedules.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-400">Chua co lich dang ky nao.</div>
                ) : (
                  mySchedules.slice(0, 6).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg">{item.shiftLabel}</div>
                          <div className="mt-1 text-sm text-zinc-400">{item.scheduleDate} | {item.startTime} - {item.endTime}</div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs ${statusClass(item.status)}`}>{statusLabel(item.status)}</span>
                      </div>
                      {item.adminNote && <p className="mt-3 text-sm text-sky-200">Admin: {item.adminNote}</p>}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="mb-5 flex items-center gap-3">
                <DoorOpen className="h-5 w-5 text-emerald-300" />
                <h2 className="text-xl">Dat phong cua toi</h2>
              </div>
              <div className="space-y-4">
                {myRoomBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-400">Chua co yeu cau dat phong nao.</div>
                ) : (
                  myRoomBookings.slice(0, 6).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg">{item.roomName}</div>
                          <div className="mt-1 text-sm text-zinc-400">{item.bookingDate} | {item.startTime} - {item.endTime}</div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs ${statusClass(item.status)}`}>{statusLabel(item.status)}</span>
                      </div>
                      <p className="mt-3 text-sm text-zinc-300">{item.purpose}</p>
                      {item.adminNote && <p className="mt-3 text-sm text-sky-200">Admin: {item.adminNote}</p>}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="mb-5 flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-fuchsia-300" />
                <h2 className="text-xl">Thong bao noi bo</h2>
              </div>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-400">Chua co thong bao noi bo.</div>
                ) : (
                  announcements.slice(0, 6).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-lg">{item.title}</div>
                        <div className="text-xs text-zinc-500">{formatDateTime(item.updatedAt)}</div>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-zinc-300">{item.content}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
