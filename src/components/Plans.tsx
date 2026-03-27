import { Check } from "lucide-react";
import {
  extractFeatures,
  formatCurrency,
  isPlanService,
  type GymService,
} from "../lib/services";

function getPopularPlan(plans: GymService[]) {
  return plans.reduce<number | null>((bestIndex, plan, index, items) => {
    if (bestIndex === null) return index;
    return items[bestIndex].price < plan.price ? index : bestIndex;
  }, null);
}

export function Plans({
  services,
  onRegisterClick,
}: {
  services: GymService[];
  onRegisterClick: () => void;
}) {
  const plans = services.filter(isPlanService);
  const popularIndex = getPopularPlan(plans);

  return (
    <section id="plans" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block text-red-600 mb-4">GÓI TẬP</div>
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
            Gói Tập Phổ Biến Nhất
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Giá, thời hạn và mô tả gói tập sẽ tự động lấy từ bảng dịch vụ
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-white/15 bg-zinc-900 p-10 text-center text-white/60">
            Chưa có gói tập đang hoạt động.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const isPopular = popularIndex === index;
              const features = extractFeatures(plan);

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-8 ${
                    isPopular
                      ? "bg-red-600 transform md:-translate-y-4"
                      : "bg-zinc-900 border border-white/10"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full">
                      Nổi Bật
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl mb-2 text-white">{plan.name}</h3>
                    <p className={`text-sm mb-6 ${isPopular ? "text-white/80" : "text-white/60"}`}>
                      {plan.description || "Gói tập Hiện Đại nhất."}
                    </p>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-5xl text-white">{formatCurrency(plan.price)}</span>
                      <span className={`text-lg mb-2 ${isPopular ? "text-white/80" : "text-white/60"}`}>
                        d/{plan.durationDays || 30} ngay
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {features.map((feature) => (
                      <li key={`${plan.id}-${feature}`} className="flex items-start gap-3">
                        <Check
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            isPopular ? "text-white" : "text-red-600"
                          }`}
                        />
                        <span className={isPopular ? "text-white" : "text-white/80"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg transition-colors ${
                      isPopular
                        ? "bg-white text-red-600 hover:bg-white/90"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    onClick={onRegisterClick}
                  >
                    Chọn Gói Này
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
