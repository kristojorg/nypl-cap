interface Window {
  dataLayer: Array<any> | undefined;
}

declare module "!file-loader*" {
  const url: string;
  export default url;
}
