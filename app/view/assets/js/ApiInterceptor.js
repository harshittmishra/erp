
import Api from "assets/js/Api.js";
import Config from "assets/js/Config.js";

export default class ApiInterceptor {
  constructor({
    publicApi = Config.publicApi,
    redirectUrl = Config.baseUrl,
  } = {}) {
    this.publicApi = publicApi;
    this.redirectUrl = redirectUrl;

    this.register();
  }

  normalizePath(path) {
    return String(path ?? "")
      .split(/[?#]/, 1)[0]
      .trim()
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/")
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();
  }

  isPublicPath(path) {
    const pathname = this.normalizePath(path);

    if (!pathname) return false;

    return this.publicApi.some((prefix) => {
      const normalizedPrefix = this.normalizePath(prefix);

      if (!normalizedPrefix) return false;

      return (
        pathname === normalizedPrefix ||
        pathname.startsWith(`${normalizedPrefix}/`)
      );
    });
  }

  handleResponse({ path, response }) {
    if (this.isPublicPath(path)) return;

    if (response.status === 401) {
      this.redirectToLogin();
    }
  }

  redirectToLogin() {
    window.location.replace(
      new URL("", this.redirectUrl).href
    );
  }

  register() {
    this.unregister = Api.useResponseInterceptor(
      (context) => this.handleResponse(context)
    );
  }

  destroy() {
    this.unregister?.();
    this.unregister = null;
  }
}
