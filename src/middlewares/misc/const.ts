import { environment } from "../../environment";

export const API_URL: string = environment === "development" ? 'http://localhost:3001' : 'https://laruinahub-api.fly.dev';
