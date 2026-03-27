export interface GymService {
  id: number;
  name: string;
  type: string;
  price: number;
  durationDays: number;
  description: string;
  maxMembers: number;
  active: boolean;
}

const API_BASE_URL = "http://localhost:3001";

export async function fetchServices(): Promise<GymService[]> {
  const response = await fetch(`${API_BASE_URL}/services`);

  if (!response.ok) {
    throw new Error("Khong the tai danh sach dich vu");
  }

  const data = await response.json();

  return (Array.isArray(data) ? data : []).map((item) => ({
    id: Number(item.id) || 0,
    name: item.name || "",
    type: item.type || "",
    price: Number(item.price) || 0,
    durationDays: Number(item.durationDays) || 0,
    description: item.description || "",
    maxMembers: Number(item.maxMembers) || 0,
    active: Boolean(item.active),
  }));
}

export function isPlanService(service: GymService) {
  return service.type.toLowerCase().includes("goi");
}

export function isVisibleService(service: GymService) {
  return service.active;
}

export function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN");
}

export function extractFeatures(service: GymService) {
  const descriptionFeatures = service.description
    .split(/\r?\n|[.;]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const fallbackFeatures = [
    service.durationDays > 0 ? `Su dung trong ${service.durationDays} ngay` : "",
    service.maxMembers > 0 ? `Toi da ${service.maxMembers} hoc vien` : "Khong gioi han luot dang ky",
    "Ho tro tai quay le tan",
  ].filter(Boolean);

  return descriptionFeatures.length > 0 ? descriptionFeatures.slice(0, 6) : fallbackFeatures;
}
