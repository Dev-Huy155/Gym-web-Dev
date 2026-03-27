import { X, Clock, Users, Flame, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookClass: (classData: any) => void;
}

export function ScheduleModal({ isOpen, onClose, onBookClass }: ScheduleModalProps) {
  const [selectedDay, setSelectedDay] = useState('monday');

  const weekSchedule = {
    monday: [
      { time: '06:00 - 07:00', name: 'Power Yoga', instructor: 'Minh Anh', spots: '12/15', intensity: 'medium' },
      { time: '07:30 - 08:30', name: 'HIIT Training', instructor: 'Tuấn Anh', spots: '8/12', intensity: 'high' },
      { time: '09:00 - 10:00', name: 'Pilates', instructor: 'Lan Hương', spots: '10/15', intensity: 'low' },
      { time: '18:00 - 19:00', name: 'Boxing Fitness', instructor: 'Hùng Vương', spots: '10/15', intensity: 'high' },
      { time: '19:30 - 20:30', name: 'Zumba Dance', instructor: 'Lan Hương', spots: '15/20', intensity: 'medium' },
    ],
    tuesday: [
      { time: '06:00 - 07:00', name: 'Morning Cardio', instructor: 'Tuấn Anh', spots: '15/20', intensity: 'medium' },
      { time: '08:00 - 09:00', name: 'Strength Training', instructor: 'Hùng Vương', spots: '8/12', intensity: 'high' },
      { time: '18:00 - 19:00', name: 'Yoga Flow', instructor: 'Minh Anh', spots: '12/15', intensity: 'low' },
      { time: '19:30 - 20:30', name: 'CrossFit', instructor: 'Tuấn Anh', spots: '10/15', intensity: 'high' },
    ],
    wednesday: [
      { time: '06:00 - 07:00', name: 'Power Yoga', instructor: 'Minh Anh', spots: '12/15', intensity: 'medium' },
      { time: '07:30 - 08:30', name: 'HIIT Training', instructor: 'Tuấn Anh', spots: '8/12', intensity: 'high' },
      { time: '18:00 - 19:00', name: 'Boxing Fitness', instructor: 'Hùng Vương', spots: '10/15', intensity: 'high' },
      { time: '19:30 - 20:30', name: 'Zumba Dance', instructor: 'Lan Hương', spots: '15/20', intensity: 'medium' },
    ],
    thursday: [
      { time: '06:00 - 07:00', name: 'Morning Stretch', instructor: 'Minh Anh', spots: '15/20', intensity: 'low' },
      { time: '08:00 - 09:00', name: 'Body Pump', instructor: 'Tuấn Anh', spots: '12/15', intensity: 'high' },
      { time: '18:00 - 19:00', name: 'Kickboxing', instructor: 'Hùng Vương', spots: '10/15', intensity: 'high' },
      { time: '19:30 - 20:30', name: 'Dance Fitness', instructor: 'Lan Hương', spots: '15/20', intensity: 'medium' },
    ],
    friday: [
      { time: '06:00 - 07:00', name: 'Power Yoga', instructor: 'Minh Anh', spots: '12/15', intensity: 'medium' },
      { time: '07:30 - 08:30', name: 'HIIT Training', instructor: 'Tuấn Anh', spots: '8/12', intensity: 'high' },
      { time: '18:00 - 19:00', name: 'Boxing Fitness', instructor: 'Hùng Vương', spots: '10/15', intensity: 'high' },
      { time: '19:30 - 20:30', name: 'Weekend Warm-up', instructor: 'Lan Hương', spots: '18/20', intensity: 'medium' },
    ],
    saturday: [
      { time: '08:00 - 09:00', name: 'Weekend Yoga', instructor: 'Minh Anh', spots: '15/20', intensity: 'low' },
      { time: '09:30 - 10:30', name: 'Family Fitness', instructor: 'Tuấn Anh', spots: '20/25', intensity: 'medium' },
      { time: '16:00 - 17:00', name: 'Functional Training', instructor: 'Hùng Vương', spots: '12/15', intensity: 'high' },
      { time: '17:30 - 18:30', name: 'Zumba Party', instructor: 'Lan Hương', spots: '20/25', intensity: 'medium' },
    ],
    sunday: [
      { time: '08:00 - 09:00', name: 'Sunrise Yoga', instructor: 'Minh Anh', spots: '15/20', intensity: 'low' },
      { time: '09:30 - 10:30', name: 'Recovery Stretch', instructor: 'Lan Hương', spots: '12/15', intensity: 'low' },
      { time: '16:00 - 17:00', name: 'Evening Flow', instructor: 'Minh Anh', spots: '10/15', intensity: 'medium' },
    ],
  };

  const days = [
    { id: 'monday', label: 'Thứ 2' },
    { id: 'tuesday', label: 'Thứ 3' },
    { id: 'wednesday', label: 'Thứ 4' },
    { id: 'thursday', label: 'Thứ 5' },
    { id: 'friday', label: 'Thứ 6' },
    { id: 'saturday', label: 'Thứ 7' },
    { id: 'sunday', label: 'Chủ Nhật' },
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-900 border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-zinc-900 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-white mb-1">Lịch Học Đầy Đủ</h2>
            <p className="text-white/60">Xem và đăng ký lớp học trong tuần</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Day Selector */}
        <div className="bg-black/50 border-b border-white/10 p-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                  selectedDay === day.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {weekSchedule[selectedDay as keyof typeof weekSchedule].map((classItem, index) => (
              <div
                key={index}
                className="bg-black border border-white/10 rounded-xl p-6 hover:border-red-600 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl text-white">{classItem.name}</h3>
                      <Flame className={`w-5 h-5 ${getIntensityColor(classItem.intensity)}`} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span>{classItem.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Users className="w-4 h-4 text-red-600" />
                        <span>{classItem.spots} chỗ</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="w-4 h-4 text-red-600" />
                        <span>{classItem.instructor}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onBookClass(classItem);
                      onClose();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Đặt Chỗ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-black/50 border-t border-white/10 p-4">
          <p className="text-sm text-white/60 text-center">
            💡 Lịch học có thể thay đổi. Vui lòng kiểm tra thông báo từ phòng tập hoặc liên hệ để xác nhận.
          </p>
        </div>
      </div>
    </div>
  );
}
