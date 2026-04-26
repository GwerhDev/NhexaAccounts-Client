import { defineStore } from 'pinia';
import { getAppList, getUserData, loginInner, signupInner, updateUserData } from '../services';
import { clearUserToken } from '../services/token';

interface storeState {
  currentUser: any,
  appList: { user: Array<any>, admin?: Array<any> },
  menuList: Array<any>,
}

export const useStore = defineStore('store', {
  state: (): storeState => ({
    currentUser: {
      logged: false,
    },
    appList: { user: [], admin: [] },
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
    async handleGetAppList() {
      this.appList = await getAppList();
      return;
    },
  }

});