# 🚀 BẮT ĐẦU TẠI ĐÂY - Elite Fitness Xuân Diệu

## ⚠️ ĐỌC KỸ HƯỚNG DẪN NÀY TRƯỚC!

Chào bạn! Đây là dự án website **Elite Fitness Xuân Diệu** được xây dựng bằng **React + TypeScript**, KHÔNG PHẢI HTML/CSS/JS thuần túy.

---

## 📋 BẠN CẦN GÌ?

### ✅ Checklist trước khi bắt đầu:
- [ ] Có Node.js >= 18 (download tại: https://nodejs.org)
- [ ] Có npm (đi kèm với Node.js)
- [ ] Có Git (optional, để push lên GitHub)
- [ ] Có code editor (VS Code khuyến nghị)
- [ ] Có internet (để download dependencies)

### Kiểm tra version:
```bash
node --version  # Phải >= v18.0.0
npm --version   # Phải >= 9.0.0
```

---

## 🎯 BẠN MUỐN LÀM GÌ?

Chọn 1 trong các tùy chọn bên dưới:

### 📦 Option 1: Tôi đã có source code đầy đủ
👉 Đi đến [CHẠY PROJECT LOCAL](#-chạy-project-local)

### 🔧 Option 2: Tôi cần setup từ đầu
👉 Đọc [SETUP_COMMANDS.md](./SETUP_COMMANDS.md)

### 🌐 Option 3: Tôi chỉ muốn deploy lên web
👉 Đọc [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

### 📚 Option 4: Tôi muốn hiểu chi tiết
👉 Đọc [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🏃 CHẠY PROJECT LOCAL

### Bước 1: Vào thư mục project
```bash
cd elite-fitness-xuandieu
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```
⏱️ **Thời gian:** 2-5 phút (tùy tốc độ internet)

### Bước 3: Chạy development server
```bash
npm run dev
```

### Bước 4: Mở trình duyệt
Truy cập: **http://localhost:5173**

🎉 **Nếu thấy website → BẠN ĐÃ THÀNH CÔNG!**

---

## 🛠️ CÁC LỆNH CƠ BẢN

```bash
# Chạy development (auto reload khi code thay đổi)
npm run dev

# Build production (tạo folder dist)
npm run build

# Preview production build
npm run preview

# Xem production build tại http://localhost:4173
```

---

## 📁 CẤU TRÚC FILES QUAN TRỌNG

```
elite-fitness-xuandieu/
│
├── 📄 README.md              ⭐ Đọc để hiểu tổng quan project
├── 📄 START_HERE.md          ⭐ File này - bắt đầu tại đây
├── 📄 QUICK_DEPLOY.md        ⭐ Deploy nhanh 5 phút
├── 📄 DEPLOYMENT_GUIDE.md    📚 Hướng dẫn chi tiết
├── 📄 SETUP_COMMANDS.md      🛠️ Commands setup
├── 📄 COMPLETE_FILE_LIST.md  📋 Danh sách files
│
├── 📄 package.json           ⚙️ Dependencies & scripts
├── 📄 vite.config.ts         ⚙️ Vite configuration
├── 📄 tsconfig.json          ⚙️ TypeScript config
├── 📄 index.html             🌐 Entry HTML
│
├── 📁 src/                   💻 SOURCE CODE
│   ├── App.tsx              📱 Main app
│   ├── main.tsx             🚪 Entry point
│   ├── components/          🧩 All components (14 files)
│   └── styles/              🎨 CSS files
│
└── 📁 dist/                  📦 Production build (sau npm run build)
```

---

## ✏️ THAY ĐỔI NỘI DUNG

### 1️⃣ Thay đổi thông tin liên hệ

**File:** `src/components/Contact.tsx`
```typescript
// Dòng ~27-45
const contactInfo = [
  {
    title: 'Địa chỉ',
    content: '123 Đường Xuân Diệu...', // ← SỬA Ở ĐÂY
  },
  {
    title: 'Điện thoại',
    content: '(024) 1234 5678', // ← SỬA Ở ĐÂY
  },
  // ...
];
```

**File:** `src/components/Footer.tsx`
```typescript
// Cũng sửa ở Footer để thống nhất
```

### 2️⃣ Thay đổi giá gói tập

**File:** `src/components/Plans.tsx`
```typescript
// Dòng ~4-48
const plans = [
  {
    name: 'Basic',
    price: '599.000', // ← SỬA GIÁ
    features: [
      'Tập luyện không giới hạn', // ← SỬA FEATURES
      // ...
    ],
  },
  // ...
];
```

### 3️⃣ Thay video YouTube

**File:** `src/components/VideoModal.tsx`
```tsx
// Dòng ~25
<iframe
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE" // ← THAY ID
  // ...
></iframe>
```

Lấy VIDEO_ID từ URL YouTube:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                 ^^^^^^^^^^^
                                 Đây là ID
```

### 4️⃣ Thay đổi màu sắc theme

**File:** `src/styles/globals.css`
```css
/* Tìm class .bg-red-600 và thay đổi */
/* Hoặc search & replace toàn project */
```

---

## 🌐 DEPLOY LÊN WEB

### Cách nhanh nhất (5 phút):

#### 1. Build project
```bash
npm run build
```

#### 2. Upload lên Netlify Drop
- Vào: https://app.netlify.com/drop
- Kéo folder `dist` vào
- ✅ XONG!

**Kết quả:** Website live tại URL dạng `https://abc-xyz-123.netlify.app`

### Muốn URL đẹp hơn?
- Vào Netlify Dashboard
- Site settings → Change site name
- Hoặc add custom domain của bạn

Chi tiết: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

## 🐛 GẶP LỖI?

### Lỗi: "npm: command not found"
➡️ Chưa cài Node.js  
✅ Cài tại: https://nodejs.org

### Lỗi: "Cannot find module..."
```bash
# Xóa và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Port 5173 already in use"
```bash
# Kill process đang chạy
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill
```

### Website chạy nhưng trắng xóa
➡️ Kiểm tra console (F12) xem lỗi gì  
➡️ Thường do thiếu dependencies

```bash
npm install
```

### Images không hiển thị
➡️ Unsplash API có limit  
➡️ Refresh lại page hoặc đợi 1 phút

---

## 📞 CẦN HỖ TRỢ?

### 1. Kiểm tra files hướng dẫn
- ✅ README.md - Tổng quan
- ✅ QUICK_DEPLOY.md - Deploy nhanh
- ✅ DEPLOYMENT_GUIDE.md - Chi tiết
- ✅ SETUP_COMMANDS.md - Commands

### 2. Check common issues
```bash
# Node version
node --version  # >= 18

# Dependencies
npm list  # Xem packages đã cài

# Build test
npm run build  # Phải thành công
```

### 3. Google với keywords
```
"vite react typescript error [tên lỗi]"
"npm install failed windows/mac"
```

---

## ✅ CHECKLIST HOÀN THÀNH

### Development
- [ ] Cài Node.js và npm
- [ ] Clone/download source code
- [ ] `npm install` thành công
- [ ] `npm run dev` chạy được
- [ ] Website hiển thị tại localhost:5173
- [ ] Test tất cả chức năng (modals, forms, etc)

### Customization
- [ ] Thay đổi thông tin liên hệ
- [ ] Thay đổi giá gói tập (nếu cần)
- [ ] Thay video YouTube
- [ ] Thay logo/favicon (nếu có)
- [ ] Test lại sau khi sửa

### Production
- [ ] `npm run build` thành công
- [ ] Preview build: `npm run preview`
- [ ] Test trên preview (localhost:4173)
- [ ] Deploy lên hosting
- [ ] Test website live
- [ ] Setup domain (optional)
- [ ] Add Google Analytics (optional)

---

## 🎯 LỘ TRÌNH KHUYẾN NGHỊ

### Ngày 1: Setup & Chạy Local
1. ✅ Đọc file này
2. ✅ Cài Node.js
3. ✅ `npm install`
4. ✅ `npm run dev`
5. ✅ Test tất cả features

### Ngày 2: Customize
1. ✅ Thay thông tin liên hệ
2. ✅ Thay giá & features gói tập
3. ✅ Thay video
4. ✅ Test lại

### Ngày 3: Deploy
1. ✅ `npm run build`
2. ✅ Upload lên Netlify
3. ✅ Setup domain
4. ✅ Share với mọi người! 🎉

---

## 🚀 SẴN SÀNG?

### Bước tiếp theo:

**Nếu đã có source code đầy đủ:**
```bash
npm install
npm run dev
```

**Nếu chưa setup:**  
➡️ Đọc [SETUP_COMMANDS.md](./SETUP_COMMANDS.md)

**Muốn deploy ngay:**  
➡️ Đọc [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

## 💡 TIPS

1. **Backup code** trước khi sửa gì
2. **Test local** trước khi deploy
3. **Đọc error messages** kỹ (Google if needed)
4. **Dùng VS Code** - có IntelliSense tốt
5. **Save often** - Ctrl+S là bạn thân

---

## 🎉 GOOD LUCK!

Bạn đã sẵn sàng để bắt đầu!

**Questions?** Đọc lại file này hoặc check các files hướng dẫn khác.

**Ready to go?** Chạy `npm run dev` và bắt đầu customize!

---

Made with ❤️ for Elite Fitness Xuân Diệu

**⭐ Nếu project giúp ích, hãy star repo!**
