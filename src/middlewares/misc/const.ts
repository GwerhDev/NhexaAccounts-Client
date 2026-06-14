import { environment } from "../../environment";

export const API_URL: string = environment === "development" ? 'http://localhost:8080' : 'https://api.nhexa.cl';
export const STREAMBY_URL: string = environment === "development" ? 'http://localhost:4000/streamby/be4dce92-de7c-4820-8f93-b3ea3335575d/export' : 'https://api.nhexa.cl/streamby/be4dce92-de7c-4820-8f93-b3ea3335575d/export';
export const ACCOUNTS_URL: string = environment === "development" ? 'http://localhost:5173' : 'https://accounts.nhexa.cl';

export const CLIENT_URL: string = environment === "development" ? 'http://localhost:5174' : 'https://nhexa.cl';
