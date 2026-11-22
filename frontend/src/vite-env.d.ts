/// <reference types="vite/client" />

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.gif";
declare module "*.webp";

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
  readonly VITE_CLOUDINARY_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
