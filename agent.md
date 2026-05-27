# Agent Guidelines
 
## Project Overview
 
Frontend-only Next.js application, feature-based architecture. No backend logic.
 
## Tech Stack
 
- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict)
- **Forms**: React Hook Form (RHF)
- **Validation**: Zod
- **Styling**: (match existing project setup)
---
 
## Project Structure
 
Feature-based. Each feature is self-contained.
 
```
src/
├── app/                  # Next.js App Router pages and layouts
│   └── (routes)/
├── features/             # One folder per feature
│   └── [feature-name]/
│       ├── components/   # UI components scoped to the feature
│       ├── hooks/        # Custom hooks
│       ├── schemas/      # Zod schemas
│       └── types/     # Public API of the feature
├── components/           # Shared/global UI components
├── lib/                  # Shared utilities
└── types/                # Global types
```
 
---
 
## Rules
 
### TypeScript
 
- Enable `strict: true` in `tsconfig.json` — never disable it.
- No `any`. Use `unknown` and narrow where needed.
- Export types/interfaces from `types/` within the feature.
- Prefer `type` over `interface` unless extending.
### Next.js
 
- Use **App Router** only (`app/` directory).
- Mark components as `"use client"` only when they use hooks or browser APIs.
- Keep pages thin — delegate logic to feature components and hooks.
- No API routes — this is frontend only.
### Forms (RHF + Zod)
 
- Define the Zod schema first, then infer the form type:
```ts
// features/[feature]/schemas/example.schema.ts
import { z } from "zod";
 
export const exampleSchema = z.object({
  name: z.string().min(1, "Required"),
});
 
export type ExampleFormValues = z.infer<typeof exampleSchema>;
```
 
- Always use `zodResolver` from `@hookform/resolvers/zod`:
```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exampleSchema, type ExampleFormValues } from "../schemas/example.schema";
 
const form = useForm<ExampleFormValues>({
  resolver: zodResolver(exampleSchema),
  defaultValues: { name: "" },
});
```
 
- One schema per form, kept inside `features/[feature]/schemas/`.
- Never validate manually — always go through Zod.
### Components
 
- One component per file.
- File name matches component name (PascalCase).
- Props must be typed explicitly — no implicit `any`.
- Prefer composition over prop drilling.
### Naming
 
| Thing | Convention |
|---|---|
| Files/folders | `kebab-case` |
| Components | `PascalCase` |
| Hooks | `camelCase`, prefix `use` |
| Schemas | `camelCase`, suffix `.schema.ts` |
| Types | `PascalCase` |
 
---
 
## What NOT to do
 
- No `any` types.
- No inline validation logic — use Zod schemas.
- No business logic inside `app/` pages.
- No mixing server and client concerns in the same component.
- Do not create API routes or server actions — frontend only.