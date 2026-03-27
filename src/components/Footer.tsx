import { Dumbbell, Facebook, Instagram, Youtube, Mail } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    'Về Chúng Tôi': ['Giới Thiệu', 'Đội Ngũ', 'Tin Tức', 'Tuyển Dụng'],
    'Dịch Vụ': ['Tập Luyện', 'Lớp Nhóm', 'PT 1-1', 'Dinh Dưỡng'],
    'Hỗ Trợ': ['FAQ', 'Liên Hệ', 'Chính Sách', 'Điều Khoản'],
  };

  return (
    <footer className="bg-zinc-900 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-8 h-8 text-red-600" />
              <span className="text-xl text-white">Elite Fitness Xuân Diệu</span>
            </div>
            <p className="text-white/60 mb-6 max-w-sm">
              Phòng tập gym hàng đầu Việt Nam với trang thiết bị hiện đại và đội ngũ 
              huấn luyện viên chuyên nghiệp. Biến ước mơ thành hiện thực!
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/60 hover:text-red-600 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60">
            © 2025 Elite Fitness Xuân Diệu. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/60 hover:text-red-600 transition-colors">
              Chính Sách Bảo Mật
            </a>
            <a href="#" className="text-white/60 hover:text-red-600 transition-colors">
              Điều Khoản Sử Dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}