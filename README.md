# @envirobyte/ui

Shared UI component library for Envirobyte product repos.

Built with Headless UI + Tailwind CSS v4 + TypeScript.

## Quick Start

### Install

Add the `.npmrc` to your product repo root:

```
@envirobyte:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install:

```bash
npm install @envirobyte/ui
```

### Usage

Import the styles in your root layout:

```tsx
import "@envirobyte/ui/styles.css";
```

Wrap your app with the Provider:

```tsx
import { Provider } from "@envirobyte/ui";

export default function RootLayout({ children }) {
  return (
    <Provider>
      {children}
    </Provider>
  );
}
```

Use components:

```tsx
import { Button, Input, Card, Badge } from "@envirobyte/ui";

function MyPage() {
  return (
    <Card>
      <Input label="Name" placeholder="Enter name" />
      <Button>Submit</Button>
      <Badge variant="success">Active</Badge>
    </Card>
  );
}
```

## Local Development (Real-Time HMR)

To see UI changes instantly in a product repo without publishing:

### 1. Add the alias to your product repo's `next.config.mjs`

```js
import path from "path";

const nextConfig = {
  // ... your existing config ...
  transpilePackages: ["@envirobyte/ui"],
  webpack: (config) => {
    if (process.env.LOCAL_UI === "1") {
      config.resolve.alias["@envirobyte/ui"] = path.resolve(
        "../envirobyte-ui/src"
      );
    }
    return config;
  },
};

export default nextConfig;
```

### 2. Run with the flag

```bash
LOCAL_UI=1 npm run dev
```

Now any edits to `envirobyte-ui/src/` will hot-reload in your product app.

Without `LOCAL_UI`, it uses the published version from GitHub Packages.

## Development

```bash
npm install
npm run dev          # watch mode (tsup + postcss)
npm run storybook    # component explorer at localhost:6006
npm run build        # production build
npm run typecheck    # type check
```

## Publishing

Tag a release to publish via GitHub Actions:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The `publish.yml` workflow builds and publishes to GitHub Packages automatically.

## Components

### Primitives
- **Button** - variants: primary, secondary, danger, ghost, outline; sizes: sm, md, lg; loading state
- **Input** - label, error, hint, left/right icons
- **Modal** - Dialog wrapper with sizes and close button
- **Select** - Listbox dropdown with search-friendly options
- **Switch** - Toggle with label and description

### Generic
- **Badge** - variants: default, primary, success, warning, error, info
- **Card** / **CardHeader** - container with header, description, and action slot
- **EmptyState** - empty data placeholder with icon, title, description, action
- **LoadingSkeleton** - animated loading placeholders (lines or circle)

### Utilities
- **Provider** - theme wrapper (light/dark mode via next-themes)
- **cn()** - class name merger (clsx + tailwind-merge)
