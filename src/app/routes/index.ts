import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import AuthPage from '../pages/AuthPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import OAuthPage from '../pages/OAuthPage.vue';
import LandingPage from '../pages/LandingPage.vue';
import AccountPage from '../pages/AccountPage.vue';
import SupportPage from '../pages/SupportPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import AuthErrorPage from '../pages/AuthErrorPage.vue';
import ConnectedAppsPage from '../pages/ConnectedAppsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/environment/apps',
    name: 'ConnectedAppsPage',
    component: ConnectedAppsPage
  },
  {
    path: '/auth/error',
    name: 'AuthErrorPage',
    component: AuthErrorPage
  },
  {
    path: '/auth',
    name: 'AuthPage',
    component: AuthPage
  },  
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage
  },
  {
    path: '/account/settings/:token',
    name: 'AccountPage',
    component: AccountPage
  },
  {
    path: '/oauth/chooseaccount',
    name: 'OAuth',
    component: OAuthPage
  },
  {
    path: '/support',
    name: 'SupportPage',
    component: SupportPage
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;