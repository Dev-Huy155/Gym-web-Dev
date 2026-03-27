import {
  Clock,
  Dumbbell,
  Heart,
  MousePointerClick,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency, type GymService } from "../lib/services";

const iconByType: Record<string, LucideIcon> = {
  "goi tap": Dumbbell,
  pt: Heart,
  "lop hoc": Users,
  cardio: Zap,
  "dinh duong": Trophy,
};

function normalizeType(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function getServiceIcon(type: string) {
  const normalized = normalizeType(type);

  if (normalized.includes("pt")) return Heart;
  if (normalized.includes("lop hoc")) return Users;
  if (normalized.includes("cardio")) return Zap;
  if (normalized.includes("dinh duong")) return Trophy;

  return iconByType[normalized] || Clock;
}

export function Services({
  services,
  onSelectService,
}: {
  services: GymService[];
  onSelectService: (service: GymService) => void;
}) {
  return (
    <section id="services" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block text-red-600 mb-4">GÓI TẬP VÀ DỊCH VỤ</div>
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
           Tất Cả Các Dịch Vụ
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Gói tập và dịch vụ đã được gộp thành một danh sách. Mọi thay đổi trong admin sẽ
            được cập nhật ở đây.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-black/40 p-10 text-center text-white/60">
            Chưa có dịch vụ đang hoạt động.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = getServiceIcon(service.type);

              return (
                <div
                  key={service.id}
                  className="bg-black border border-white/10 p-8 rounded-xl hover:border-red-600 transition-all group cursor-pointer"
                  onClick={() => onSelectService(service)}
                >
                  <div className="w-14 h-14 bg-red-600/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                    <Icon className="w-7 h-7 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl text-white">{service.name}</h3>
                    <span className="text-sm text-red-500 whitespace-nowrap">
                      {formatCurrency(service.price)} d
                    </span>
                  </div>
                  <p className="text-white/60 mb-4">
                    {service.description || "Thong tin dang duoc cap nhat tu he thong."}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-white/50">
                    <span>{service.type}</span>
                    <span>{service.durationDays} ngay</span>
                    {service.maxMembers > 0 && <span>Tối đa {service.maxMembers} người</span>}
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm text-red-500">
                    <MousePointerClick className="w-4 h-4" />
                    <span>Nhấn để đăng ký ngay</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
