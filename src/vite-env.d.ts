/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Endereço que recebe o formulário de contato (POST com JSON).
   * Ex.: Formspree, Web3Forms ou uma função própria na Vercel.
   * Vazio = envio SIMULADO: nenhuma mensagem chega ao salão.
   */
  readonly VITE_CONTACT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
