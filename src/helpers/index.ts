export const getUserToken = () => {
  const match = document.cookie.match(/(^| )userToken=([^;]+)/);
  return match ? match[2] : null;
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