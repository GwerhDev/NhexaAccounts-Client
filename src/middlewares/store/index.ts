import { defineStore } from 'pinia';
import { getAppList, getUserData, loginInner, signupInner, updateUserData } from '../services';
import { clearUserToken } from '../../helpers';

interface storeState {
  currentUser: any,
  userToken: string,
  appList: Array<any>,
  menuList: Array<any>,
}

export const useStore = defineStore('store', {
  state: (): storeState => ({
    currentUser: {},
    userToken: '',
    appList: [],
    menuList: [],
  }),

  actions: {
    logout() {
      clearUserToken();
      this.currentUser = {};
      this.userToken = '';
    },
    async handleRegister(data: any) {
      const userToken = await signupInner(data);
      const url = '/auth/' + userToken;
      this.userToken = userToken;
      return url;
    },
    async handleLogin(data: any) {
      const userToken = await loginInner(data);
      if (userToken?.error) return "/auth/error";
      const url = '/';
      this.userToken = userToken;
      return url;
    },
    async handleUserData(token: any, callback: any, router: any) {
      try {
        this.userToken = token;
        this.currentUser = await getUserData(token);
        if (router && !callback) return router.push('/');
        else if(router && callback) return window.location.href = callback;
        else return;
      } catch (error) {
        localStorage.clear();
        console.error(error);
      }
    },
    async handleUpdateUserData(formData: any, id: any, token: any) {
      await updateUserData(formData, id, token);
      this.currentUser = await getUserData(token);
      this.userToken = token;
    },
    async handleGetAppList() {
      this.appList = await getAppList();
      return;
    },
  }

});