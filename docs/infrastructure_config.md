# Project Infrastructure Setup: Phase 2

## 1. New Monorepo Initialization

### 1.1 Git Initialization
```bash
# Initialize new repository
git init
git add .
git commit -m "chore: initial commit - Phase 1 Documentation"
# (Remote setup would happen here)
# git remote add origin https://github.com/your-org/ai-product-platform.git
# git push -u origin main
```

### 1.2 Next.js 15 Application Initialization
We will use `pnpm` as the package manager and initialize the application with Turbopack and the App Router.

```bash
# From the root of the project
npx create-next-app@latest apps/web \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir false \
  --import-alias "@/*" \
  --turbopack \
  --use-pnpm
```

---

## 2. Core Configuration Files

### 2.1 `next.config.mjs`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Optimizations for Next.js 15
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Future-proofing for 2026 best practices
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow various vendor product images
      },
    ],
  },
};

export default nextConfig;
```

### 2.2 `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.3 `.eslintrc.json`
```json
{
  "extends": ["next/core-web-vitals", "next/typescript", "prettier"]
}
```

### 2.4 `.prettierrc`
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### 2.5 `.env.example`
```env
# PostgreSQL (pgvector)
DATABASE_URL="postgresql://postgres:password@localhost:5432/recommendation_db"

# Neo4j Knowledge Graph
NEO4J_URI="bolt://localhost:7687"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="password"

# AI & LLM
OPENAI_API_KEY="sk-..."
# VERCEL_AI_SDK_KEY (if using enterprise features)

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Deployment & Security
AUTH_SECRET="your-32-char-auth-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
