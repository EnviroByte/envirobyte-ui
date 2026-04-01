# @envirobyte/ui

Shared UI component library for EnviroByte product repos.

Built with Headless UI + Tailwind CSS v4 + TypeScript. Published to GitHub Packages.

## Quick Start

### 1. Configure the registry

Add a `.npmrc` file to your product repo root:

```
@envirobyte:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Set `NPM_TOKEN` in your environment (a GitHub PAT with `read:packages` scope):

```bash
export NPM_TOKEN=ghp_your_token_here
```

### 2. Install

```bash
npm install @envirobyte/ui
```

### 3. Import styles

In your root layout or global CSS, import the stylesheet:

```tsx
import "@envirobyte/ui/styles.css";
```

Or in CSS (Tailwind v4):

```css
@import "@envirobyte/ui/styles.css";
```

To include UI component classes in Tailwind's scan, add to your `globals.css`:

```css
@source "../../node_modules/@envirobyte/ui/dist";
```

### 4. Wrap with Provider

The `Provider` component sets up theming (light/dark mode via `next-themes`):

```tsx
import { Provider } from "@envirobyte/ui";

export default function RootLayout({ children }) {
  return (
    <Provider defaultTheme="light">
      {children}
    </Provider>
  );
}
```

### 5. Use components

```tsx
import { Button, Input, Card, Badge } from "@envirobyte/ui";

function MyPage() {
  return (
    <Card>
      <Input label="Name" placeholder="Enter name" />
      <Button variant="primary">Submit</Button>
      <Badge variant="success">Active</Badge>
    </Card>
  );
}
```

## Next.js Configuration

Add this to your `next.config.ts` for proper transpilation and optional local development:

```ts
import type { NextConfig } from "next";
import path from "path";

const uiPath = path.resolve(__dirname, "../envirobyte-ui");

const nextConfig: NextConfig = {
  transpilePackages: ["@envirobyte/ui"],
  webpack: (config) => {
    if (process.env.LOCAL_UI === "1") {
      config.resolve.alias["@envirobyte/ui"] = path.join(uiPath, "src");
    }
    return config;
  },
};

export default nextConfig;
```

## Components

### Provider & Utilities

| Export | Description |
|--------|-------------|
| `Provider` | Theme wrapper using `next-themes`. Props: `children`, `defaultTheme?: "light" \| "dark" \| "system"` |
| `cn()` | Class name merger (`clsx` + `tailwind-merge`). Usage: `cn("px-2", condition && "bg-red-500")` |

### Primitives

#### Button

Flexible button with variants, sizes, loading state, and icon support.

```tsx
import { Button } from "@envirobyte/ui";

<Button variant="primary" size="md" loading={false}>
  Save Changes
</Button>

<Button variant="outline" leftIcon={<PlusIcon />}>
  Add Item
</Button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "danger" \| "ghost" \| "outline"` | `"primary"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner and disable |
| `leftIcon` | `ReactNode` | — | Icon before label |
| `rightIcon` | `ReactNode` | — | Icon after label |

Also extends all native `<button>` HTML attributes.

#### Input

Text input with label, error/hint messages, and icon slots.

```tsx
import { Input } from "@envirobyte/ui";

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error="Invalid email address"
  hint="We'll never share your email"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text above the input |
| `error` | `string` | — | Error message (turns border red) |
| `hint` | `string` | — | Hint text below the input |
| `leftIcon` | `ReactNode` | — | Icon inside the input (left) |
| `rightIcon` | `ReactNode` | — | Icon inside the input (right) |

Also extends all native `<input>` HTML attributes.

#### Modal

Dialog overlay built on Headless UI's `Dialog`.

```tsx
import { Modal } from "@envirobyte/ui";

<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Edit Record" size="md">
  <p>Modal content here</p>
</Modal>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Whether the modal is visible |
| `onClose` | `() => void` | — | Called when the modal should close |
| `title` | `string` | — | Header title |
| `description` | `string` | — | Subtitle below title |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` | Modal width |
| `showCloseButton` | `boolean` | `true` | Show the X close button |

#### Select

Dropdown listbox built on Headless UI's `Listbox`.

```tsx
import { Select } from "@envirobyte/ui";
import type { SelectOption } from "@envirobyte/ui";

const options: SelectOption[] = [
  { value: "ab", label: "Alberta" },
  { value: "bc", label: "British Columbia" },
];

<Select value={province} onChange={setProvince} options={options} label="Province" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Currently selected value |
| `onChange` | `(value: string) => void` | — | Selection handler |
| `options` | `SelectOption[]` | — | Array of `{ value, label }` |
| `label` | `string` | — | Label text |
| `placeholder` | `string` | — | Placeholder when no selection |
| `error` | `string` | — | Error message |
| `disabled` | `boolean` | `false` | Disable the select |

