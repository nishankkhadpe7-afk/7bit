/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly GOOGLE_DRIVE_API_KEY?: string;
  readonly GOOGLE_DRIVE_FOLDER_ID?: string;
  readonly GOOGLE_SHEETS_WEBHOOK_URL?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
