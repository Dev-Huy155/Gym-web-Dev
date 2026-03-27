import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserSession } from "../lib/storage";

interface ContactProps {
  currentUser: UserSession | null;
  onSubmit: (payload: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => Promise<void>;
  onContactSuccess: () => void;
}

export function Contact({ currentUser, onSubmit, onContactSuccess }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    setFormData((prev) => ({
      ...prev,
      name: prev.name || currentUser.fullName,
      email: prev.email || currentUser.email,
      phone: prev.phone || currentUser.phone,
    }));
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onContactSuccess();
      setFormData({
        name: currentUser?.fullName || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        message: "",
      });
    } catch (error) {
      console.error("Khong the gui lien he:", error);
      alert(error instanceof Error ? error.message : "Khong the gui lien he");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Dia chi",
      content: "123 Duong Xuan Dieu, Quan Tay Ho, Ha Noi",
    },
    {
      icon: Phone,
      title: "Dien thoai",
      content: "(024) 1234 5678",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@elitefitness.vn",
    },
    {
      icon: Clock,
      title: "Gio mo cua",
      content: "Thu 2 - Chu Nhat: 5:00 - 23:00",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block text-red-600 mb-4">LIEN HE</div>
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
            Bắt Đầu Hành Trình Của Bạn
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Form liên hệ đã hoạt động. Tin nhắn sẽ được lưu lại trên trình duyệt để bạn
            có thể tiếp tục xử lý lead ngay.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="bg-zinc-900 border border-white/10 p-6 rounded-xl"
                >
                  <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="text-white mb-2">{info.title}</h4>
                  <p className="text-white/60">{info.content}</p>
                </div>
              ))}
            </div>

            <a
              href="https://maps.google.com/?q=123+Xuan+Dieu+Tay+Ho+Ha+Noi"
              target="_blank"
              rel="noreferrer"
              className="bg-zinc-900 border border-white/10 rounded-xl h-64 flex flex-col items-center justify-center gap-3 hover:border-red-600 transition-colors"
            >
              <MapPin className="w-12 h-12 text-red-600" />
              <span className="text-white">Mo Google Maps</span>
              <span className="text-white/50 text-sm">123 Duong Xuan Dieu, Tay Ho, Ha Noi</span>
            </a>
          </div>

          <div className="bg-zinc-900 border border-white/10 p-8 rounded-xl">
            <h3 className="text-2xl text-white mb-6">Gửi Tin Nhắn</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white/80 mb-2">
                  Họ và Tên *
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
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                  placeholder="0901 234 567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white/80 mb-2">
                  Tin Nhan *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors resize-none"
                  placeholder="Toi muon tim hieu them ve..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900/40 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? "Dang Gui..." : "Gui Tin Nhan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
