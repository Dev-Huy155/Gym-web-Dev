# 🚀 LỆNH SETUP NHANH - Elite Fitness Xuân Diệu

## ⚡ COPY & PASTE - SETUP TRONG 2 PHÚT

### BƯỚC 1: Tạo thư mục và khởi tạo project

```bash
# Tạo thư mục project
mkdir elite-fitness-xuandieu
cd elite-fitness-xuandieu

# Khởi tạo npm project
npm init -y

# Cài tất cả dependencies (1 lệnh duy nhất)
npm install react@18 react-dom@18 lucide-react sonner@2.0.3 react-router motion clsx tailwind-merge class-variance-authority

# Cài dev dependencies
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss@4 postcss autoprefixer
```

---

### BƯỚC 2: Tạo các file config

#### 📄 package.json
Mở file `package.json` và thay thế toàn bộ bằng:

```json
{
  "name": "elite-fitness-xuandieu",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.454.0",
    "motion": "^11.15.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^7.1.1",
    "sonner": "^2.0.3",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2",
    "vite": "^6.0.3"
  }
}
```

#### 📄 vite.config.ts
Tạo file `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 📄 tsconfig.json
Tạo file `tsconfig.json`:

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
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 📄 tsconfig.node.json
Tạo file `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

#### 📄 index.html
Tạo file `index.html` ở ROOT (ngoài folder src):

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Elite Fitness Xuân Diệu - Phòng Tập Gym Cao Cấp Hà Nội</title>
    <meta name="description" content="Elite Fitness Xuân Diệu - Phòng tập gym hiện đại #1 tại Tây Hồ, Hà Nội. Trang thiết bị cao cấp, huấn luyện viên chuyên nghiệp." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### BƯỚC 3: Tạo cấu trúc thư mục

```bash
# Tạo các thư mục cần thiết
mkdir -p src/components/ui
mkdir -p src/components/figma
mkdir -p src/styles
mkdir -p public
```

---

### BƯỚC 4: Download source code

Bạn cần copy các file sau từ project hiện tại:

#### Folder `src/`
```
src/
├── main.tsx                          # Entry point (tạo mới - xem bên dưới)
├── App.tsx                           # ✅ Copy từ /App.tsx
├── styles/
│   └── globals.css                   # ✅ Copy từ /styles/globals.css
└── components/
    ├── Header.tsx                    # ✅ Copy từ /components/Header.tsx
    ├── Hero.tsx                      # ✅ Copy từ /components/Hero.tsx
    ├── Services.tsx                  # ✅ Copy từ /components/Services.tsx
    ├── Plans.tsx                     # ✅ Copy từ /components/Plans.tsx
    ├── Classes.tsx                   # ✅ Copy từ /components/Classes.tsx
    ├── Trainers.tsx                  # ✅ Copy từ /components/Trainers.tsx
    ├── Testimonials.tsx              # ✅ Copy từ /components/Testimonials.tsx
    ├── Contact.tsx                   # ✅ Copy từ /components/Contact.tsx
    ├── Footer.tsx                    # ✅ Copy từ /components/Footer.tsx
    ├── RegistrationModal.tsx         # ✅ Copy từ /components/RegistrationModal.tsx
    ├── LoginModal.tsx                # ✅ Copy từ /components/LoginModal.tsx
    ├── VideoModal.tsx                # ✅ Copy từ /components/VideoModal.tsx
    ├── BookingModal.tsx              # ✅ Copy từ /components/BookingModal.tsx
    ├── ScheduleModal.tsx             # ✅ Copy từ /components/ScheduleModal.tsx
    ├── figma/
    │   └── ImageWithFallback.tsx     # ✅ Copy từ /components/figma/ImageWithFallback.tsx
    └── ui/                           # ✅ Copy toàn bộ folder /components/ui/
        ├── button.tsx
        ├── input.tsx
        ├── ... (tất cả files UI)
```

#### 📄 src/main.tsx (TẠO MỚI)
Tạo file `src/main.tsx`:

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

---

### BƯỚC 5: Chạy project

```bash
# Cài lại dependencies (đảm bảo mọi thứ sync)
npm install

# Chạy development server
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

---

### BƯỚC 6: Build production

```bash
# Build
npm run build

# Preview build
npm run preview
```

Folder `dist/` sẽ chứa code production ready!

---

## 🎯 COPY FILES - HƯỚNG DẪN CHI TIẾT

### Cách 1: Copy thủ công
1. Tạo file mới trong thư mục tương ứng
2. Copy nội dung từ file gốc
3. Paste vào file mới

### Cách 2: Script tự động (Linux/Mac)

```bash
# Giả sử project cũ ở /path/to/old-project
OLD_PROJECT="/path/to/old-project"
NEW_PROJECT="./elite-fitness-xuandieu"

# Copy App.tsx
cp "$OLD_PROJECT/App.tsx" "$NEW_PROJECT/src/App.tsx"

# Copy components
cp -r "$OLD_PROJECT/components/"* "$NEW_PROJECT/src/components/"

# Copy styles
cp "$OLD_PROJECT/styles/globals.css" "$NEW_PROJECT/src/styles/globals.css"
```

### Cách 3: Download từ GitHub (nếu đã push)

```bash
# Clone repo
git clone https://github.com/YOUR-USERNAME/elite-fitness.git
cd elite-fitness
npm install
npm run dev
```

---

## 🔧 FIX COMMON ERRORS

### Error: "Cannot find module '@/...' "
```bash
# Install path nếu thiếu
npm install -D @types/node
```

Thêm vào `vite.config.ts`:
```typescript
import path from 'path';
// ... trong resolve:
alias: {
  '@': path.resolve(__dirname, './src'),
},
```

### Error: "React is not defined"
Thêm vào đầu file component:
```typescript
import React from 'react';
```

### Error: TypeScript errors
Tạm thời ignore:
```bash
# Build bỏ qua TS errors
npm run build -- --mode production
```

### Error: Tailwind classes không work
Kiểm tra `src/styles/globals.css` có import Tailwind:
```css
@import "tailwindcss";
```

---

## 📦 PACKAGE.JSON - ĐẦY ĐỦ

Nếu muốn chắc chắn, xóa `package.json` và tạo lại:

```json
{
  "name": "elite-fitness-xuandieu",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.454.0",
    "motion": "^11.15.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^7.1.1",
    "sonner": "^2.0.3",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2",
    "vite": "^6.0.3"
  }
}
```

Sau đó:
```bash
npm install
```

---

## ✅ FINAL CHECKLIST

- [ ] Node.js >= 18 installed
- [ ] npm install chạy thành công
- [ ] Tất cả files đã copy đúng thư mục
- [ ] `npm run dev` chạy không lỗi
- [ ] Website hiển thị đúng tại localhost:5173
- [ ] `npm run build` thành công
- [ ] Folder `dist/` được tạo

---

## 🚀 NEXT STEPS

1. ✅ Setup xong → Test website local
2. 📝 Thay đổi thông tin (địa chỉ, SĐT, email)
3. 🎨 Customize màu sắc/hình ảnh nếu cần
4. 🌐 Deploy lên Netlify/Vercel (xem QUICK_DEPLOY.md)
5. 🎯 Setup domain và SEO
6. 📊 Add Google Analytics

---

**💡 TIP:** Bookmark 3 files này để tham khảo:
- `DEPLOYMENT_GUIDE.md` - Hướng dẫn chi tiết
- `QUICK_DEPLOY.md` - Deploy nhanh
- `COMPLETE_FILE_LIST.md` - Danh sách files

**Chúc bạn thành công! 🎉**
