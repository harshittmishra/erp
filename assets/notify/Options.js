import OptionsPipeline from "../options/OptionsPipeline.js";

export default class Options extends OptionsPipeline {
  constructor(options = {}) {
    super({
      allowedCategories: ["info", "success", "warning", "error"],
      mount: null,
      mountId: null,
      type: "toast",
      category: "info",
      title: null,
      message: null,
      icon: false,
      progress: false,
      disappearIn: 5000,
      dismiss: false,
      position: null,
      action: null,

      onDismiss: null,
      onDisappear: null,
      onAppear: null,
      onAction: null,
      on: null,

      ...options,
    });

    this.validateMount();

    Object.freeze(this);
  }

  mount(value) {
    if (value === null) {
      return null;
    }

    if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) {
      return value;
    }

    if (typeof value === "string") {
      const selector = value.trim();

      if (!selector) {
        throw new TypeError("mount selector cannot be empty.");
      }

      const element = document.querySelector(selector);

      if (element instanceof HTMLElement) {
        return element;
      }

      throw new Error(
        `No HTML element found for mount selector: "${selector}".`,
      );
    }

    throw new TypeError(
      "mount must be a CSS selector string, an HTML element, or null.",
    );
  }

  mountId(value) {
    if (value === null) {
      return null;
    }

    if (typeof value !== "string" || !value.trim()) {
      throw new TypeError("mountId must be a non-empty string or null.");
    }

    return value.trim();
  }

  validateMount() {
    if (this.mount === null && this.mountId === null) {
      throw new Error("Either mount or mountId must be provided.");
    }

    return true;
  }

  type(value) {
    const allowed = ["toast", "banner", "snackbar"];

    if (typeof value !== "string") {
      throw new TypeError("type must be a string.");
    }

    value = value.trim().toLowerCase();

    if (!allowed.includes(value)) {
      throw new TypeError(`type must be one of: ${allowed.join(", ")}.`);
    }

    return value;
  }

  category(value) {
    if (typeof value !== "string") {
      throw new TypeError("class must be a string.");
    }

    value = value.trim().toLowerCase();

    if (!this.allowedCategories.includes(value)) {
      throw new TypeError(
        `class must be one of: ${this.allowedCategories.join(", ")}.`,
      );
    }

    return value;
  }

  title(value) {
    if (value === null) {
      return null;
    }

    if (typeof value !== "string" || !value.trim()) {
      throw new TypeError("title must be a non-empty string or null.");
    }

    return value.trim();
  }

  message(value) {
    if (value === null) {
      return null;
    }

    if (typeof value !== "string" || !value.trim()) {
      throw new TypeError("message must be a non-empty string or null.");
    }

    return value.trim();
  }

  icon(value) {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    throw new TypeError("icon must be a boolean or a non-empty string.");
  }

  progress(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("progress must be a boolean.");
    }

    return value;
  }

  disappearIn(value) {
    if (typeof value !== "number" || (value <= 0 && value !== Infinity)) {
      throw new TypeError("disappearIn must be a positive number or Infinity.");
    }

    return value;
  }

  dismiss(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("progress must be a boolean.");
    }

    return value;
  }

  position(value) {
    if (value === null) {
      return null;
    }

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    return value;
  }

  action(value) {
    if (value === null) {
      return null;
    }

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    throw new TypeError("action must be a non-empty string or null.");
  }

  onDismiss(value) {
    return this.validateCallback(value, "onDismiss");
  }

  onDisappear(value) {
    return this.validateCallback(value, "onDisappear");
  }

  onAppear(value) {
    return this.validateCallback(value, "onAppear");
  }

  onAction(value) {
    return this.validateCallback(value, "onAction");
  }

  on(value) {
    return this.validateCallback(value, "on");
  }

  validateCallback(value, name) {
    if (value === null) {
      return null;
    }

    if (typeof value !== "function") {
      throw new TypeError(`${name} must be a function or null.`);
    }

    return value;
  }
}
