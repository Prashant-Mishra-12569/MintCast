interface ImportMetaEnv {
  VITE_CONTRACT_ADDRESS: string;
  VITE_ALCHEMY_API_KEY: string;
  VITE_FILEBASE_API_KEY: string;
  VITE_FILEBASE_API_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}