import { defineStore } from 'pinia';
import { getUserData, loginInner, signupInner, updateUserData } from '../services';
import { setUserToken } from '../../helpers';

interface storeState {
  currentUser: any,
  userToken: string,
}

export const useStore = defineStore('store', {
  state: (): storeState => ({
    currentUser: {},
    userToken: '',
  }),

  actions: {
    logout() {
      localStorage.clear();
      this.currentUser = {};
      this.userToken = '';
    },
    async handleRegister(data: any) {
      const userToken = await signupInner(data);
      setUserToken(userToken);
      const url = '/auth/' + userToken;
      this.userToken = userToken;
      return url;
    },
    async handleLogin(data: any) {
      const userToken = await loginInner(data);
      if(userToken?.error) return "/auth/error";
      setUserToken(userToken);
      const url = '/';
      this.userToken = userToken;
      return url;
    },
    async handleUserData(token: any, router: any) {
      try {
        setUserToken(token);
        this.userToken = token;
        this.currentUser = await getUserData(token);
        router && router.push('/');
      } catch (error) {
        localStorage.clear();
        console.error(error);
      }
    },
    async handleUpdateUserData(formData: any, id: any, token: any) {
      await updateUserData(formData, id, token);
      this.currentUser = await getUserData(token);
      this.userToken = token;
      setUserToken(token);
    },
  }
  
});