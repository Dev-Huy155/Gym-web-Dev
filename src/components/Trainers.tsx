import { Facebook, Instagram, Mail } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { TrainerProfile } from "../lib/staff";

const fallbackImages = [
  "https://images.unsplash.com/photo-1540205453279-389ebbc43b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1630415188550-9e454489ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1758957646695-ec8bce3df462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
];

interface TrainersProps {
  trainers: TrainerProfile[];
}

export function Trainers({ trainers }: TrainersProps) {
  return (
    <section id="trainers" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block text-red-600 mb-4">DOI NGU</div>
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
            Huấn Luyện Viên Chuyên Nghiệp Của Chúng Tôi
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Danh sách này tự động lấy từ bảng nhân viên đang làm và có vai trò huấn luyện.
          </p>
        </div>

        {trainers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-zinc-900 p-10 text-center text-white/60">
            Chưa có huấn luyện viên nào được cấu hình trong admin.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainers.map((trainer, index) => (
              <div
                key={trainer.id}
                className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:border-red-600 transition-all group"
              >
                <div className="relative h-80 overflow-hidden">
                  <ImageWithFallback
                    src={fallbackImages[index % fallbackImages.length]}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href="#"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                    <a
                      href={`mailto:${trainer.email}`}
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl mb-1 text-white">{trainer.name}</h3>
                  <p className="text-red-600 mb-3">{trainer.position}</p>
                  <p className="text-white/60 mb-2">{trainer.phone || "Dang cap nhat so dien thoai"}</p>
                  <p className="text-white/40">{trainer.email || "Dang cap nhat email"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
