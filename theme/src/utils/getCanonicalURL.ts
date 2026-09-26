export const getCanonicalURL = (url: URL, site: URL | undefined): string => {
  const pathname = url.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  return new URL(pathname, site).toString().replace(/\/$/, "");
};
