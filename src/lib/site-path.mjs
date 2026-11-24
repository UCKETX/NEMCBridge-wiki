// Astro includes the deployment subpath in BASE_URL, but not in literal links.
export function withBase(pathname) {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + pathname;
}
