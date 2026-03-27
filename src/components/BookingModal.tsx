import { Calendar, Clock, User, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserSession } from "../lib/storage";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  classData?: {
    name: string;
    instructor: string;
    time: string;
    spots: string;
  };
  onSubmit: (payload: {
    name: string;
    email: string;
    phone: string;
    date: string;
  }) => Promise<void>;
  onSuccess: () => void;
}

export function BookingModal({
  isOpen,
  onClose,
  currentUser,
  classData,
  onSubmit,
  onSuccess,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setFormData((prev) => ({
      ...prev,
      name: currentUser?.fullName || prev.name,
      email: currentUser?.email || prev.email,
      phone: currentUser?.phone || prev.phone,
    }));
  }, [currentUser, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onSuccess();
      setFormData({
        name: currentUser?.fullName || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        date: "",
      });
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Khong the dat cho");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen || !classData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-zinc-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-white mb-1">Đặt Chỗ Lớp Học</h2>
            <p className="text-white/60">Thông tin đặt chỗ sẽ được lưu lại trên máy</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 bg-black/50 border-b border-white/10">
          <h3 className="text-xl text-white mb-4">{classData.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-white/60">
              <User className="w-4 h-4 text-red-600" />
              <span>{classData.instructor}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Clock className="w-4 h-4 text-red-600" />
              <span>{classData.time}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Users className="w-4 h-4 text-red-600" />
              <span>{classData.spots} cho</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-white/80 mb-2">
              Ho va Ten *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
              placeholder="Nguyen Van A"
            />
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

          <div>
            <label htmlFor="date" className="block text-white/80 mb-2">
              Chon Ngay *
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
            <p className="text-white/80 text-sm">
              Luu y: thông tin dat cho hiện duoc luu ngay trong trình duyêt de phuc vu demo
              va quy trinh tiep nhan nguoi dung.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/20 transition-colors"
            >
              Huy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900/40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Dang Dat..." : "Xac Nhan Dat Cho"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
