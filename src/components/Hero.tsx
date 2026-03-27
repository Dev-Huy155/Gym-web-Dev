import { ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroProps {
  serviceCount: number;
  trainerCount: number;
  onRegisterClick: () => void;
  onVideoClick: () => void;
}

export function Hero({
  serviceCount,
  trainerCount,
  onRegisterClick,
  onVideoClick,
}: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwd29ya291dHxlbnwxfHx8fDE3NjQwMTQ1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Gym workout"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl">
          <div className="inline-block bg-red-600/20 border border-red-600 text-red-500 px-4 py-2 rounded-full mb-6">
            Phòng Tập Hiện Đại #1 Việt Nam
          </div>
          <h1 className="text-5xl md:text-7xl mb-6 text-white">
            Biến Giác Mơ Thành
            <span className="text-red-600 block">Thực Tế</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Trang thiết bị hiện đại, huấn luyện viên chuyên nghiêp và dữ liệu gói tập
            được đồng bộ trực tiếp từ hệ thống quản trị.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onRegisterClick}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              Bắt Đầu Ngay
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onVideoClick}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg flex items-center gap-2 transition-colors border border-white/20"
            >
              <Play className="w-5 h-5" />
              Xem Video
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16">
            <div>
              <div className="text-4xl text-red-600 mb-2">500+</div>
              <div className="text-white/60">Thành Viên</div>
            </div>
            <div>
              <div className="text-4xl text-red-600 mb-2">{trainerCount}+</div>
              <div className="text-white/60">HUẤN LUYỆN VIÊN CHUYÊN NGHIỆP</div>
            </div>
            <div>
              <div className="text-4xl text-red-600 mb-2">{serviceCount}+</div>
              <div className="text-white/60">Dịch Vụ Đang Mở</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
