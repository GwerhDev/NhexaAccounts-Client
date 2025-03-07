import { environment } from "../../environment";

export const API_URL: string = environment === "development" ? 'http://localhost:8080' : 'https://nhexa-api.fly.dev';
export const ACCOUNTS_URL: string = environment === "development" ? 'http://localhost:5173' : 'https://accounts.nhexa.cl';

export const CLIENT_URL: string = environment === "development" ? 'http://localhost:5174' : 'https://nhexa.cl';