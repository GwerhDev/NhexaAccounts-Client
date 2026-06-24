import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import OAuthPage from '../pages/OAuthPage.vue';
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
import { useStore } from '../../middlewares/store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/environment/apps',
    name: 'ConnectedAppsPage',
    component: ConnectedAppsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/personal-info',
    name: 'PersonalInfoPage',
    component: PersonalInfoPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/privacy',
    name: 'PrivacyPage',
    component: PrivacyPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/security',
    name: 'SecurityPage',
    component: SecurityPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/billing',
    name: 'BillingPage',
    component: BillingPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/support',
    name: 'SupportPage',
    component: SupportPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/login/failed',
    name: 'LoginFailedPage',
    component: LoginFailedPage,
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/oauth/chooseaccount',
    name: 'OAuth',
    component: OAuthPage,
  },
  {
    path: '/account/already-exists',
    name: 'AccountAlreadyExistsPage',
    component: AccountAlreadyExistsPage,
  },
  {
    path: '/account/not-found',
    name: 'AccountNotFoundPage',
    component: AccountNotFoundPage,
  },
  {
    path: '/register/verify',
    name: 'RegisterVerifyPage',
    component: RegisterVerifyPage,
  },
  {
    path: '/register/success',
    name: 'RegisterSuccessPage',
    component: RegisterSuccessPage,
  },
  {
    path: '/register/failed',
    name: 'RegisterFailedPage',
    component: RegisterFailedPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundPage',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true;
  const store = useStore();
  if (!store.currentUser?.logged) {
    return { name: 'LoginPage' };
  }
  return true;
});

export default router;
