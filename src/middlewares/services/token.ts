import { API_URL } from "../misc/const";

export const getUserToken = async (): Promise<string> => {
  try {
    const res = await fetch(API_URL + "/session/token", { credentials: "include" });
    const data = await res.json();
    return data.token ?? '';
  } catch {
    return '';
  }
};

export const clearUserToken = async () => {
  try {
    await fetch(API_URL + "/logout", {
      method: "GET",
      credentials: "include"
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
