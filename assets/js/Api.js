import Config from "./Config.js";

export default class Api {
  static baseUrl = Config.baseUrl;

  static responseInterceptors = [];

  static useResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);

    return () => {
      this.responseInterceptors = this.responseInterceptors.filter(
        (item) => item !== interceptor,
      );
    };
  }

  static async request(path, options = {}) {
    const isFormData = options.body instanceof FormData;

    const headers = {
      Accept: "application/json",
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
      ...(options.headers || {}),
    };

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      credentials: "include",
      headers,
    });

    const data = await response.json().catch(() => null);

    const context = {
      path,
      options,
      response,
      data,
    };

    for (const interceptor of this.responseInterceptors) {
      await interceptor(context);
    }

    if (!response.ok) {
      const error = new Error(data?.error || `HTTP ${response.status}`);

      error.status = response.status;
      error.data = data;

      throw error;
    }

    return data;
  }

  static get(path) {
    return this.request(path, {
      method: "GET",
    });
  }

  static post(path, data) {
    return this.request(path, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  static patch(path, data) {
    return this.request(path, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  static put(path, data) {
    return this.request(path, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  static delete(path, data = null) {
    return this.request(path, {
      method: "DELETE",
      ...(data !== null && {
        body: JSON.stringify(data),
      }),
    });
  }
}