#### Switch

Toggle switch with optional label and description.

```tsx
import { Switch } from "@envirobyte/ui";

<Switch checked={enabled} onChange={setEnabled} label="Enable notifications" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | — | Current state |
| `onChange` | `(checked: boolean) => void` | — | Toggle handler |
| `label` | `string` | — | Label text |
| `description` | `string` | — | Description below label |
| `size` | `"sm" \| "md"` | `"md"` | Switch size |
| `disabled` | `boolean` | `false` | Disable the switch |

### Generic Components

#### ActionBar

Toolbar with create, upload, and download action buttons.

```tsx
import { ActionBar } from "@envirobyte/ui";

<ActionBar
  onCreate={() => openModal()}
  onDownload={() => exportCSV()}
  createLabel="Add Equipment"
  showUpload={false}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCreate` | `() => void` | — | Create button handler |
| `onUpload` | `() => void` | — | Upload button handler |
| `onDownload` | `() => void` | — | Download button handler |
| `createLabel` | `string` | `"Create"` | Create button label |
| `showCreate` | `boolean` | `true` | Show create button |
| `showUpload` | `boolean` | `true` | Show upload button |
| `showDownload` | `boolean` | `true` | Show download button |

#### Badge

Small label for status, categories, or counts.

```tsx
import { Badge } from "@envirobyte/ui";

<Badge variant="success" size="sm">Active</Badge>
<Badge variant="error">Overdue</Badge>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "primary" \| "success" \| "warning" \| "error" \| "info"` | `"default"` | Color variant |
| `size` | `"sm" \| "md"` | `"md"` | Badge size |

#### Card / CardHeader

Container card with optional header.

```tsx
import { Card, CardHeader } from "@envirobyte/ui";

<Card padding="lg">
  <CardHeader title="Equipment List" description="All registered equipment" action={<Button>Export</Button>} />
  {/* content */}
</Card>
```

**Card props:** `padding?: "none" | "sm" | "md" | "lg"` + all `<div>` HTML attributes.

**CardHeader props:** `title: string`, `description?: string`, `action?: ReactNode`.

#### ComingSoon

Placeholder for features not yet implemented.

```tsx
import { ComingSoon } from "@envirobyte/ui";

<ComingSoon title="Analytics Dashboard" description="Coming in Q3 2026" />
```

#### DataTable

Sortable data table with optional restricted (blurred) mode.

```tsx
import { DataTable } from "@envirobyte/ui";
import type { DataTableColumn } from "@envirobyte/ui";

const columns: DataTableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "status", label: "Status", filterable: true },
  { key: "value", label: "Value", minWidth: "120px" },
];

<DataTable data={rows} columns={columns} onSort={(key, dir) => handleSort(key, dir)} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | — | Row data |
| `columns` | `DataTableColumn[]` | — | Column definitions |
| `onSort` | `(key: string, direction: string) => void` | — | Sort handler |
| `isRestricted` | `boolean` | `false` | Blur rows and show fake data |

#### DropdownMenu

Context menu built on Headless UI's `Menu`.

```tsx
import { DropdownMenu } from "@envirobyte/ui";

<DropdownMenu
  label="Actions"
  items={[
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete", danger: true },
  ]}
  onSelect={(value) => handleAction(value)}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactNode` | — | Custom trigger element |
| `label` | `string` | `"Options"` | Default trigger button label |
| `items` | `DropdownMenuItem[]` | — | Menu items: `{ label, value, icon?, disabled?, danger? }` |
| `onSelect` | `(value: string) => void` | — | Selection handler |
| `align` | `"left" \| "right"` | `"right"` | Menu alignment |

#### EmptyState

Placeholder for empty data views.

```tsx
import { EmptyState } from "@envirobyte/ui";

<EmptyState
  title="No equipment found"
  description="Add your first piece of equipment to get started."
  action={<Button>Add Equipment</Button>}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Icon above the title |
| `title` | `string` | — | Main heading |
| `description` | `string` | — | Supporting text |
| `action` | `ReactNode` | — | Action button or link |

#### ErrorState

Error display with optional retry action.

```tsx
import { ErrorState } from "@envirobyte/ui";

<ErrorState
  title="Failed to load data"
  description="Please check your connection and try again."
  actionLabel="Retry"
  onAction={() => refetch()}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Custom error icon |
