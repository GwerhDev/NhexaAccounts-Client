# NhexaAccounts-Client — Architecture Reference

## Tech Stack

- Vue 3.3 + TypeScript 5, Vite 4
- Pinia 2 (state management)
- Vue Router 4 (flat route structure with auth guards)
- Axios (`src/middlewares/services/api.ts`, `withCredentials: true`, baseURL from `VITE_API_URL`)
- SASS (scoped per component — `<style scoped lang="scss" src="./Component.component.scss" />`)
- FontAwesome 6 (`@fortawesome/vue-fontawesome`, globally registered as `font-awesome-icon`)
- Vitest + `@vue/test-utils` (tests in `src/tests/`)

---

## Design System

CSS variables defined in `src/styles/root.css`. Utility classes in `src/styles/style.css`.

### Colors

| Variable | Value | Use |
|---|---|---|
| `--primary-color` | #5086b0 | Accent, primary buttons |
| `--primary-hover-color` | #699fb8 | Hover on accent elements |
| `--primary-background-color` | #416476bc | Gradient background |
| `--secondary-background-color` | #171717 | Dark base background |
| `--nhexa-white` | rgb(229, 229, 229) | High-emphasis text |
| `--danger-color` | #632f2f | Error backgrounds |
| `--danger-color-accent` | #e48484 | Error text, danger icons |
| `--components-background` | #2d3337ba | Card / panel (semi-transparent) |
| `--components-background-solid` | #2d3337 | Card (opaque) |
| `--components-background-alt` | #2d33378f | Alternate panel |
| `--button-primary-color` | #5086b0 | Primary button background |
| `--button-primary-hover-color` | #699fb8 | Primary button hover |
| `--menu-hover-color` | #699fb8b6 | Menu item hover |

No `--space-*` or `--size-*` spacing tokens — use raw values or the utility spacing classes from `style.css`.

### Utility classes (from `style.css`)

Spacing: `.gap-1`, `.gap-2`, `.pl-1`–`.pl-5`, `.pr-1`–`.pr-5`, `.pt-1`–`.pt-5`, `.pb-1`–`.pb-5`, `.ml-1`–`.ml-5`, `.mr-1`–`.mr-5`, `.mt-1`–`.mt-5`, `.mb-1`–`.mb-5`

Layout: `.flex`, `.flex-col`, `.d-flex`, `.fd-col`, `.just-cent`, `.align-cent`, `.items-center`, `.justify-center`, `.text-center`, `.w-100`, `.w-full`, `.w-auto`, `.h-auto`, `.mw-650`, `.mw-460`

Containers: `.viewport-container`, `.app-container`, `.main-container`, `.section-container`, `.inner-container`, `.card-container`, `.card-column`, `.view-lateral-bar`, `.router-view`

Typography: `.font-bold`, `.color-white`, `.no-wrap`

Forms: `.ul-form`, `.li-form`, `.input-form`, `.label-input`, `.separator`, `.vertical-separator`

Buttons: `.principal-button`, `.secondary-button`

---

## Directory Structure

```
src/
  app/
    components/   ← ComponentName/ComponentName.component.vue + ComponentName.component.scss
    composables/  ← useXxx.ts
    layouts/      ← XxxLayout/XxxLayout.layout.vue (+ .scss): the shell a group of routes renders in
    pages/        ← XxxPage.vue (thin wrappers, no fetch, no state)
    routes/       ← index.ts (router + auth guards)
  middlewares/
    services/     ← api.ts (axios instance), index.ts (all endpoints), token.ts
    store/        ← index.ts (useStore, Pinia)
    misc/         ← const.ts (env vars from import.meta.env), errors.ts
  styles/         ← root.css (tokens), style.css (utilities)
  utils/          ← upToTop.ts, capitalizeFirstLetter.ts, cssSelector.ts
  helpers/        ← menu.js
  tests/          ← ComponentName.spec.ts
```

---

## Component Patterns

### Naming

- Components: `ComponentName.component.vue` + `ComponentName.component.scss` (scoped SCSS)
- Pages: `XxxPage.vue` — thin wrappers, delegate all logic to components
- Composables: `useXxx.ts` in `src/app/composables/`
- No CSS Modules — all component styles use `<style scoped lang="scss">`

### Reusable components to use

| Use this | Instead of |
|---|---|
| `src/app/components/Buttons/Enter/EnterButton.component.vue` | Raw `<button type="submit">` |
| `src/app/components/Buttons/Back/BackButton.component.vue` | Raw `<a>` or router-link back |
| `src/app/components/Modal/Modal.component.vue` | Custom overlay with `position:fixed` |
| `src/app/components/LabeledForm/LabeledForm.component.vue` | Raw form sections |
| `src/app/components/Loaders/SkeletonLoader.component.vue` | Custom spinners or loading divs |
| `useToast()` from `src/app/composables/useToast.ts` | `alert()` or inline message refs |

