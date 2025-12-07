# AGENTS
1. Repo is Next.js 14 app-router with locale folders under app/[locale].
2. There are no Cursor or Copilot rule files; follow this doc.
3. Dev server: `npm run dev` (https, app dir).
4. Production build: `npm run build`; serve via `npm run start`.
5. Lint entire repo: `npm run lint`; autofix with `npm run lint:fix`.
6. ESLint (next/core-web-vitals + standard-with-typescript) enforces single quotes, semicolons, trailing commas.
7. Formatting: Prettier 3 via `npm run format` / `npm run format:check`; keep files ending with newline.
8. Tests are not configured, so there is no single-test command—add a test script before relying on automation.
9. Husky pre-commit runs lint-staged (eslint --fix + prettier) against staged TS/JS files.
10. Prefer the `@/*` alias for local imports; keep groups ordered node built-ins, third-party, then aliases.
11. Import types with the `import { type Foo }` pattern and define explicit prop types for public components.
12. Client components require the `'use client';` pragma and must keep hooks inside function bodies.
13. Export shared UI primitives as named exports, pages/layouts as default exports to match Next.js expectations.
14. Keep React state immutable, derive booleans via hooks, and always clean up effects (see components/navbar.tsx).
15. Guard browser APIs with `typeof window !== 'undefined'` (see lib/utils.ts) before accessing them.
16. Compose classes with Tailwind plus `cn` + `class-variance-authority`; prefer tokens from tailwind.config.js.
17. Use shadcn-inspired UI components from `components/ui/*` before writing bespoke elements.
18. For i18n, call `unstable_setRequestLocale(locale)` and `getTranslations('namespace')` in server routes, and wrap client trees with `LanguageProvider`.
19. Store copy under `i18n/messages/{locale}/index.json` with camelCase keys matching Next Intl namespaces.
