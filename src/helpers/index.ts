import { API_URL } from "../middlewares/misc/const";

export const getUserToken = async () => {
  try {
    const res = await fetch(API_URL + "/session", {
      method: "GET",
      credentials: "include"
    });

    const { userToken } = await res.json() || {};
    return userToken;
  } catch (error) {
    console.error("Error al obtener el token:", error);
    return null;
  }
};

export const clearUserToken = () => {
  document.cookie = "userToken=; path=/; Secure; SameSite=None; expires=Thu, 01 Jan 1970 00:00:00 UTC";
};

export const options = () => {
  return {
    headers: {
      Authorization: getUserToken()
    }
  }
};