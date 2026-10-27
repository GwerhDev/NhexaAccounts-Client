import axios from "axios";
import api from "./api";
import { API_URL, STREAMBY_URL } from "../misc/const";
import { error } from "../misc/errors";
import type { AppEntry, EnvCategory } from "../store";

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
    .catch((err) => { return err.response?.data ?? { error: error.api.loadItemById } });
  return response;
};

// The Nhexa environment's apps, by category: a StreamBy export, read by the browser (it answers
// only allowed origins). null when it can't be read (an empty catalog is []).
export const getNhexaEnv = async (): Promise<EnvCategory[] | null> => {
  const raw: any[] | null = await axios.get(STREAMBY_URL + "/nhexa-environment", { withCredentials: true })
    .then(response => (Array.isArray(response.data) ? response.data : []))
    .catch(() => null);
  if (!raw) return null;
  return raw.map((cat: any) => ({
    id: cat._id,
    name: cat._name,
    apps: Object.entries(cat)
      .filter(([k]) => /^\d+$/.test(k))
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, v]) => v as AppEntry),
  }));
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

export const getUserOverview: any = async () => {
  const response: any = await api.get("/user/overview")
    .then(response => response.data)
    .catch(() => { return null });
  return response;
};

export const getUserDetail: any = async () => {
  const response: any = await api.get("/user/detail")
    .then(response => response.data)
    .catch(() => { return null });
  return response;
};

export const updateUserDetail: any = async (data: any) => {
  const response: any = await api.patch("/user/detail", data)
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const getPasswordStatus: any = async () => {
  const response: any = await api.get("/user/password")
    .then(response => response.data)
    .catch(() => { return { passwordSetAt: null } });
  return response;
};

export const updatePassword: any = async (password: string) => {
  const response: any = await api.patch("/user/password", { password })
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const getTwoFactorSetup: any = async () => {
  const response: any = await api.get("/user/2fa/setup")
    .then(response => response.data)
    .catch(() => { return null });
  return response;
};

export const enableTwoFactor: any = async (secret: string, code: string) => {
  const response: any = await api.post("/user/2fa/enable", { secret, code })
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const disableTwoFactor: any = async (code: string) => {
  const response: any = await api.post("/user/2fa/disable", { code })
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};

export const verifyMfa: any = async (mfaToken: string, code: string) => {
  const response: any = await axios.post(API_URL + "/login-inner/verify-2fa", { mfaToken, code }, { withCredentials: true })
    .then(response => response.data)
    .catch(() => { return { error: error.api.loadItemById } });
  return response;
};
export interface OAuthClientInfo { id: string; name: string; logoUri: string | null; clientUri: string | null; verified: boolean }
export interface OAuthAuthorizeRequest { client: OAuthClientInfo; scopes: string[]; redirectUri: string; consented: boolean }
export interface OAuthFailure { error: string; error_description?: string; redirectTo?: string }

const oauthFailure = (err: any): OAuthFailure =>
  err?.response?.data?.error ? err.response.data : { error: 'server_error', error_description: 'No se pudo contactar a Nhexa.' };

// The authorization request an app sent the user with, as Nhexa checked it.
export const getOAuthAuthorizeRequest = async (query: Record<string, string>): Promise<OAuthAuthorizeRequest | OAuthFailure> =>
  api.get("/oauth/authorize/request", { params: query })
    .then(response => response.data)
    .catch(oauthFailure);

// The user's answer to that request: where to send them back to the app.
export const sendOAuthDecision = async (query: Record<string, string>, approve: boolean): Promise<{ redirectTo: string } | OAuthFailure> =>
  api.post("/oauth/authorize/decision", { request: query, approve })
    .then(response => response.data)
    .catch(oauthFailure);

export interface ConnectedApp {
  clientId: string; name: string; logoUri: string | null; verified: boolean;
  scopes: string[]; authorizedAt: string | null; lastUsedAt: string | null;
}

// The apps the user connected with their account (OAuth); null when they can't be read.
export const getConnectedApps = async (): Promise<ConnectedApp[] | null> =>
  api.get("/account/apps")
    .then(response => response.data.connected ?? [])
    .catch(() => null);

// Takes an app's access away: true once it's gone.
export const removeAccountApp = async (clientId: string): Promise<boolean> =>
  api.delete("/account/apps/" + encodeURIComponent(clientId))
    .then(() => true)
    .catch(() => false);