| `title` | `string` | `"Something went wrong"` | Error heading |
| `description` | `string` | — | Error details |
| `actionLabel` | `string` | — | Retry button label (both `actionLabel` and `onAction` required to show button) |
| `onAction` | `() => void` | — | Retry handler |

#### FilterChips

Removable filter pill chips with a clear-all option.

```tsx
import { FilterChips } from "@envirobyte/ui";
import type { FilterChip } from "@envirobyte/ui";

const activeFilters: FilterChip[] = [
  { id: "1", label: "Alberta", category: "Province" },
  { id: "2", label: "Active", category: "Status" },
];

<FilterChips chips={activeFilters} onRemove={(chip) => removeFilter(chip)} onClearAll={() => clearAll()} />
```

#### FilterSelect

Compact dropdown for filter bars.

```tsx
import { FilterSelect } from "@envirobyte/ui";

<FilterSelect label="Year" options={["2024", "2025", "2026"]} value={year} onChange={setYear} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Filter label |
| `options` | `string[] \| FilterSelectOption[]` | — | Options (string or `{ value, label }`) |
| `value` | `string` | — | Selected value |
| `onChange` | `(value: string) => void` | — | Change handler |
| `placeholder` | `string` | — | Placeholder text |

#### InfoBanner

Contextual notification banner.

```tsx
import { InfoBanner } from "@envirobyte/ui";

<InfoBanner variant="warning">Scheduled maintenance tonight at 11 PM.</InfoBanner>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"info" \| "warning" \| "success" \| "error"` | `"info"` | Banner style |
| `icon` | `ReactNode` | — | Custom icon |
| `children` | `ReactNode` | — | Banner content |

#### LoadingSkeleton

Animated loading placeholders.

```tsx
import { LoadingSkeleton } from "@envirobyte/ui";

<LoadingSkeleton lines={5} />
<LoadingSkeleton circle />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lines` | `number` | `3` | Number of skeleton lines |
| `circle` | `boolean` | `false` | Show a circle skeleton instead of lines |

#### PageHeading

Page title bar with optional subtitle and action slot.

```tsx
import { PageHeading } from "@envirobyte/ui";

<PageHeading title="Equipment Inventory" subtitle="Manage all registered equipment" action={<Button>Export</Button>} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Page title |
| `subtitle` | `string` | — | Subtitle text |
| `action` | `ReactNode` | — | Action slot (buttons, etc.) |

#### Pagination

Page navigation with previous/next and page numbers.

```tsx
import { Pagination } from "@envirobyte/ui";

<Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | — | Active page |
| `totalPages` | `number` | — | Total number of pages |
| `onPageChange` | `(page: number) => void` | — | Page change handler |

#### PillButton

Small rounded toggle button, commonly used in filter bars.

```tsx
import { PillButton } from "@envirobyte/ui";

<PillButton active={isSelected} onClick={() => toggle()}>Category A</PillButton>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `boolean` | `false` | Active/selected state |

Also extends all native `<button>` HTML attributes.

#### SearchableSelect

Searchable dropdown with optional multi-select.

```tsx
import { SearchableSelect } from "@envirobyte/ui";

<SearchableSelect
  options={[
    { value: "1", label: "Facility Alpha" },
    { value: "2", label: "Facility Beta" },
  ]}
  value={selected}
  onChange={setSelected}
  label="Facility"
  multiple
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SearchableSelectOption[]` | — | `{ value, label }` options |
| `value` | `string \| string[]` | — | Selected value(s) |
| `onChange` | `(value) => void` | — | Change handler |
| `label` | `string` | — | Label text |
| `placeholder` | `string` | — | Placeholder when empty |
| `searchPlaceholder` | `string` | — | Placeholder in the search input |
| `multiple` | `boolean` | `false` | Enable multi-select |
| `error` | `string` | — | Error message |

#### SearchInput

Search text input with built-in search icon.

```tsx
import { SearchInput } from "@envirobyte/ui";

<SearchInput value={query} onChange={setQuery} placeholder="Search equipment..." />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Current search text |
| `onChange` | `(value: string) => void` | — | Input change handler |
| `label` | `string` | — | Label text |
| `placeholder` | `string` | — | Placeholder text |

#### SegmentedControl

Tab-like selector for switching between views.

```tsx
import { SegmentedControl } from "@envirobyte/ui";
import type { SegmentedOption } from "@envirobyte/ui";

const options: SegmentedOption<string>[] = [
  { value: "table", label: "Table View" },
  { value: "chart", label: "Chart View" },
];

