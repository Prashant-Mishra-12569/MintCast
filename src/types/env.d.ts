interface ImportMetaEnv {
  VITE_CONTRACT_ADDRESS: string;
  VITE_ALCHEMY_API_KEY: string;
  VITE_PINATA_API_KEY: string;
  VITE_PINATA_SECRET_KEY: string;
  VITE_OWNER_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}