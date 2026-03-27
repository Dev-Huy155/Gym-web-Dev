import { Clock, Users, Flame } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Classes({ onBookClass, onViewSchedule }: { onBookClass: (classData: any) => void; onViewSchedule: () => void }) {
  const classes = [
    {
      name: 'Power Yoga',
      instructor: 'Minh Anh',
      time: '06:00 - 07:00',
      level: 'Mọi Cấp Độ',
      spots: '12/15',
      image: 'https://images.unsplash.com/photo-1630415188550-9e454489ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2xhc3MlMjBncm91cHxlbnwxfHx8fDE3NjQwMTgzMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      intensity: 'medium',
    },
    {
      name: 'HIIT Training',
      instructor: 'Tuấn Anh',
      time: '07:30 - 08:30',
      level: 'Nâng Cao',
      spots: '8/12',
      image: 'https://images.unsplash.com/photo-1758957646695-ec8bce3df462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBlcXVpcG1lbnQlMjBtb2Rlcm58ZW58MXx8fHwxNzYzOTI2NjYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      intensity: 'high',
    },
    {
      name: 'Boxing Fitness',
      instructor: 'Hùng Vương',
      time: '18:00 - 19:00',
      level: 'Trung Bình',
      spots: '10/15',
      image: 'https://images.unsplash.com/photo-1540205453279-389ebbc43b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluZXIlMjBjb2FjaGluZ3xlbnwxfHx8fDE3NjQwMDc4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      intensity: 'high',
    },
    {
      name: 'Zumba Dance',
      instructor: 'Lan Hương',
      time: '19:30 - 20:30',
      level: 'Mọi Cấp Độ',
      spots: '15/20',
      image: 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwd29ya291dHxlbnwxfHx8fDE3NjQwMTQ1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      intensity: 'medium',
    },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  return (
    <section id="classes" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block text-red-600 mb-4">LỊCH TẬP</div>
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
            Lớp Học Hôm Nay
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Tham gia các lớp học đa dạng với huấn luyện viên chuyên nghiệp
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((classItem, index) => (
            <div
              key={index}
              className="bg-black border border-white/10 rounded-xl overflow-hidden hover:border-red-600 transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={classItem.image}
                  alt={classItem.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className={`absolute top-4 right-4 ${getIntensityColor(classItem.intensity)}`}>
                  <Flame className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl mb-2 text-white">{classItem.name}</h3>
                <p className="text-white/60 mb-4">{classItem.instructor}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Users className="w-4 h-4 text-red-600" />
                    <span>{classItem.spots} chỗ</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{classItem.level}</span>
                  <button 
                    onClick={() => onBookClass(classItem)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Đặt Chỗ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={onViewSchedule}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg border border-white/20 transition-colors"
          >
            Xem Lịch Đầy Đủ
          </button>
        </div>
      </div>
    </section>
  );
}