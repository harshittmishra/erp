import Api from "assets/js/Api.js";
import Config from "assets/js/Config.js";

function isPublicPath(path) {
  const pathname = path.split(/[?#]/, 1)[0];

  return Config.publicApi.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

Api.useResponseInterceptor(({ path, response }) => {
  if (isPublicPath(path)) {
    return;
  }

  if (response.status === 401) {
    window.location.replace(new URL("", Config.baseUrl).href);
  }
});
