import { CreditCard, QrCode, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency, type GymService } from "../lib/services";
import type { UserSession } from "../lib/storage";

interface RegistrationModalProps {
  isOpen: boolean;
  services: GymService[];
  currentUser: UserSession | null;
  selectedServiceId?: string;
  onClose: () => void;
  onSubmit: (payload: {
    fullName: string;
    email: string;
    phone: string;
    plan: string;
    goal: string;
    paymentMethod: "card" | "qr";
  }) => Promise<void>;
  onSuccess: () => void;
}

type RegistrationStep = "form" | "payment";

export function RegistrationModal({
  isOpen,
  services,
  currentUser,
  selectedServiceId,
  onClose,
  onSubmit,
  onSuccess,
}: RegistrationModalProps) {
  const serviceOptions = useMemo(() => services, [services]);
  const [step, setStep] = useState<RegistrationStep>("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    plan: "",
    goal: "",
    paymentMethod: "card" as "card" | "qr",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = serviceOptions.find((service) => String(service.id) === formData.plan);

  useEffect(() => {
    if (!isOpen) return;

    setStep("form");
    setFormData((prev) => ({
      ...prev,
      fullName: currentUser?.fullName || prev.fullName,
      email: currentUser?.email || prev.email,
      phone: currentUser?.phone || prev.phone,
      plan: selectedServiceId || prev.plan || String(serviceOptions[0]?.id || ""),
      paymentMethod: "card",
    }));
  }, [currentUser, isOpen, selectedServiceId, serviceOptions]);

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.plan) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    setStep("payment");
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onSuccess();
      setFormData({
        fullName: currentUser?.fullName || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        plan: String(serviceOptions[0]?.id || ""),
        goal: "",
        paymentMethod: "card",
      });
      setStep("form");
      onClose();
    } catch (error) {
      console.error("Không thể đăng ký gói tập:", error);
      alert(error instanceof Error ? error.message : "Không thể đăng ký gói tập");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-white mb-1">Đăng Ký Ngay</h2>
            <p className="text-white/60">
              {step === "form"
                ? "Bước 1: nhập thông tin khách hàng"
                : "Bước 2: chọn phương thức thanh toán"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleContinueToPayment} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-white/80 mb-2">
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                  placeholder="Nguyen Van A"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-white/80 mb-2">
                  So Dien Thoai *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                  placeholder="0901 234 567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-white/80 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="plan" className="block text-white/80 mb-2">
                Chon Dich Vu *
              </label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                required
                className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
              >
                {serviceOptions.length === 0 ? (
                  <option value="">Chưa có dịch vụ đang hoạt động</option>
                ) : (
                  serviceOptions.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {formatCurrency(service.price)}d/{service.durationDays} ngay
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="goal" className="block text-white/80 mb-2">
                Mục Tiêu Của Bạn
              </label>
              <textarea
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors resize-none"
                placeholder="Vi du: giam can, tang co, cai thien suc khoe..."
              />
            </div>

            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
              <h4 className="text-white mb-3">Quyen loi sau khi xac nhan</h4>
              <ul className="space-y-2 text-white/80">
                <li>Khách Hàng sẽ được trở thành 1 thành viên Phòng gym</li>
                <li>Hệ thống tao giao dich thu trong Quan ly tai chinh</li>
                <li>Bạn được chọn thanh toán băng thẻ hoặc mã QR</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/20 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={serviceOptions.length === 0}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900/40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
              >
                Xác Nhận Đăng Ký
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl text-white">{selectedService?.name || "Dich vu da chon"}</h3>
                  <p className="text-white/50">{selectedService?.durationDays || 0} ngay su dung</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/50">Tổng thanh toán</div>
                  <div className="text-2xl text-red-500">
                    {formatCurrency(Number(selectedService?.price) || 0)}d
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "card" }))}
                className={`rounded-xl border p-5 text-left transition-colors ${
                  formData.paymentMethod === "card"
                    ? "border-red-600 bg-red-600/10"
                    : "border-white/10 bg-black/30 hover:border-white/30"
                }`}
              >
                <CreditCard className="w-7 h-7 text-red-500 mb-3" />
                <div className="text-white text-lg mb-1">Thanh toán bằng thẻ</div>
                <div className="text-white/60 text-sm">
                  Xác nhận thanh toán bằng thẻ nội địa hoặc thẻ quốc tế.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "qr" }))}
                className={`rounded-xl border p-5 text-left transition-colors ${
                  formData.paymentMethod === "qr"
                    ? "border-red-600 bg-red-600/10"
                    : "border-white/10 bg-black/30 hover:border-white/30"
                }`}
              >
                <QrCode className="w-7 h-7 text-red-500 mb-3" />
                <div className="text-white text-lg mb-1">Thanh toán bằng mã QR</div>
                <div className="text-white/60 text-sm">
                  Quét mã QR để chuyển khoản nhanh và ghi nhận giao dịch ngay.
                </div>
              </button>
            </div>

            {formData.paymentMethod === "card" ? (
              <div className="rounded-xl border border-white/10 bg-black/30 p-5 space-y-4">
                <div className="text-white font-medium">Thong tin the demo</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value="4111 1111 1111 1111"
                    readOnly
                    className="w-full bg-zinc-950 border border-white/10 text-white px-4 py-3 rounded-lg"
                  />
                  <input
                    value="12/29"
                    readOnly
                    className="w-full bg-zinc-950 border border-white/10 text-white px-4 py-3 rounded-lg"
                  />
                </div>
                <p className="text-sm text-white/50">
                  Demo UI: khi bấm hoàn tất, hệ thống sẽ ghi nhận thanh toán bằng thẻ.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-center space-y-4">
                <div className="mx-auto h-48 w-48 rounded-2xl border border-white/10 bg-white p-4 text-black grid place-items-center">
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 36 }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-5 w-5 ${index % 2 === 0 || index % 5 === 0 ? "bg-black" : "bg-white"}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-white font-medium">QR thanh toan Elite Fitness</div>
                  <div className="text-white/60 text-sm">Ngân hàng demo - STK 123456789</div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/20 transition-colors"
              >
                Quay Lai
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900/40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? "Dang Xu Ly..." : "Hoan Tat Thanh Toan"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
