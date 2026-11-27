/** Base URL of the Laravel API, for example http://192.168.1.23:8000/api/v1 (set in .env.local). */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');