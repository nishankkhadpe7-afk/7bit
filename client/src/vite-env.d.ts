/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GOOGLE_DRIVE_API_KEY?: string;
  readonly VITE_GOOGLE_DRIVE_FOLDER_ID?: string;
  readonly VITE_GOOGLE_SHEETS_WEBHOOK_URL?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
