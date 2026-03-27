# 📦 CÁCH LẤY TOÀN BỘ SOURCE CODE

## 🎯 MỤC ĐÍCH

Hướng dẫn cách lấy **TẤT CẢ** files cần thiết để chạy website Elite Fitness Xuân Diệu trên máy của bạn hoặc deploy lên hosting.

---

## ⚠️ LƯU Ý QUAN TRỌNG

Dự án này là **React Application**, không phải HTML/CSS/JS thuần túy.  
Bạn cần:
- ✅ Node.js để chạy
- ✅ npm để cài packages
- ✅ Build process để tạo file production

---

## 📋 DANH SÁCH FILES CẦN CÓ

### ✅ Files trong project hiện tại

```
elite-fitness-xuandieu/
│
├── 📄 README.md                      ✅ Đã có
├── 📄 START_HERE.md                  ✅ Đã có
├── 📄 QUICK_DEPLOY.md                ✅ Đã có
├── 📄 DEPLOYMENT_GUIDE.md            ✅ Đã có
├── 📄 SETUP_COMMANDS.md              ✅ Đã có
├── 📄 COMPLETE_FILE_LIST.md          ✅ Đã có
├── 📄 .gitignore                     ✅ Đã có
│
├── 📁 src/
│   ├── 📄 App.tsx                   ✅ Đã có
│   ├── 📄 components/               ✅ Đã có (14 components)
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Plans.tsx
│   │   ├── Classes.tsx
│   │   ├── Trainers.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── RegistrationModal.tsx
│   │   ├── LoginModal.tsx
│   │   ├── VideoModal.tsx
│   │   ├── BookingModal.tsx
│   │   ├── ScheduleModal.tsx
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/                      ✅ Đã có (40+ files)
│   └── 📁 styles/
│       └── globals.css              ✅ Đã có
│
└── 📁 Các files cần TẠO MỚI:
    ├── index.html                    ❌ Cần tạo
    ├── package.json                  ❌ Cần tạo  
    ├── vite.config.ts                ❌ Cần tạo
    ├── tsconfig.json                 ❌ Cần tạo
    ├── tsconfig.node.json            ❌ Cần tạo
    └── src/main.tsx                  ❌ Cần tạo
```

---

## 🚀 CÁCH 1: TẢI TOÀN BỘ PROJECT (KHUYẾN NGHỊ)

### Option A: Từ GitHub (Nếu đã push)

```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/elite-fitness-xuandieu.git
cd elite-fitness-xuandieu

# Cài dependencies
npm install

# Chạy
npm run dev
```

### Option B: Download ZIP

1. Vào GitHub repository
2. Click nút "Code" màu xanh
3. Click "Download ZIP"
4. Giải nén
5. Mở terminal trong folder
6. Chạy:
```bash
npm install
npm run dev
```

---

## 🛠️ CÁCH 2: TẠO PROJECT MỚI VÀ COPY FILES

### Bước 1: Tạo project mới

```bash
# Tạo folder
mkdir elite-fitness-xuandieu
cd elite-fitness-xuandieu

# Init npm
npm init -y
```

### Bước 2: Copy files config

Tạo các files sau với nội dung tương ứng:

#### 📄 package.json
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

#### 📄 vite.config.ts
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
  "include": ["src"]
}
```

#### 📄 tsconfig.node.json
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
```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Elite Fitness Xuân Diệu - Phòng Tập Gym Cao Cấp Hà Nội</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Bước 3: Tạo cấu trúc thư mục

```bash
mkdir -p src/components/ui
mkdir -p src/components/figma
mkdir -p src/styles
```

### Bước 4: Copy source code

#### 📄 src/main.tsx (TẠO MỚI)
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

#### Copy các files còn lại
```
✅ Copy /App.tsx → src/App.tsx
✅ Copy /components/* → src/components/
✅ Copy /styles/globals.css → src/styles/globals.css
```

### Bước 5: Chạy project

```bash
npm run dev
```

---

## 📤 CÁCH 3: EXPORT RA ZIP ĐỂ CHIA SẺ

### Nếu bạn muốn gửi cho người khác:

