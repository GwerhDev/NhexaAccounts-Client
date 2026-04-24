import { API_URL } from "../misc/const";

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
