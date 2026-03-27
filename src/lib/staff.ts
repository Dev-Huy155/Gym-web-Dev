export interface TrainerProfile {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string | null;
  salary: number;
  status: string;
}

const API_BASE_URL = "http://localhost:3001";

export const STAFF_POSITION_OPTIONS = [
  "Huấn luyện viên",
  "Lễ tân",
  "Quản lý",
  "Kế toán",
  "Kỹ thuật",
  "CSKH",
] as const;

export async function fetchStaff(): Promise<TrainerProfile[]> {
  const response = await fetch(`${API_BASE_URL}/staff`);

  if (!response.ok) {
    throw new Error("Khong the tai danh sach nhan vien");
  }

  const data = await response.json();

  return (Array.isArray(data) ? data : []).map((item) => ({
    id: Number(item.id) || 0,
    name: item.name || "",
    position: item.position || "",
    phone: item.phone || "",
    email: item.email || "",
    address: item.address || "",
    joinDate: item.joinDate || null,
    salary: Number(item.salary) || 0,
    status: item.status || "",
  }));
}

export function normalizeVietnamese(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function isTrainerPosition(position: string) {
  const normalizedPosition = normalizeVietnamese(position);

  return (
    normalizedPosition === "huan luyen vien" ||
    normalizedPosition.includes("trainer") ||
    normalizedPosition.includes("coach") ||
    normalizedPosition.includes("pt")
  );
}

export function isVisibleTrainer(staff: TrainerProfile) {
  const normalizedStatus = normalizeVietnamese(staff.status);

  return normalizedStatus.includes("dang lam") && isTrainerPosition(staff.position);
}
