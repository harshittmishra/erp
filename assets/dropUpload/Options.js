import OptionsPipeline from "../options/OptionsPipeline.js";

export default class Options extends OptionsPipeline {
  constructor(options = {}) {
    super({
      mount: null,

      // File selection
      multiple: false,

      // Validation
      allowedMimes: [],
      maxFileSize: Infinity,
      maxFiles: Infinity,
      allowDuplicates: false,

      // Preview
      previewContainer: null,
      viewMode: "list",

      // Lifecycle callbacks
      onCaptured: null,
      onDragStart: null,
      onDragCompleted: null,
      onEmpty: null,
      onRejected: null,
      onFilesChange: null,
      onChange: null,
      onFileRemoved: null,
      onError: null,
      hideOnFile: false,

      ...options,
    });

    this.validateSelectionLimits();

    Object.freeze(this);
  }

  mount(value) {
    if (typeof value === "string") {
      value = value.trim() || null;
    }

    if (
      value === null ||
      (typeof value !== "string" &&
        (typeof HTMLElement === "undefined" || !(value instanceof HTMLElement)))
    ) {
      throw new TypeError(
        "mount must be a CSS selector string or an HTML element.",
      );
    }

    if (typeof value === "string") {
      const element = document.querySelector(value);

      if (!element) {
        throw new TypeError(`DropUpload: Mount element not found: ${value}`);
      }

      return element;
    }

    return value;
  }

  multiple(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("multiple must be a boolean.");
    }

    return value;
  }

  allowedMimes(value) {
    if (
      !Array.isArray(value) ||
      !value.every((mime) => typeof mime === "string" && mime.trim())
    ) {
      throw new TypeError("allowedMimes must be an array of MIME strings.");
    }

    return [...new Set(value.map((mime) => mime.trim().toLowerCase()))];
  }

  maxFileSize(value) {
    if (value !== Infinity && (!Number.isFinite(value) || value < 0)) {
      throw new TypeError(
        "maxFileSize must be a non-negative number or Infinity.",
      );
    }

    return value;
  }

  maxFiles(value) {
    if (value !== Infinity && (!Number.isInteger(value) || value < 0)) {
      throw new TypeError(
        "maxFiles must be a non-negative integer or Infinity.",
      );
    }

    return value;
  }

  allowDuplicates(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("allowDuplicates must be a boolean.");
    }

    return value;
  }

  previewContainer(value) {
    if (value === null) {
      return null;
    }

    if (typeof value === "string") {
      value = value.trim();

      if (!value) {
        throw new TypeError("previewContainer cannot be empty.");
      }

      const element = document.querySelector(value);

      if (!element) {
        throw new TypeError(
          `DropUpload: Preview container not found: ${value}`,
        );
      }

      return element;
    }

    if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) {
      return value;
    }

    throw new TypeError(
      "previewContainer must be a CSS selector string or an HTML element.",
    );
  }

  viewMode(value) {
    if (!["list", "tile"].includes(value)) {
      throw new TypeError('viewMode must be "list" or "tile".');
    }

    return value;
  }

  onCaptured(value) {
    return this.validateCallback(value, "onCaptured");
  }

  onDragStart(value) {
    return this.validateCallback(value, "onDragStart");
  }

  onDragCompleted(value) {
    return this.validateCallback(value, "onDragCompleted");
  }

  onEmpty(value) {
    return this.validateCallback(value, "onEmpty");
  }

  onRejected(value) {
    return this.validateCallback(value, "onRejected");
  }

  onFilesChange(value) {
    return this.validateCallback(value, "onFilesChange");
  }

  onChange(value) {
    return this.validateCallback(value, "onChange");
  }

  onFileRemoved(value) {
    return this.validateCallback(value, "onFileRemoved");
  }

  onError(value) {
    return this.validateCallback(value, "onError");
  }

  hideOnFile(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("hideOnFile must be a boolean.");
    }

    return value;
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

  validateSelectionLimits() {
    if (!this.multiple && this.maxFiles > 1) {
      return;
    }
  }
}
