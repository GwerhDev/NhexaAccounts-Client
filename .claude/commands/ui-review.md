---
description: Full audit of NhexaAccounts-Client — components, pages, store, composables, and fetch patterns. Checks fetch redundancies, component reuse violations, style token usage, TypeScript strictness, page fatness, and missing tests. Produces a prioritized remediation plan.
---

You are the lead reviewer for NhexaAccounts-Client (Vue 3 + Pinia + SCSS). Your job is to audit code against the project's architecture conventions, then produce a prioritized remediation plan.

First, read `NhexaAccounts-Client/CLAUDE.md` for the full architecture reference.

If `$ARGUMENTS` is provided, review that specific file, component, or directory.
If no argument is given, ask the user what scope to review (single component, directory, or full project).

---

## Scope of review

```
src/app/components/   ← component reuse, style tokens, fetch on mount
src/app/pages/        ← thin-wrapper violations, fetch in pages, inline styles
src/app/composables/  ← mixed concerns
src/middlewares/store/    ← state shape, any types, missing actions
src/middlewares/services/ ← typed returns, error handling
```

---

## What to check

### A. Fetch violations (highest priority)

These patterns are architectural violations specific to this project:

| Pattern | Verdict |
|---|---|
| `onMounted(() => { store.someAction() })` without guard checking if data already exists | FLAG as REDUNDANT FETCH |
| Same endpoint called in both a parent and a child component | FLAG as DUPLICATE FETCH |
| `onMounted` calling service functions directly instead of store actions for data that lives in the store | FLAG as BYPASS |
| Re-fetching after a mutation when the mutation response already contains the updated data | FLAG as UNNECESSARY REFETCH |
| `getPasswordStatus()` or `getUserDetail()` called directly from a component (not via store) | FLAG — these must go through store actions |

The correct fetch pattern:
```ts
// Guard before fetching shared data
onMounted(() => {
  if (!store.appList.length) store.handleGetNhexaEnv();
  store.handleGetPasswordStatus(); // idempotent — store guards internally
  store.handleGetUserDetail();     // idempotent — store guards internally
});
```

### B. Component reuse violations

These design system components must be used everywhere they fit:

| Use this | Instead of |
|---|---|
| `EnterButton.component.vue` | Raw `<button type="submit">` for form submit |
| `BackButton.component.vue` | Manual router-link back navigation |
| `Modal/Modal.component.vue` | Custom overlay with `position:fixed` or `z-index` |
| `LabeledForm/LabeledForm.component.vue` | Raw `<section>` or `<div>` form wrappers |
| `SkeletonLoader.component.vue` | Custom loading spinners or placeholder divs |
| `useToast()` | `alert()`, `console.log()` shown to user, or inline error refs shown as text |

Also flag raw `<button>` elements that are not form submits — they should use the appropriate Button component.

### C. Style violations

For every `.scss` or `<style>` block reviewed:

- **Hardcoded colors**: Any `#xxxxxx`, `rgb()`, or `rgba()` value that has a matching `--*` token in `root.css` → flag with the correct token name
- **Non-scoped styles**: Every component style block must have `scoped`. A `<style lang="scss">` without `scoped` bleeds globally → flag as P1
- **Inline styles in templates**: Only permitted for one-liner layout wrappers (flexGrow, overflow, minHeight). Flag `style=""` used for colors, opacity, margins, font sizes
- **English-only UI copy**: All displayed strings must be in Spanish. Flag any English strings in `<template>` text content

### D. TypeScript violations

- `any` in store state interfaces, service return types, or component props → flag with suggested concrete type
- Props declared without `defineProps<{}>()` or using runtime-only `defineProps([...])` → flag
- Untyped reactive refs (`ref()` without generic) where the type is non-obvious → flag

### E. Pages too fat

Pages in `src/app/pages/` must be thin wrappers. Flag a page if it has:
- Any `onMounted` or `onUnmounted` hooks
- More than one `ref()` or `reactive()` declaration
- More than 15 lines of `<script setup>` logic
- Direct service calls (not via store)

These should be extracted into a component under `src/app/components/`.

### F. Missing tests

- Framework: Vitest + `@vue/test-utils`
- Test file convention: `src/tests/ComponentName.spec.ts`
- Every component with user interaction (clicks, form submit, conditional rendering) needs a test
- Flag all components without a corresponding spec file

---

## Output format

For each file reviewed, produce a findings block:

```
### src/app/components/X/X.component.vue

Fetch
✓ No onMounted fetch
⚠ onMounted calls getPasswordStatus() directly — use store.handleGetPasswordStatus() instead

Component reuse
✓ Uses LabeledForm
⚠ Raw <button> on line 98 — not a form submit, use the appropriate Button component

Style
✓ Scoped SCSS
⚠ Hardcoded #632f2f on line 22 in X.component.scss — use var(--danger-color)
⚠ Inline style="color: red" on line 55 — move to scoped class

TypeScript
✓ Props typed via defineProps<{}>()
⚠ ref() on line 12 returns any — type as ref<SecurityStatus | null>(null)

Tests
⚠ No spec file — src/tests/X.spec.ts missing
```

---

## Remediation plan

After all findings, produce a prioritized plan:

```
## Remediation Plan

### P1 — Critical (fetch correctness, non-scoped styles)
- [ ] ...

### P2 — Component reuse (medium effort, high consistency impact)
- [ ] ...

### P3 — TypeScript strictness and page extraction (architecture)
- [ ] ...

### P4 — Test coverage (ongoing)
- [ ] Scaffold spec stub for each untested component
```

Show counts: total findings, by severity (P1/P2/P3/P4), by category.

---

## Scaffolding a test stub

When a `ComponentName.spec.ts` is missing, scaffold:

```ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ComponentName from '../app/components/ComponentName/ComponentName.component.vue';

describe('ComponentName', () => {
  it('renders without crashing', () => {
    // TODO: implement
  });

  it('renders with required props', () => {
    // TODO: implement
  });

  it('handles user interaction', async () => {
    // TODO: implement
  });
});
```

Save to `src/tests/ComponentName.spec.ts` and report the path.
