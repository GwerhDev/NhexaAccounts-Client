import axios from "axios";
import { API_URL } from "../misc/const";
import { error } from "../misc/errors";

export const signupGoogle: any = async (formData: any) => {
  const response: any = await axios.post(API_URL + "/signup-google", formData)
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadAllItems } });
  return response;
};

export const loginGoogle: any = async (formData: any) => {
  const response: any = await axios.post(API_URL + "/login-google", formData)
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadAllItems } });
  return response;
};

export const signupInner: any = async (formData: any) => {
  const response: any = await axios.post(API_URL + "/signup-inner", formData)
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const loginInner: any = async (formData: any) => {
  const response: any = await axios.post(API_URL + "/login-inner", formData)
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const getAppList: any = async () => {
  const response: any = await axios.get(API_URL + "/app-list")
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const getUserData: any = async () => {
  const response: any = await axios.get(API_URL + "/account", { withCredentials: true })
    .then(response => response.data)
  return response;
};

export const updateUserData: any = async (formData: any, id: any) => {
  const response: any = await axios.patch(API_URL + "/account/update/" + id, formData, { withCredentials: true })
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};