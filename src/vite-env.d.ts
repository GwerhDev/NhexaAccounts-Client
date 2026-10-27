/// <reference types="vite/client" />

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    // AuthLayout shows a small Nhexa logo instead of the big one: for pages that show it
    // themselves, next to an app's.
    compactLogo?: boolean | ((route: RouteLocationNormalized) => boolean);
  }
}
