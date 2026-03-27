import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'Thành viên 2 năm',
      rating: 5,
      text: 'Elite Fitness Xuân Diệu đã thay đổi cuộc sống của tôi! Tôi đã giảm 15kg trong 6 tháng với sự hỗ trợ tận tình từ các HLV. Thiết bị hiện đại, không gian sạch sẽ và thân thiện.',
      image: '👨',
    },
    {
      name: 'Trần Thị B',
      role: 'Thành viên 1 năm',
      rating: 5,
      text: 'Các lớp yoga và tư vấn dinh dưỡng ở đây thật tuyệt vời. Tôi cảm thấy khỏe mạnh và tràn đầy năng lượng hơn bao giờ hết. Đáng đồng tiền!',
      image: '👩',
    },
    {
      name: 'Lê Văn C',
      role: 'Thành viên 3 năm',
      rating: 5,
      text: 'Môi trường tập luyện tốt nhất mà tôi từng trải nghiệm. HLV chuyên nghiệp, luôn động viên và theo dõi tiến độ. Highly recommended!',
      image: '👨',
    },
  ];

  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block text-red-600 mb-4">ĐÁNH GIÁ</div>
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Hàng trăm thành viên đã đạt được mục tiêu của họ cùng Elite Fitness Xuân Diệu
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-black border border-white/10 p-8 rounded-xl hover:border-red-600 transition-all relative"
            >
              <Quote className="w-10 h-10 text-red-600/20 absolute top-8 right-8" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-3xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="text-white">{testimonial.name}</h4>
                  <p className="text-white/60">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="text-white/80 leading-relaxed">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}