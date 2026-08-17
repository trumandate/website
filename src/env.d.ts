/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Formspree endpoint for the walkthrough request form. Placeholder value
   * until Piyush supplies the real one — see TODO.md. */
  readonly PUBLIC_FORMSPREE_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
