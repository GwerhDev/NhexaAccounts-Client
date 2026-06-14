import { defineStore } from 'pinia';
import { getNhexaEnv, getUserData, loginInner, signupInner, updateUserData } from '../services';
import { clearUserToken } from '../services/token';

export interface AppEntry { label: string; url: string; icon: string; color?: string; description?: string; route?: string }
export interface EnvCategory { id: string; name: string; apps: AppEntry[] }

interface storeState {
  currentUser: any,
  appList: EnvCategory[],
  menuList: Array<any>,
}

export const useStore = defineStore('store', {
  state: (): storeState => ({
    currentUser: {
      logged: false,
    },
    appList: [],
    menuList: [],
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
    async handleUserData(callback: any, router: any) {
      try {
        this.currentUser = await getUserData();
        if (router && !callback) return router.push('/');
        else if (router && callback) return window.location.href = callback;
        else return;
      } catch (error) {
        console.error(error);
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
  }

});