# GitHub Pages Deployment Guide

## Cách deploy lên GitHub Pages

### Bước 1: Chuẩn bị repository

1. Đảm bảo code đã được push lên GitHub repository
2. Repository phải là public hoặc bạn phải có GitHub Pro để sử dụng GitHub Pages với private repository

### Bước 2: Cấu hình GitHub Pages

1. Vào repository trên GitHub
2. Chọn tab **Settings**
3. Cuộn xuống phần **Pages** trong sidebar bên trái
4. Trong **Source**, chọn **GitHub Actions**
5. Lưu lại cấu hình

### Bước 3: Push code để trigger deployment

1. Commit và push code lên branch `main` hoặc `master`:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

2. GitHub Actions sẽ tự động build và deploy ứng dụng

### Bước 4: Kiểm tra deployment

1. Vào tab **Actions** trên GitHub để theo dõi quá trình build
2. Sau khi build thành công, vào **Settings > Pages** để lấy URL của trang web
3. URL thường có dạng: `https://[username].github.io/black-market/`

## Cấu hình đã được thêm

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)

- Tự động build khi push code lên main/master branch
- Sử dụng Node.js 18
- Build ứng dụng với `npm run build`
- Deploy lên GitHub Pages

### 2. Vite Configuration

- Cập nhật `base` path để phù hợp với GitHub Pages
- Sử dụng `/black-market/` cho production build

## Troubleshooting

### Lỗi thường gặp:

1. **Build failed**: Kiểm tra logs trong GitHub Actions
2. **404 errors**: Đảm bảo base path đã được cấu hình đúng
3. **Assets not loading**: Kiểm tra đường dẫn trong code có sử dụng relative paths

### Kiểm tra local build:

```bash
# Build production
npm run build

# Preview build
npx nx preview black-market
```

## Lưu ý

- GitHub Pages chỉ hỗ trợ static files
- Đảm bảo tất cả API calls sử dụng HTTPS
- Nếu sử dụng client-side routing, cần cấu hình 404.html redirect