#### Option A: Với Git
```bash
# Tạo archive không bao gồm node_modules
git archive -o elite-fitness-xuandieu.zip HEAD
```

#### Option B: Manual

1. **KHÔNG** nén folder `node_modules/`
2. **KHÔNG** nén folder `dist/`
3. Chỉ nén:
   - Tất cả files .ts, .tsx, .css
   - package.json
   - index.html
   - Config files
   - README files

4. Người nhận sẽ:
```bash
# Giải nén
unzip elite-fitness-xuandieu.zip
cd elite-fitness-xuandieu

# Cài dependencies
npm install

# Chạy
npm run dev
```

---

## 💻 CÁCH 4: CHỈ LẤY BUILD FILES (CHO HOSTING)

Nếu bạn chỉ muốn files HTML/CSS/JS để upload lên hosting:

```bash
# Build production
npm run build

# Folder dist/ chứa tất cả files cần thiết:
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # Tất cả JS code
│   └── index-[hash].css   # Tất cả CSS
```

**Upload chỉ folder `dist/` lên hosting**

### Lưu ý với cPanel/hosting thường:

Thêm file `.htaccess` vào trong folder `dist/`:

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

---

## 🗂️ STRUCTURE OVERVIEW

### Files BẮT BUỘC (11 files)
```
1. index.html
2. package.json
3. vite.config.ts
4. tsconfig.json
5. tsconfig.node.json
6. src/main.tsx
7. src/App.tsx
8. src/styles/globals.css
9. src/components/figma/ImageWithFallback.tsx
10-49. src/components/*.tsx (14 components chính)
50-90. src/components/ui/*.tsx (40+ UI components)
```

### Files TÙY CHỌN (docs)
```
- README.md
- START_HERE.md
- QUICK_DEPLOY.md
- DEPLOYMENT_GUIDE.md
- SETUP_COMMANDS.md
- COMPLETE_FILE_LIST.md
- .gitignore
```

---

## ✅ CHECKLIST ĐỂ VERIFY

Sau khi có đầy đủ files, kiểm tra:

```bash
# 1. Check package.json exists
ls package.json

# 2. Check src structure
ls src/
# Should see: App.tsx, main.tsx, components/, styles/

# 3. Install dependencies
npm install
# Should install ~200-300 packages

# 4. Check if can run
npm run dev
# Should start on http://localhost:5173

# 5. Check if can build
npm run build
# Should create dist/ folder
```

---

## 🎯 RECOMMENDED WORKFLOW

### Cho Developer:
```bash
1. Clone from GitHub (CÁCH 1)
2. npm install
3. npm run dev
4. Code & customize
5. git commit & push
```

### Cho Non-Developer (chỉ cần deploy):
```bash
1. Clone from GitHub
2. npm install
3. npm run build
4. Upload dist/ folder lên hosting
```

### Cho Client (người dùng cuối):
```
Không cần source code
→ Chỉ cần URL website sau khi deploy
```

---

## 📞 CẦN HỖ TRỢ?

### Không biết Git?
➡️ Download ZIP từ GitHub  
➡️ Hoặc dùng GitHub Desktop

### Không có Node.js?
➡️ Download: https://nodejs.org  
➡️ Chọn LTS version

### npm install lỗi?
```bash
# Clear cache
npm cache clean --force

# Delete và reinstall
rm -rf node_modules package-lock.json
npm install
```

### Chỉ cần files HTML/CSS/JS?
➡️ Không thể! Phải build trước:
```bash
npm run build
# Lấy files trong dist/
```

---

## 🎉 TÓM TẮT

**Cách nhanh nhất:**
1. Clone from GitHub
2. `npm install`
3. `npm run dev`

**Cách deploy:**
1. `npm run build`
2. Upload `dist/` folder

**Cách share:**
1. Push lên GitHub
2. Share link repo

---

## 📚 XEM THÊM

- [START_HERE.md](./START_HERE.md) - Bắt đầu sử dụng
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Deploy nhanh
- [SETUP_COMMANDS.md](./SETUP_COMMANDS.md) - Commands chi tiết

---

**Chúc bạn thành công! 🚀**
