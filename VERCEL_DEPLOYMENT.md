# Vercel Deployment Guide

This guide provides detailed instructions for deploying the Black Market application to Vercel.

## Quick Start

### Prerequisites

- [Vercel Account](https://vercel.com/signup)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js v18 or higher

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/black-market&project-name=black-market&repository-name=black-market&build-command=npx%20nx%20build%20black-market&output-directory=dist/apps/black-market&install-command=npm%20install)

## Manual Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to Git:**

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. **Verify project structure:**

```
black-market/
├── apps/
│   └── black-market/
│       ├── src/
│       ├── public/
│       ├── package.json
│       ├── vite.config.ts
│       └── vercel.json
├── package.json
└── nx.json
```

### Step 2: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard:**

   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Repository:**

   - Select "Import Git Repository"
   - Choose your repository
   - Click "Import"

3. **Configure Project Settings:**

   ```
   Framework Preset: Vite
   Root Directory: apps/black-market
   Build Command: npx nx build black-market
   Output Directory: dist/apps/black-market
   Install Command: npm install
   ```

4. **Environment Variables:**
   Add the following environment variables:

   ```
   # Required for asset management
   VITE_COLLECTION_CHARACTER_ID=your_character_collection_id
   VITE_COLLECTION_EQUIPMENT_ID=your_equipment_collection_id
   VITE_COLLECTION_STONE_ID=your_stone_collection_id

   # Required for authentication and encryption
   VITE_PUBLIC_KEY=your_public_key
   VITE_PRIVATE_KEY=your_private_key
   VITE_CLIENT_ID=your_client_id

   # Required for game integration
   VITE_GAME_SERVER_URL=your_game_server_url

   # Optional - defaults to 'development'
   VITE_ENVIRONMENT=development
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Step 3: Verify Deployment

1. **Check Build Logs:**

   - Go to your project in Vercel dashboard
   - Click on the latest deployment
   - Review build logs for any errors

2. **Test Application:**
   - Visit your deployed URL
   - Test all major functionality
   - Check console for errors

## Advanced Configuration

### Custom Build Settings

If you need to customize the build process, you can modify the build settings in Vercel:

1. **Go to Project Settings:**

   - Navigate to your project in Vercel dashboard
   - Click "Settings" tab
   - Go to "General" section

2. **Update Build Settings:**
   ```
   Build Command: npx nx build black-market --prod
   Output Directory: dist/apps/black-market
   Install Command: npm ci
   ```

### Environment Variables Management

1. **Production Variables:**

   - Go to "Environment Variables" in project settings
   - Add variables for Production environment
   - Use `VITE_` prefix for client-side variables

2. **Preview Variables:**

   - Add variables for Preview environment
   - Useful for testing before production

3. **Development Variables:**
   - Add variables for Development environment
   - Used for local development

### Custom Domain Setup

1. **Add Domain:**

   - Go to "Domains" in project settings
   - Click "Add Domain"
   - Enter your domain name

2. **Configure DNS:**
   - Follow Vercel's DNS instructions
   - Update your domain's DNS records
   - Wait for DNS propagation

## Troubleshooting

### Common Issues

#### 🔴 "No Output Directory named 'black-market' found" Error

**Nguyên nhân:** Vercel không tìm thấy output directory đúng cho Nx monorepo.

**Giải pháp:**

1. **Cấu hình Vercel Dashboard:**

   - Vào Project Settings trong Vercel
   - Trong section "Build & Development Settings"
   - Đặt **Output Directory** thành: `dist/apps/black-market`
   - Đặt **Build Command** thành: `npx nx build black-market`
   - Đặt **Install Command** thành: `npm install`

2. **Hoặc sử dụng vercel.json:**

   - File `vercel.json` đã được cấu hình đúng
   - Đảm bảo Vercel đọc file này từ root directory

3. **Kiểm tra cấu hình:**
   ```json
   {
     "buildCommand": "npx nx build black-market",
     "outputDirectory": "dist/apps/black-market",
     "installCommand": "npm install",
     "framework": "vite"
   }
   ```

#### 🔴 "Cannot read properties of undefined (reading 'startsWith')" Error on Vercel

**Nguyên nhân:** Environment variables chưa được cấu hình trong Vercel dashboard.

**Giải pháp:**

1. **Truy cập Vercel Dashboard:**

   - Vào [vercel.com/dashboard](https://vercel.com/dashboard)
   - Chọn project của bạn
   - Click vào tab "Settings"

2. **Thêm Environment Variables:**

   - Scroll xuống section "Environment Variables"
   - Click "Add New"
   - Thêm từng biến một:

   ```
   Name: VITE_COLLECTION_CHARACTER_ID
   Value: your_character_collection_id
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_COLLECTION_EQUIPMENT_ID
   Value: your_equipment_collection_id
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_COLLECTION_STONE_ID
   Value: your_stone_collection_id
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_PUBLIC_KEY
   Value: your_public_key
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_PRIVATE_KEY
   Value: your_private_key
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_CLIENT_ID
   Value: your_client_id
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_GAME_SERVER_URL
   Value: your_game_server_url
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_ENVIRONMENT
   Value: production
   Environment: Production, Preview, Development
   ```

3. **Redeploy:**

   - Sau khi thêm xong tất cả environment variables
   - Click "Redeploy" hoặc push code mới để trigger build

#### 🔴 Build Size Warnings

**Cảnh báo:** "Some chunks are larger than 500 kB after minification"

**Giải pháp:**

1. **Tăng chunk size limit trong vite.config.ts:**

   ```typescript
   export default defineConfig({
     build: {
       chunkSizeWarningLimit: 1000, // Tăng từ 500 lên 1000
     },
   });
   ```

2. **Hoặc bỏ qua warning này** vì đây chỉ là cảnh báo, không phải lỗi.

#### 🔴 Node Version Issues

**Lỗi:** Node version không tương thích

**Giải pháp:**

1. **Cấu hình Node version trong Vercel:**

   - Vào Project Settings → General
   - Đặt Node.js Version thành 18.x hoặc cao hơn

2. **Hoặc thêm .nvmrc file:**
   ```
   18
   ```

### Performance Optimization

1. **Bundle Size:**

   - Build process tự động optimize bundle size
   - Kiểm tra build output trong Vercel dashboard

2. **Caching:**
   - Vercel tự động handle caching cho static assets
   - Cấu hình cache headers nếu cần

### Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Nx Documentation](https://nx.dev/)
- [React Documentation](https://react.dev/)
