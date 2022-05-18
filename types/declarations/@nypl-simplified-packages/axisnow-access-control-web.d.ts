/* eslint-disable camelcase */
declare module "@nypl-simplified-packages/axisnow-access-control-web" {
  declare type DecryptorParams = {
    book_vault_uuid?: string;
    isbn?: string;
  };
  class Decryptor {
    readonly keyPair: CryptoKeyPair;
    readonly contentKey: CryptoKey;
    readonly containerUrl: string;
    static createDecryptor({
      book_vault_uuid,
      isbn
    }: DecryptorParams): Promise<Decryptor>;
    private constructor();
    getEntryUrl(): string;
    decrypt(encrypted: Uint8Array): Promise<Uint8Array>;
    decryptStr(encrypted: Uint8Array): Promise<string>;
    decryptUrl(resourceUrl: string): Promise<Uint8Array>;
    decryptToString: (resourceUrl: string) => Promise<string>;
  }

  export declare type WebpubDecryptorParams = {
    book_vault_uuid?: string;
    isbn?: string;
    webpubManifest: WebpubManifest;
    webpubManifestUrl: string;
  };
  class WebpubDecryptor {
    private readonly decryptor;
    private readonly webpubManifest;
    private readonly webpubManifestUrl;
    static createDecryptor({
      book_vault_uuid,
      isbn,
      webpubManifest,
      webpubManifestUrl
    }: WebpubDecryptorParams): Promise<WebpubDecryptor>;
    private constructor();
    /**
     * The main entrypoint for Webpub Decryption. Performs all the necessary steps.
     * Just hand it a url to a resource. It will:
     * - Determine if resource should be decrypted
     * - Fetch the resource
     * - Decrypt it
     * - Search for embedded assets, resolve their hrefs, decrypt and inline them.
     */
    decryptResource: (url: string) => Promise<string>;
    /**
     * Gets the embedded image assets, fetches the blob, decrypts it, and
     * re-embeds it as an objectUrl. Uses resourceUrl as the base for
     * relative paths found embedded in the xml
     */
    private embedImageAssets;
    private embedCssAssets;
    /**
     * Decrypts a Uint8Array and returns an objectUrl for the resulting blob
     */
    private getDecryptedUrl;
    /**
     * Fetch and handle error responses.
     */
    private fetch;
    /**
     * Simply fetch a url as text
     */
    private fetchAsText;
    /**
     * Fetches a resources as a Uint8Array
     */
    private fetchAsAB;
    /**
     * Takes an absolute or relative href and returns the corresponding ReadiumLink
     * from the WebpubManifest.
     */
    private getLinkFromManifest;
  }

  /** We have to export these this way to make
   *  them optional, as this package might not be installed if you
   *  don't have access.
   */
  declare const defaultExport: typeof Decryptor | undefined;
  export default defaultExport;
  declare const wepbubDecryptorExport: typeof WebpubDecryptor | undefined;
  export { wepbubDecryptorExport as WebpubDecryptor };

  declare type ErrorInfo = {
    title: string;
    detail: string;
    status?: number;
    url?: string;
  };
  declare class AxisNowDecryptionError extends Error {
    info: ErrorInfo;
    baseError?: Error;
    constructor(info: Partial<ErrorInfo>, baseError?: Error);
  }

  export const AxisNowDecryptionError:
    | undefined
    | typeof AxisNowDecryptionError;
}