### Modal pattern

```vue
<Modal title="Confirmar" confirm-label="Eliminar" :danger="true" @confirm="handleConfirm" @cancel="isOpen = false">
  <p>¿Estás seguro?</p>
</Modal>
```

Open/close via local `ref<boolean>` with `v-if`. Uses Teleport to body automatically.

### Toast

```ts
const toast = useToast();
toast.success('Cambios guardados.');
toast.error('No se pudo completar la operación.');
toast.info('Información.');
```

---

## Pinia Store

Single store `useStore()` at `src/middlewares/store/index.ts`.

**State:**
```typescript
{
  currentUser: { logged: boolean; userData?: { id, username, email, isVerified, role, profilePic } },
  appList: EnvCategory[],
  passwordStatus: { passwordSetAt: string | null; twoFactorEnabled: boolean } | null,
  userDetail: { userData: ...; accountDetail: ... } | null,
  menuList: any[],
  authReady: boolean,
}
```

**Actions:**
- `logout()` — clears token and resets `currentUser`
- `handleRegister(data)` — returns redirect path
- `handleLogin(data, callback)` — handles MFA flow, returns result or redirect
- `handleUserData(callback?, router?)` — fetches user, sets `authReady = true`
- `handleUpdateUserData(formData, id)` — updates account data, sets `currentUser`
- `handleGetNhexaEnv()` — fetches app list, stores in `appList`
- `handleGetPasswordStatus()` — fetches once (guards if `passwordStatus !== null`)
- `handleGetUserDetail()` — fetches once (guards if `userDetail !== null`)

---

## Fetch Patterns

- **`handleGetNhexaEnv()`** must only be called with guard: `if (!store.appList.length) store.handleGetNhexaEnv()`
- **`handleGetPasswordStatus()`** is idempotent — internally guards on `passwordStatus !== null`
- **`handleGetUserDetail()`** is idempotent — internally guards on `userDetail !== null`
- After a mutation that returns updated data, update the store state directly from the response — do not re-fetch
- Components read security/user detail data from the store, not by calling services directly

---

## Router

Routes are nested under one parent per layout (`component: <Layout>`); App.vue only holds what's global (Toast, the SplashLoader while the session loads) and a `<router-view>`. Auth guard in `router.beforeEach` waits for `store.authReady`.

- **DefaultLayout** — NavBar, LateralBar when signed in, the page. Declared first: both parents are at `/`, and `/` must resolve to its home page.
- **AuthLayout** — no navigation: the Nhexa logo and the page, centered, at most 460px wide (`.mw-460`), text (titles, subtitles, paragraphs) sized for that column. The logo is big (`LogoHeader`) unless the route's `meta.compactLogo` (a boolean, or a function of the route) says the page shows it itself next to an app's.

| Path | Layout | Auth required |
|---|---|---|
| `/` | Default | Yes |
| `/personal-info` | Default | Yes |
| `/security` | Default | Yes |
| `/billing` | Default | Yes |
| `/privacy` | Default | Yes |
| `/support` | Default | Yes |
| `/environment/apps` | Default | Yes |
| `/:pathMatch(.*)` | Default | — |
| `/login`, `/login/failed` | Auth | No |
| `/register`, `/register/verify`, `/register/success`, `/register/failed` | Auth | No |
| `/account/already-exists`, `/account/not-found` | Auth | No |
| `/oauth/authorize` | Auth | No (signs in itself) |

---

## API Layer

Axios instance: `src/middlewares/services/api.ts` — `baseURL: VITE_API_URL`, `withCredentials: true`.

All endpoint functions exported from `src/middlewares/services/index.ts`. Base URLs from `src/middlewares/misc/const.ts` via `import.meta.env`.

No i18n library — all UI text is hardcoded in Spanish. All identifiers and comments must be in English.

---

## TypeScript Conventions

- No `any` in store state interfaces or service return types — use concrete interfaces
- Props: always typed with `defineProps<{ propName: type }>()`
- Exported interfaces live in the file that owns the type (store, services, or component)

---

## Testing

Framework: **Vitest** + `@vue/test-utils`.

- Test files: `src/tests/ComponentName.spec.ts`
- Run: `npm run test`
- Tests that mount components use happy-dom, per file (`// @vitest-environment happy-dom`), and find elements by `data-testid`
- Currently no meaningful coverage — all components need tests
