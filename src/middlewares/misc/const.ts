import { environment } from "../../environment";

export const API_URL: string = environment === "development" ? 'http://localhost:8080' : 'https://nhexa-api.fly.dev';
export const ACCOUNTS_URL: string = environment === "development" ? 'http://localhost:5173' : 'https://accounts.nhexa.cl';

export const CLIENT_URL: string = environment === "development" ? 'http://localhost:5174' : 'https://nhexa.cl';

export const allowedOrigins: string[] = environment === "development"
  ? 
  [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
  ]
  : 
  [
    "https://nhexa.cl",
    "https://laruina.cl",
    "https://elumbral.cl",
    "https://terminalcore.cl",
    "https://terminalkiller.cl",
    "https://spectra.nhexa.cl",
    "https://spellcast.nhexa.cl",
    "https://havenstore.nhexa.cl",
    "https://streamby.nhexa.cl",
  ];