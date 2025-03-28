import { API_URL } from "../middlewares/misc/const";

export const getUserToken = async () => {
  try {
    const res = await fetch(API_URL + "/session", {
      credentials: "include"
    });

    const { userToken } = await res.json() || {};
    return userToken;

  } catch (error) {
    console.log(error);
    return null;
  }
};

export const clearUserToken = async () => {
  await fetch(API_URL + "/logout", {
    method: "GET",
    credentials: "include"
  });
};

export const options = () => {
  return {
    headers: {
      Authorization: getUserToken()
    }
  }
};