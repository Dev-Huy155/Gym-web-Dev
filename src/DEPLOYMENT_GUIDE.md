# Hướng Dẫn Triển Khai Elite Fitness Xuân Diệu Website

## 🎯 Tổng Quan Dự Án

Đây là một React + TypeScript application được xây dựng với Vite và Tailwind CSS. Website có đầy đủ chức năng cho phòng tập gym cao cấp Elite Fitness Xuân Diệu.

## 📁 Cấu Trúc Dự Án

```
elite-fitness/
├── public/                    # Static files
├── src/
│   ├── app/
│   │   └── components/
│   │       └── figma/
│   │           └── ImageWithFallback.tsx
│   ├── components/           # React Components
│   │   ├── Header.tsx       # Header với navigation
│   │   ├── Hero.tsx         # Hero section
│   │   ├── Services.tsx     # Dịch vụ
│   │   ├── Plans.tsx        # Các gói tập
│   │   ├── Classes.tsx      # Lớp học
│   │   ├── Trainers.tsx     # HLV
│   │   ├── Testimonials.tsx # Đánh giá
│   │   ├── Contact.tsx      # Liên hệ
│   │   ├── Footer.tsx       # Footer
│   │   ├── RegistrationModal.tsx  # Modal đăng ký
│   │   ├── LoginModal.tsx   # Modal đăng nhập
│   │   ├── VideoModal.tsx   # Modal video
│   │   ├── BookingModal.tsx # Modal đặt chỗ
│   │   ├── ScheduleModal.tsx # Modal lịch
│   │   └── ui/              # UI Components (shadcn)
│   ├── styles/
│   │   └── globals.css      # Global styles + Tailwind
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Entry point
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── tailwind.config.js       # Tailwind config
```

## 🚀 Cách Setup Dự Án

### Bước 1: Clone hoặc tạo dự án mới

```bash
# Tạo thư mục dự án
mkdir elite-fitness-xuandieu
cd elite-fitness-xuandieu

# Khởi tạo npm project
npm init -y
```

### Bước 2: Cài đặt dependencies

```bash
# Core dependencies
npm install react@18 react-dom@18
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom

# Tailwind CSS
npm install -D tailwindcss@4 postcss autoprefixer

# UI Libraries
npm install lucide-react
npm install sonner@2.0.3
npm install react-router
npm install motion

# Additional utilities
npm install clsx tailwind-merge
npm install class-variance-authority
```

### Bước 3: Tạo file cấu hình

**package.json** (thêm scripts):
```json
{
  "name": "elite-fitness-xuandieu",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Bước 4: Copy tất cả source code

Copy tất cả files từ các thư mục:
- `/components/` → `src/components/`
- `/styles/` → `src/styles/`
- `/App.tsx` → `src/App.tsx`

### Bước 5: Tạo entry point

**src/main.tsx**:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**index.html** (trong root folder):
```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/dumbbell-icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Elite Fitness Xuân Diệu - Phòng Tập Gym Cao Cấp Hà Nội</title>
    <meta name="description" content="Elite Fitness Xuân Diệu - Phòng tập gym hiện đại #1 tại Tây Hồ, Hà Nội. Trang thiết bị cao cấp, huấn luyện viên chuyên nghiệp, không gian sang trọng." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## 🛠️ Development

```bash
# Chạy development server
npm run dev

# Truy cập http://localhost:5173
```

## 📦 Build Production

```bash
# Build production
npm run build

# Preview production build
npm run preview
```

Build sẽ tạo thư mục `dist/` chứa:
- `index.html` - HTML file đã được optimize
- `assets/` - JS, CSS đã được minify và hash
- Images và static files

## 🌐 Deployment Options

### Option 1: Netlify (Khuyến nghị - Miễn phí)

1. Push code lên GitHub
2. Kết nối GitHub repo với Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

### Option 2: Vercel (Miễn phí)

1. Push code lên GitHub
2. Import project từ Vercel dashboard
3. Vercel tự động detect Vite config
4. Deploy!

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/elite-fitness",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

### Option 4: Hosting thông thường (cPanel, etc)

1. Build production: `npm run build`
2. Upload toàn bộ thư mục `dist/` lên hosting
3. Point domain đến thư mục dist
4. Cấu hình .htaccess cho SPA routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 🎨 Customization

### Thay đổi màu sắc theme

Edit `src/styles/globals.css`:
```css
:root {
  --color-red: #dc2626; /* Màu đỏ chính */
  --color-black: #000000; /* Màu đen */
  --color-zinc: #27272a; /* Màu xám đậm */
}
```

### Thay đổi thông tin liên hệ

Edit `src/components/Contact.tsx` và `src/components/Footer.tsx`

### Thay đổi video YouTube

Edit `src/components/VideoModal.tsx` - thay đổi video ID trong iframe src

## 📝 Features Checklist

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Smooth scroll navigation
- ✅ Modal đăng ký thành viên
- ✅ Modal đăng nhập/tạo tài khoản
- ✅ Modal xem video tour
- ✅ Modal đặt chỗ lớp học
- ✅ Modal xem lịch đầy đủ
- ✅ Toast notifications
- ✅ Form validation
- ✅ SEO friendly
- ✅ Fast loading với code splitting

## 🔧 Troubleshooting

**Lỗi: Module not found**
```bash
npm install
```

**Lỗi: TypeScript errors**
```bash
# Ignore errors tạm thời
npm run build -- --mode production
```

**Images không hiển thị**
- Kiểm tra Unsplash API keys
- Hoặc thay bằng images local trong `/public/images/`

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Node.js version >= 18
2. npm version >= 9
3. All dependencies installed correctly
4. No TypeScript errors

## 📄 License

MIT License - Free to use for commercial projects

---

**Chúc bạn triển khai thành công! 💪🏋️**
