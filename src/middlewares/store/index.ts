import { defineStore } from 'pinia';
import { getNhexaEnv, getUserData, getUserOverview, loginInner, signupInner, updateUserData, updateUserDetail } from '../services';
import { clearUserToken } from '../services/token';

export interface AppEntry { label: string; url: string; icon: string; color?: string; description?: string; route?: string }
export interface EnvCategory { id: string; name: string; apps: AppEntry[] }

export interface PasswordStatus { passwordSetAt: string | null; twoFactorEnabled: boolean }
export interface AccountDetail { firstName: string | null; lastName: string | null; birthDate: string | null; countryId: string | null; phone: string | null; phoneCode: string | null; passwordSetAt: string | null }
export interface UserDetailResponse { userData: { id: string; username: string; email: string; isVerified: boolean; role: string; profilePic: string | null }; accountDetail: AccountDetail }

interface storeState {
  currentUser: any,
  appList: EnvCategory[],
  passwordStatus: PasswordStatus | null,
  userDetail: UserDetailResponse | null,
  menuList: Array<any>,
  authReady: boolean,
}

export const useStore = defineStore('store', {
  state: (): storeState => ({
    currentUser: {
      logged: false,
    },
    appList: [],
    passwordStatus: null,
    userDetail: null,
    menuList: [],
    authReady: false,
  }),

  actions: {
    async logout() {
      await clearUserToken();
      this.currentUser = {};
    },
    async handleRegister(data: any) {
      const { logged } = await signupInner(data) || null;
      if (!logged) return "/register/failed";
      return "/register/success";
    },
    async handleLogin(data: any, callback: string) {
      const result = await loginInner(data) || null;
      if (result?.mfaRequired) {
        return { mfaRequired: true, mfaToken: result.mfaToken as string };
      }
      if (!result?.logged) {
        return { error: true, message: result?.message ?? 'Error al iniciar sesión.' };
      }
      if (callback) return window.location.href = callback;
      else {
        this.currentUser = await getUserData();
        return '/';
      }
    },
    async handleUserData(callback?: any, router?: any) {
      try {
        this.currentUser = await getUserData();
        if (router && !callback) return router.push('/');
        else if (router && callback) return window.location.href = callback;
        else return;
      } catch (error) {
        console.error(error);
      } finally {
        this.authReady = true;
      }
    },
    async handleUpdateUserData(formData: any, id: any) {
      await updateUserData(formData, id);
      this.currentUser = await getUserData();
    },
    async handleGetNhexaEnv() {
      this.appList = await getNhexaEnv();
      return;
    },
    async handleGetUserOverview() {
      if (this.passwordStatus !== null && this.userDetail !== null) return;
      const overview = await getUserOverview();
      if (!overview) return;
      this.passwordStatus = overview.securityStatus;
      this.userDetail = { userData: overview.userData, accountDetail: overview.accountDetail };
    },
    async handleUpdateUserDetail(data: Partial<AccountDetail & { username?: string; email?: string }>) {
      const result: UserDetailResponse | null = await updateUserDetail(data);
      if (result?.userData) this.userDetail = result;
      return result;
    },
    invalidateUserOverview() {
      this.passwordStatus = null;
      this.userDetail = null;
    },
  }

});