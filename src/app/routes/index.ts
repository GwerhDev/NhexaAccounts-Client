import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import LandingPage from '../pages/LandingPage.vue';
import BillingPage from '../pages/BillingPage.vue';
import SupportPage from '../pages/SupportPage.vue';
import PrivacyPage from '../pages/PrivacyPage.vue';
import SecurityPage from '../pages/SecurityPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import PersonalInfoPage from '../pages/PersonalInfoPage.vue';
import ConnectedAppsPage from '../pages/ConnectedAppsPage.vue';
import RegisterVerifyPage from '../pages/RegisterVerifyPage.vue';
import RegisterSuccessPage from '../pages/RegisterSuccessPage.vue';
import AccountNotFoundPage from '../pages/AccountNotFoundPage.vue';
import AccountAlreadyExistsPage from '../pages/AccountAlreadyExistsPage.vue';
import RegisterFailedPage from '../pages/RegisterFailedPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';
import LoginFailedPage from '../pages/LoginFailedPage.vue';
import OAuthAuthorizePage from '../pages/OAuthAuthorizePage.vue';
import { useStore } from '../../middlewares/store';
import AuthLayout from '../layouts/AuthLayout/AuthLayout.layout.vue';
import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout.layout.vue';

// Each route is a child of the layout it's shown in: DefaultLayout (the account, with its menus)
// or AuthLayout (signing in and up, authorizing an app: no navigation, the task centered).
// DefaultLayout goes first: both parents are at '/', and '/' itself must be its home page.
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'LandingPage', component: LandingPage, meta: { requiresAuth: true } },
      { path: 'environment/apps', name: 'ConnectedAppsPage', component: ConnectedAppsPage, meta: { requiresAuth: true } },
      { path: 'personal-info', name: 'PersonalInfoPage', component: PersonalInfoPage, meta: { requiresAuth: true } },
      { path: 'privacy', name: 'PrivacyPage', component: PrivacyPage, meta: { requiresAuth: true } },
      { path: 'security', name: 'SecurityPage', component: SecurityPage, meta: { requiresAuth: true } },
      { path: 'billing', name: 'BillingPage', component: BillingPage, meta: { requiresAuth: true } },
      { path: 'support', name: 'SupportPage', component: SupportPage, meta: { requiresAuth: true } },
      { path: ':pathMatch(.*)*', name: 'NotFoundPage', component: NotFoundPage },
    ],
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'LoginPage', component: LoginPage },
      { path: 'login/failed', name: 'LoginFailedPage', component: LoginFailedPage },
      // Signs the user in itself when needed, coming back here with the same request.
      { path: 'oauth/authorize', name: 'OAuthAuthorizePage', component: OAuthAuthorizePage },
      { path: 'register', name: 'RegisterPage', component: RegisterPage },
      { path: 'register/verify', name: 'RegisterVerifyPage', component: RegisterVerifyPage },
      { path: 'register/success', name: 'RegisterSuccessPage', component: RegisterSuccessPage },
      { path: 'register/failed', name: 'RegisterFailedPage', component: RegisterFailedPage },
      { path: 'account/already-exists', name: 'AccountAlreadyExistsPage', component: AccountAlreadyExistsPage },
      { path: 'account/not-found', name: 'AccountNotFoundPage', component: AccountNotFoundPage },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true;
  const store = useStore();
  if (!store.authReady) {
    await new Promise<void>(resolve => {
      const unwatch = store.$subscribe(() => {
        if (store.authReady) {
          unwatch();
          resolve();
        }
      });
    });
  }
  if (!store.currentUser?.logged) {
    return { name: 'LoginPage' };
  }
  return true;
});

export default router;
