export const getUserToken = async () => {
  try {
    const res = await fetch("https://accounts.nhexa.cl/session", {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();
    return data.token || null;
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