<SegmentedControl options={options} value={view} onChange={setView} variant="pill" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SegmentedOption<T>[]` | — | `{ value, label }` options |
| `value` | `T` | — | Currently selected value |
| `onChange` | `(value: T) => void` | — | Selection handler |
| `variant` | `"pill" \| "rounded"` | `"pill"` | Visual style |

#### Spinner

Loading spinner with optional label.

```tsx
import { Spinner } from "@envirobyte/ui";

<Spinner label="Loading data..." />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Text below the spinner |

#### StatusBadge

Status indicator with optional dot.

```tsx
import { StatusBadge } from "@envirobyte/ui";

<StatusBadge status="Published" variant="success" showDot />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `string` | — | Status text |
| `variant` | `"success" \| "error" \| "warning" \| "info" \| "neutral"` | `"neutral"` | Color variant |
| `showDot` | `boolean` | `false` | Show colored dot indicator |

#### Tabs

Simple tab bar for switching content panels.

```tsx
import { Tabs } from "@envirobyte/ui";

<Tabs tabs={["Overview", "Details", "History"]} value={activeTab} onChange={setActiveTab} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `string[]` | — | Tab labels |
| `value` | `string` | — | Active tab |
| `onChange` | `(value: string) => void` | — | Tab change handler |

#### Tooltip

Hover tooltip for additional context.

```tsx
import { Tooltip } from "@envirobyte/ui";

<Tooltip content="Click to learn more" position="top">
  <span>Hover me</span>
</Tooltip>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | — | Tooltip text |
| `position` | `"top" \| "bottom"` | `"top"` | Tooltip position |
| `align` | `"center" \| "end"` | `"center"` | Horizontal alignment |
| `children` | `ReactNode` | — | Trigger element |

## Theming

The library ships with a design token system in Tailwind CSS v4:

- **Primary palette:** `--color-primary-50` through `--color-primary-900`
- **Semantic colors:** `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- **Grays, violets, sky, green, red, yellow:** Full scales
- **Typography:** `--font-inter`, responsive text scale (`--text-xs` through `--text-4xl`)
- **Shadows:** `--shadow-card`, `--shadow-dropdown`

Consumer apps can override these tokens in their own CSS to customize the theme.

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
git clone https://github.com/EnviroByte/envirobyte-ui.git
cd envirobyte-ui
npm install
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Watch mode — rebuilds JS (tsup) and CSS (PostCSS) on changes |
| `npm run storybook` | Component explorer at [http://localhost:6006](http://localhost:6006) |
| `npm run build` | Production build → `dist/` (ESM + CJS + types + CSS) |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |

### Build Output

The `dist/` directory contains:

| File | Description |
|------|-------------|
| `index.js` | ESM bundle |
| `index.cjs` | CommonJS bundle |
| `index.d.ts` | TypeScript declarations |
| `index.d.cts` | CTS declarations |
| `styles.css` | Compiled CSS with Tailwind utilities and design tokens |
| `*.map` | Source maps |

### Adding a New Component

1. Create a folder under `src/components/primitives/` or `src/components/generic/`
2. Add `ComponentName.tsx`, `index.ts`, and optionally `ComponentName.stories.tsx`
3. Export the component and its types from `src/index.ts`
4. Run `npm run build` to verify it compiles
5. Add Storybook stories for visual testing

## Local Development with Product Repos

To see UI changes instantly in a product repo (like `rim-fe`) without publishing:

1. Clone both repos side-by-side:

```
envirobyte/
├── rim-fe/
└── envirobyte-ui/
```

2. Start the UI dev server:

```bash
cd envirobyte-ui
npm run dev
```

3. In the product repo, start with `LOCAL_UI`:

```bash
cd ../rim-fe
LOCAL_UI=1 npm run dev
```

Edits to `envirobyte-ui/src/` will hot-reload in the product app.

## Publishing

Publishing is automated via GitHub Actions. To publish a new version:

1. Bump the version:

```bash
npm version patch   # 0.1.0 → 0.1.1
# or
npm version minor   # 0.1.0 → 0.2.0
# or
npm version major   # 0.1.0 → 1.0.0
```

2. Push the tag:

```bash
git push origin main --tags
```

The `publish.yml` workflow will automatically build, typecheck, and publish to GitHub Packages.

### Manual Publishing

If needed, you can publish manually:

```bash
export NODE_AUTH_TOKEN=ghp_your_token_here
npm run build
npm publish
```

## CI/CD

| Workflow | Trigger | Steps |
|----------|---------|-------|
| **CI** (`ci.yml`) | Push to `main`, PRs to `main` | `npm ci` → `typecheck` → `build` |
| **Publish** (`publish.yml`) | Push tags `v*` | `npm ci` → `build` → `typecheck` → `npm publish` to GitHub Packages |
