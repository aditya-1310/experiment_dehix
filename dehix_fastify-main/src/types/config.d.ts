export interface AppConfig {
  SERVER_MONGO_CONN: string;
  SERVER_PORT: number;
  BACKEND_PUBLIC_URL?: string; // Optional, with fallback logic in FileStorageService

  // For patternProperties: "SERVER_(.*)": { type: "string" }
  // This allows any other properties starting with SERVER_
  [key: `SERVER_${string}`]: string | number | undefined; // string | number because SERVER_PORT is number
}
