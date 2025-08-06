# Black Market

This monorepo contains a demo application showcasing Futureverse SDKs and tools for asset management and trading. The main application is a React Vite-based "Black Market" that demonstrates asset registration, viewing, and trading capabilities.

## Project Structure

- **`apps/black-market/`** - Main React Vite application
- **`libs/ui-shared/`** - Shared UI components library
- **`tools/`** - Development and utility scripts

## Features

The Black Market application demonstrates:

- **Asset Management**: View and manage digital assets using Futureverse Asset Register
- **Authentication**: Integration with Futureverse Auth for user authentication
- **Asset Trading**: Interactive asset viewing and trading interface
- **Game Integration**: Connect with game servers for asset synchronization
- **Transaction Management**: Real-time transaction details and gas estimation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository:**

```bash
git clone <your-repository-url>
cd black-market
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

### Environment Setup

Create a `.env` file in the `apps/black-market/` directory with the following variables:

```env
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

**Important Notes:**

- All environment variables starting with `VITE_` are required for the application to function properly
- If any required environment variable is missing, the application will show errors during build
- Make sure to add these environment variables to your Vercel deployment settings
- The `VITE_PRIVATE_KEY` should be a valid PEM-formatted private key
- The `VITE_PUBLIC_KEY` should be a valid PEM-formatted public key

### Development

**Start the development server:**

```bash
npm run start
# or
npx nx serve black-market
```

**Build for production:**

```bash
npm run build
# or
npx nx build black-market
```

## Deployment to Vercel

### Prerequisites for Vercel Deployment

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm i -g vercel`
3. **Git Repository**: Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository:**

   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Select the repository containing this project

2. **Configure Project Settings:**

   - **Framework Preset**: Select "Vite"
   - **Root Directory**: Leave as default (or set to `apps/black-market` if needed)
   - **Build Command**: `npx nx build black-market`
   - **Output Directory**: `dist/apps/black-market`
   - **Install Command**: `npm install`

3. **Environment Variables:**

   - Add the same environment variables from your `.env` file:
     - `VITE_COLLECTION_CHARACTER_ID`
     - `VITE_COLLECTION_EQUIPMENT_ID`
     - `VITE_COLLECTION_STONE_ID`
     - `VITE_PUBLIC_KEY`
     - `VITE_GAME_SERVER_URL`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Login to Vercel:**

```bash
vercel login
```

3. **Deploy from project root:**

```bash
vercel
```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `black-market` (or your preferred name)
   - In which directory is your code located: `./apps/black-market`
   - Want to override the settings: `N`

### Method 3: Deploy via GitHub Integration

1. **Push to GitHub:**

   - Ensure your code is pushed to a GitHub repository

2. **Connect to Vercel:**

   - Go to Vercel dashboard
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure Build Settings:**
   - Framework: Vite
   - Build Command: `npx nx build black-market`
   - Output Directory: `dist/apps/black-market`
   - Root Directory: `apps/black-market`

### Vercel Configuration

The project includes a `vercel.json` file in `apps/black-market/` with the following configuration:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration ensures that all routes are properly handled by the React Router.

### Build Optimization

The project is configured for optimal Vercel deployment:

- **Build Output**: `dist/apps/black-market`
- **Static Assets**: Automatically optimized by Vite
- **Source Maps**: Enabled for debugging
- **Compression**: Automatic gzip compression by Vercel

### Environment Variables in Vercel

1. **Go to Project Settings:**

   - Navigate to your project in Vercel dashboard
   - Click "Settings" tab
   - Go to "Environment Variables" section

2. **Add Variables:**

   - Add each environment variable from your `.env` file
   - Set the appropriate environment (Production, Preview, Development)

3. **Redeploy:**
   - After adding environment variables, redeploy your application

### Custom Domain (Optional)

1. **Add Domain:**

   - Go to project settings in Vercel
   - Click "Domains" section
   - Add your custom domain

2. **Configure DNS:**
   - Follow Vercel's DNS configuration instructions
   - Update your domain's DNS records

## Available Scripts

- `npm run start` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint for code quality checks
- `npx nx serve black-market` - Start development server (alternative)
- `npx nx build black-market` - Build for production (alternative)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **UI Framework**: Custom components with shared library
- **Blockchain**: Futureverse SDK integration
- **Authentication**: Futureverse Auth
- **Asset Management**: Futureverse Asset Register
- **Deployment**: Vercel

## Architecture

The application uses a monorepo structure with Nx for efficient development:

- **Apps**: Contains the main black-market application
- **Libs**: Shared UI components and utilities
- **Tools**: Development utilities and scripts

## Troubleshooting

### Common Build Issues

#### ✅ "Cannot read properties of undefined (reading 'startsWith')" Error - RESOLVED

**Status:** ✅ **FIXED** - This error has been resolved in the latest version.

**What was fixed:**

- Added proper null checks for all environment variables
- Implemented safe handling of `VITE_PRIVATE_KEY`, `VITE_PUBLIC_KEY`, and other environment variables
- Added conditional rendering and error handling for missing environment variables

**If you still encounter this error:**

1. **Check Environment Variables:**

   - Ensure all required environment variables are set in your `.env` file
   - Verify that all `VITE_` prefixed variables are properly configured
   - Check that the variables are not empty or undefined

2. **Required Environment Variables:**

   ```env
   VITE_COLLECTION_CHARACTER_ID=your_character_collection_id
   VITE_COLLECTION_EQUIPMENT_ID=your_equipment_collection_id
   VITE_COLLECTION_STONE_ID=your_stone_collection_id
   VITE_PUBLIC_KEY=your_public_key
   VITE_PRIVATE_KEY=your_private_key
   VITE_CLIENT_ID=your_client_id
   VITE_GAME_SERVER_URL=your_game_server_url
   VITE_ENVIRONMENT=development
   ```

3. **For Vercel Deployment:**
   - **QUAN TRỌNG:** Environment variables phải được cấu hình trong Vercel dashboard
   - Vào [vercel.com/dashboard](https://vercel.com/dashboard) → Project Settings → Environment Variables
   - Thêm tất cả biến môi trường với prefix `VITE_`
   - Chọn environment: Production, Preview, Development
   - Redeploy sau khi thêm environment variables

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

#### Node Version Issues

1. **Node Version:**

   - Ensure you're using Node.js v18 or higher
   - Check with: `node --version`

2. **Dependencies:**

   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

3. **Environment Variables:**

   - Ensure all required environment variables are set in Vercel
   - Check that variable names start with `VITE_`

4. **Build Failures:**
   - Check Vercel build logs for specific error messages
   - Ensure all dependencies are properly installed

### Performance Optimization

1. **Bundle Size:**

   - The build process automatically optimizes bundle size
   - Check build output in Vercel dashboard

2. **Caching:**
   - Vercel automatically handles caching for static assets
   - Configure cache headers if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details
