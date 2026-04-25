import axios from "axios";
import api from "./api";
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
  const response: any = await axios.post(API_URL + "/login-inner", formData, { withCredentials: true })
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const getAppList: any = async () => {
  const response: any = await api.get("/app-list")
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const getUserData: any = async () => {
  const response: any = await api.get("/account")
    .then(response => response.data)
  return response;
};

export const updateUserData: any = async (formData: any, id: any) => {
  const response: any = await api.patch("/account/update/" + id, formData)
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const linkEmail: any = async (password: string) => {
  const response: any = await api.post("/account/link-email", { password })
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const getDevices: any = async () => {
  const response: any = await api.get("/user/device")
    .then(response => response.data)
    .catch(() => { return { sessions: [] } });
  return response;
};

export const revokeDevice: any = async (id: string) => {
  const response: any = await api.delete("/user/device/" + id)
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const revokeAllDevices: any = async () => {
  const response: any = await api.delete("/user/device/all")
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const getPasswordStatus: any = async () => {
  const response: any = await api.get("/user/password")
    .then(response => response.data)
    .catch(() => { return { hasPassword: false, updatedAt: null } });
  return response;
};

export const updatePassword: any = async (password: string) => {
  const response: any = await api.patch("/user/password", { password })
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};