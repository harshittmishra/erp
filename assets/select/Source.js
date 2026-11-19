export default class Source {
  constructor(options) {
    this.options = options;
    this.data = new Map();
  }

  static async create(options) {
    const instance = new Source(options);
    await instance.normalize();
    return instance;
  }

  setData(data) {
    if (!Array.isArray(data)) {
      throw new TypeError("Source data must be an array.");
    }

    const normalized = new Map();

    data.forEach((option) => {
      const value = String(option.value);

      if (normalized.has(value)) {
        throw new Error(
          `Duplicate option value: ${value === "" ? "empty" : value}`,
        );
      }

      normalized.set(value, option);
    });

    this.data = normalized;
  }

  async normalize() {
    const data = this.options.data;

    if (data == null) {
      this.setData(
        this.options.isNative ? this.nativeOptions() : this.htmlOptions(),
      );

      return;
    }

    if (Array.isArray(data)) {
      this.setData(data);
      return;
    }

    if (typeof data === "function") {
      this.setData(await this.loadCallback(data));
      return;
    }

    if (typeof data === "object") {
      this.setData(data);
      return;
    }

    if (typeof data === "string") {
      const value = data.trim();

      if (!value) return;

      if (/^(https?:\/\/|\/\/|\/)/i.test(value)) {
        this.setData(await this.loadAjax(value));
        return;
      }

      try {
        this.setData(JSON.parse(value));
        return;
      } catch {
        throw new Error("Unknown string type as source supplied");
      }
    }
  }

  async loadCallback(callback) {
    return await callback(this.options);
  }

  async loadAjax(url) {
    const response = await fetch(url, {
      ...this.options.fetchOptions,
    });

    if (!response.ok) {
      throw new Error(`Source request failed: ${response.status}`);
    }

    return await response.json();
  }

  nativeOptions() {
    const SelectOptions = this.options.nativeSelect.options;

    return Array.from(SelectOptions).map((option, index) => ({
      value: option.value,
      label: option.textContent.trim(),
      disabled: option.disabled,
      selected: option.selected,
      index,
      element: option,
    }));
  }

  htmlOptions() {
    return Array.from(this.options.mount.querySelectorAll(".option")).map(
      (option) => ({
        element: option,
        label: option.textContent.trim(),
        value: option.dataset.value ?? "",
        disabled: option.hasAttribute("disabled"),
        selected: option.hasAttribute("selected"),
      }),
    );
  }
}
