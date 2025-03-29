import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import OAuthPage from '../pages/OAuthPage.vue';
import LandingPage from '../pages/LandingPage.vue';
import BillingPage from '../pages/BillingPage.vue';
import SupportPage from '../pages/SupportPage.vue';
import PrivacyPage from '../pages/PrivacyPage.vue';
import SecurityPage from '../pages/SecurityPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import AuthErrorPage from '../pages/AuthErrorPage.vue';
import PersonalInfoPage from '../pages/PersonalInfoPage.vue';
import EmbedSessionPage from '../pages/EmbedSessionPage.vue';
import ConnectedAppsPage from '../pages/ConnectedAppsPage.vue';
import RegisterVerifyPage from '../pages/RegisterVerifyPage.vue';
import RegisterSuccessPage from '../pages/RegisterSuccessPage.vue';
import AccountNotFoundPage from '../pages/AccountNotFoundPage.vue';
import AccountAlreadyExistsPage from '../pages/AccountAlreadyExistsPage.vue';
import RegisterFailedPage from '../pages/RegisterFailedPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/environment/apps',
    name: 'ConnectedAppsPage',
    component: ConnectedAppsPage,
  },
  {
    path: '/auth/error',
    name: 'AuthErrorPage',
    component: AuthErrorPage,
  },
  {
    path: '/embed-session',
    name: 'EmbedSessionPage',
    component: EmbedSessionPage,
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/personal-info',
    name: 'PersonalInfoPage',
    component: PersonalInfoPage,
  },
  {
    path: '/privacy',
    name: 'PrivacyPage',
    component: PrivacyPage,
  },
  {
    path: '/security',
    name: 'SecurityPage',
    component: SecurityPage,
  },
  {
    path: '/billing',
    name: 'BillingPage',
    component: BillingPage,
  },
  {
    path: '/oauth/chooseaccount',
    name: 'OAuth',
    component: OAuthPage,
  },
  {
    path: '/support',
    name: 'SupportPage',
    component: SupportPage,
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
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;