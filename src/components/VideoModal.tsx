import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-900 border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-xl text-white">Tour Phòng Tập Elite Fitness Xuân Diệu</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Elite Fitness Video Tour"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Description */}
        <div className="p-6 bg-zinc-900">
          <p className="text-white/80 mb-4">
            Khám phá không gian tập luyện hiện đại và sang trọng của Elite Fitness Xuân Diệu. 
            Video này sẽ đưa bạn tham quan qua các khu vực tập luyện, phòng tập nhóm, và các 
            tiện ích cao cấp của chúng tôi.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-sm">
              Trang thiết bị hiện đại
            </span>
            <span className="px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-sm">
              Không gian sang trọng
            </span>
            <span className="px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-sm">
              Môi trường chuyên nghiệp
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
