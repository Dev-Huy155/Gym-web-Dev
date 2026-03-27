export type AccountType = "user" | "admin";
export type AccountRole =
  | "member"
  | "staff"
  | "trainer"
  | "manager"
  | "admin"
  | "super_admin";
export type AccountStatus = "active" | "inactive";

export interface StoredAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  accountType: AccountType;
  role: AccountRole;
  status: AccountStatus;
  createdAt: string;
}

export interface UserSession {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  accountType: AccountType;
  role: AccountRole;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface ClassBookingRecord {
  id: string;
  className: string;
  instructor: string;
  time: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type:
    | "registration"
    | "account"
    | "booking"
    | "staff_schedule"
    | "room_booking"
    | "announcement";
  createdAt: string;
  read: boolean;
}

export interface StaffScheduleRecord {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: AccountRole;
  department: string;
  scheduleDate: string;
  shiftLabel: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: "pending" | "approved" | "updated" | "cancelled";
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomBookingRecord {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: AccountRole;
  roomName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  purpose: string;
  status: "pending" | "approved" | "updated" | "rejected";
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastAnnouncement {
  id: string;
  title: string;
  content: string;
  audience: "public" | "staff" | "all";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  active: boolean;
}

const STORAGE_KEYS = {
  accounts: "elite_fitness_accounts",
  session: "elite_fitness_session",
  adminSession: "elite_fitness_admin_session",
  portalSession: "elite_fitness_portal_session",
  inquiries: "elite_fitness_inquiries",
  bookings: "elite_fitness_bookings",
  notifications: "elite_fitness_notifications",
  staffSchedules: "elite_fitness_staff_schedules",
  roomBookings: "elite_fitness_room_bookings",
  announcements: "elite_fitness_announcements",
};

const DEFAULT_ADMIN_ACCOUNTS: StoredAccount[] = [
  {
    id: "seed-admin",
    username: "admin",
    fullName: "System Admin",
    email: "admin@elitefitness.vn",
    phone: "0900000001",
    password: "admin123",
    accountType: "admin",
    role: "super_admin",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "seed-manager",
    username: "manager",
    fullName: "Gym Manager",
    email: "manager@elitefitness.vn",
    phone: "0900000002",
    password: "manager123",
    accountType: "admin",
    role: "manager",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "seed-trainer",
    username: "trainer1",
    fullName: "Trainer Account",
    email: "trainer1@elitefitness.vn",
    phone: "0900000003",
    password: "staff123",
    accountType: "admin",
    role: "trainer",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "seed-staff",
    username: "staff1",
    fullName: "Staff Account",
    email: "staff1@elitefitness.vn",
    phone: "0900000004",
    password: "staff123",
    accountType: "admin",
    role: "staff",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch (error) {
    console.error(`Khong the doc localStorage cho key ${key}:`, error);
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Khong the ghi localStorage cho key ${key}:`, error);
  }
}

function normalizeAccount(input: Partial<StoredAccount>): StoredAccount {
  return {
    id: input.id || crypto.randomUUID(),
    username: input.username || input.email || "",
    fullName: input.fullName || "",
    email: input.email || "",
    phone: input.phone || "",
    password: input.password || "",
    accountType: input.accountType || "user",
    role: input.role || (input.accountType === "admin" ? "staff" : "member"),
    status: input.status || "active",
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

function persistAccounts(accounts: StoredAccount[]) {
  writeStorage(STORAGE_KEYS.accounts, accounts);
  return accounts;
}

function ensureSeedAccounts() {
  const currentAccounts = readStorage<Partial<StoredAccount>[]>(STORAGE_KEYS.accounts, []);
  const normalizedAccounts = currentAccounts.map(normalizeAccount);

  const nextAccounts = [...normalizedAccounts];

  for (const seedAccount of DEFAULT_ADMIN_ACCOUNTS) {
    const exists = nextAccounts.some(
      (account) =>
        account.username.toLowerCase() === seedAccount.username.toLowerCase() ||
        account.email.toLowerCase() === seedAccount.email.toLowerCase(),
    );

    if (!exists) {
      nextAccounts.push(seedAccount);
    }
  }

  const dedupedAccounts = nextAccounts.filter(
    (account, index, items) =>
      items.findIndex(
        (candidate) =>
          candidate.username.toLowerCase() === account.username.toLowerCase() ||
          candidate.email.toLowerCase() === account.email.toLowerCase(),
      ) === index,
  );

  persistAccounts(dedupedAccounts);
  return dedupedAccounts;
}

export function getStoredAccounts() {
  return ensureSeedAccounts();
}

export function getUserAccounts() {
  return getStoredAccounts().filter((account) => account.accountType === "user");
}

export function getAdminAccounts() {
  return getStoredAccounts().filter((account) => account.accountType === "admin");
}

export function saveAccount(account: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  const accounts = getStoredAccounts();
  const normalizedEmail = account.email.trim().toLowerCase();

  if (accounts.some((item) => item.email.trim().toLowerCase() === normalizedEmail)) {
    throw new Error("Email nay da ton tai");
  }

  const nextAccount: StoredAccount = {
    id: crypto.randomUUID(),
    username: normalizedEmail,
    fullName: account.fullName,
    email: normalizedEmail,
    phone: account.phone,
    password: account.password,
    accountType: "user",
    role: "member",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  persistAccounts([nextAccount, ...accounts]);
  return toSession(nextAccount);
}

export function saveManagedAccount(
  payload: Omit<StoredAccount, "id" | "createdAt"> & { id?: string },
) {
  const accounts = getStoredAccounts();
  const normalizedUsername = payload.username.trim().toLowerCase();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const duplicate = accounts.find(
    (account) =>
      account.id !== payload.id &&
      (account.username.trim().toLowerCase() === normalizedUsername ||
        account.email.trim().toLowerCase() === normalizedEmail),
  );

  if (duplicate) {
    throw new Error("Username hoac email da ton tai");
  }

  const nextAccount: StoredAccount = {
    id: payload.id || crypto.randomUUID(),
    username: normalizedUsername,
    fullName: payload.fullName,
    email: normalizedEmail,
    phone: payload.phone,
    password: payload.password,
    accountType: payload.accountType,
    role: payload.role,
    status: payload.status,
    createdAt:
      accounts.find((account) => account.id === payload.id)?.createdAt || new Date().toISOString(),
  };

  const nextAccounts = payload.id
    ? accounts.map((account) => (account.id === payload.id ? nextAccount : account))
    : [nextAccount, ...accounts];

  persistAccounts(nextAccounts);
  return nextAccount;
}

export function deleteManagedAccount(id: string) {
  const accounts = getStoredAccounts();
  const target = accounts.find((account) => account.id === id);

  if (!target) {
    throw new Error("Khong tim thay tai khoan");
  }

  if (target.username === "admin") {
    throw new Error("Khong duoc xoa tai khoan admin goc");
  }

  persistAccounts(accounts.filter((account) => account.id !== id));
}

export function loginAccount(email: string, password: string) {
  const account = getStoredAccounts().find(
    (item) =>
      item.accountType === "user" &&
      item.status === "active" &&
      item.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      item.password === password,
  );

  if (!account) {
    throw new Error("Email hoac mat khau khong dung");
  }

  const session = toSession(account);
  writeStorage(STORAGE_KEYS.session, session);
  return session;
}

export function loginAdminAccount(username: string, password: string) {
  const account = getStoredAccounts().find(
    (item) =>
      item.accountType === "admin" &&
      item.status === "active" &&
      item.username.trim().toLowerCase() === username.trim().toLowerCase() &&
      item.password === password,
  );

  if (!account) {
    throw new Error("Ten dang nhap hoac mat khau khong dung");
  }

  const session = toSession(account);
  writeStorage(STORAGE_KEYS.adminSession, session);
  return session;
}

export function setSession(session: UserSession | null) {
  if (!session) {
    if (canUseStorage()) {
      window.localStorage.removeItem(STORAGE_KEYS.session);
    }
    return;
  }

  writeStorage(STORAGE_KEYS.session, session);
}

export function getSession() {
  const session = readStorage<Partial<UserSession> | null>(STORAGE_KEYS.session, null);
  if (!session) return null;

  return {
    id: session.id || "",
    username: session.username || session.email || "",
    fullName: session.fullName || "",
    email: session.email || "",
    phone: session.phone || "",
    accountType: session.accountType || "user",
    role: session.role || "member",
  };
}

export function setAdminSession(session: UserSession | null) {
  if (!session) {
    if (canUseStorage()) {
      window.localStorage.removeItem(STORAGE_KEYS.adminSession);
    }
    return;
  }

  writeStorage(STORAGE_KEYS.adminSession, session);
}

export function getAdminSession() {
  const session = readStorage<Partial<UserSession> | null>(STORAGE_KEYS.adminSession, null);
  if (!session) return null;

  return {
    id: session.id || "",
    username: session.username || session.email || "",
    fullName: session.fullName || "",
    email: session.email || "",
    phone: session.phone || "",
    accountType: session.accountType || "admin",
    role: session.role || "staff",
  };
}

export function setPortalSession(session: UserSession | null) {
  if (!session) {
    if (canUseStorage()) {
      window.localStorage.removeItem(STORAGE_KEYS.portalSession);
    }
    return;
  }

  writeStorage(STORAGE_KEYS.portalSession, session);
}

export function getPortalSession() {
  const session = readStorage<Partial<UserSession> | null>(STORAGE_KEYS.portalSession, null);
  if (!session) return null;

  return {
    id: session.id || "",
    username: session.username || session.email || "",
    fullName: session.fullName || "",
    email: session.email || "",
    phone: session.phone || "",
    accountType: session.accountType || "admin",
    role: session.role || "staff",
  };
}

export function saveInquiry(payload: Omit<ContactInquiry, "id" | "createdAt">) {
  const inquiries = readStorage<ContactInquiry[]>(STORAGE_KEYS.inquiries, []);
  const nextInquiry: ContactInquiry = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  writeStorage(STORAGE_KEYS.inquiries, [nextInquiry, ...inquiries]);
  return nextInquiry;
}

export function saveBooking(payload: Omit<ClassBookingRecord, "id" | "createdAt">) {
  const bookings = readStorage<ClassBookingRecord[]>(STORAGE_KEYS.bookings, []);
  const nextBooking: ClassBookingRecord = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  writeStorage(STORAGE_KEYS.bookings, [nextBooking, ...bookings]);
  return nextBooking;
}

export function getStaffSchedules() {
  return readStorage<StaffScheduleRecord[]>(STORAGE_KEYS.staffSchedules, []);
}

export function saveStaffSchedule(
  payload: Omit<StaffScheduleRecord, "id" | "createdAt" | "updatedAt" | "status" | "adminNote">,
) {
  const schedules = getStaffSchedules();
  const timestamp = new Date().toISOString();
  const nextSchedule: StaffScheduleRecord = {
    ...payload,
    id: crypto.randomUUID(),
    status: "pending",
    adminNote: "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeStorage(STORAGE_KEYS.staffSchedules, [nextSchedule, ...schedules]);
  return nextSchedule;
}

export function updateStaffSchedule(
  id: string,
  payload: Partial<
    Omit<StaffScheduleRecord, "id" | "requesterId" | "requesterName" | "requesterRole" | "createdAt">
  >,
) {
  const schedules = getStaffSchedules();
  const target = schedules.find((item) => item.id === id);

  if (!target) {
    throw new Error("Khong tim thay lich dang ky");
  }

  const nextRecord: StaffScheduleRecord = {
    ...target,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  writeStorage(
    STORAGE_KEYS.staffSchedules,
    schedules.map((item) => (item.id === id ? nextRecord : item)),
  );

  return nextRecord;
}

export function getRoomBookings() {
  return readStorage<RoomBookingRecord[]>(STORAGE_KEYS.roomBookings, []);
}

export function saveRoomBooking(
  payload: Omit<RoomBookingRecord, "id" | "createdAt" | "updatedAt" | "status" | "adminNote">,
) {
  const bookings = getRoomBookings();
  const timestamp = new Date().toISOString();
  const nextBooking: RoomBookingRecord = {
    ...payload,
    id: crypto.randomUUID(),
    status: "pending",
    adminNote: "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeStorage(STORAGE_KEYS.roomBookings, [nextBooking, ...bookings]);
  return nextBooking;
}

export function updateRoomBooking(
  id: string,
  payload: Partial<
    Omit<RoomBookingRecord, "id" | "requesterId" | "requesterName" | "requesterRole" | "createdAt">
  >,
) {
  const bookings = getRoomBookings();
  const target = bookings.find((item) => item.id === id);

  if (!target) {
    throw new Error("Khong tim thay dat phong");
  }

  const nextRecord: RoomBookingRecord = {
    ...target,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  writeStorage(
    STORAGE_KEYS.roomBookings,
    bookings.map((item) => (item.id === id ? nextRecord : item)),
  );

  return nextRecord;
}

export function getAnnouncements() {
  const announcements = readStorage<BroadcastAnnouncement[]>(STORAGE_KEYS.announcements, []);

  if (announcements.length > 0) {
    return announcements;
  }

  const seedAnnouncements: BroadcastAnnouncement[] = [
    {
      id: "seed-announcement-public",
      title: "Thong bao lich lop va dat phong",
      content:
        "Admin se cap nhat cac thay doi lich, phong tap va thong bao quan trong tai day de nguoi dung theo doi.",
      audience: "public",
      createdBy: "System Admin",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      pinned: true,
      active: true,
    },
  ];

  writeStorage(STORAGE_KEYS.announcements, seedAnnouncements);
  return seedAnnouncements;
}

export function saveAnnouncement(
  payload: Omit<BroadcastAnnouncement, "id" | "createdAt" | "updatedAt">,
) {
  const announcements = getAnnouncements();
  const timestamp = new Date().toISOString();
  const nextAnnouncement: BroadcastAnnouncement = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeStorage(STORAGE_KEYS.announcements, [nextAnnouncement, ...announcements]);
  return nextAnnouncement;
}

export function updateAnnouncement(
  id: string,
  payload: Partial<Omit<BroadcastAnnouncement, "id" | "createdAt">>,
) {
  const announcements = getAnnouncements();
  const target = announcements.find((item) => item.id === id);

  if (!target) {
    throw new Error("Khong tim thay thong bao");
  }

  const nextRecord: BroadcastAnnouncement = {
    ...target,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  writeStorage(
    STORAGE_KEYS.announcements,
    announcements.map((item) => (item.id === id ? nextRecord : item)),
  );

  return nextRecord;
}

export function getAdminNotifications() {
  return readStorage<AdminNotification[]>(STORAGE_KEYS.notifications, []);
}

export function pushAdminNotification(
  payload: Omit<AdminNotification, "id" | "createdAt" | "read">,
) {
  const notifications = getAdminNotifications();
  const nextNotification: AdminNotification = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  writeStorage(STORAGE_KEYS.notifications, [nextNotification, ...notifications].slice(0, 100));
  return nextNotification;
}

export function markAllAdminNotificationsAsRead() {
  const notifications = getAdminNotifications().map((item) => ({
    ...item,
    read: true,
  }));

  writeStorage(STORAGE_KEYS.notifications, notifications);
  return notifications;
}

export function getRoleLabel(role: AccountRole) {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "trainer":
      return "Trainer";
    case "staff":
      return "Staff";
    default:
      return "Member";
  }
}

export function getAccountTypeLabel(accountType: AccountType) {
  return accountType === "admin" ? "Admin" : "User";
}

function toSession(account: StoredAccount): UserSession {
  return {
    id: account.id,
    username: account.username,
    fullName: account.fullName,
    email: account.email,
    phone: account.phone,
    accountType: account.accountType,
    role: account.role,
  };
}
