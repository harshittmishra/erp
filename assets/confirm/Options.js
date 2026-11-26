import OptionsPipeline from "../options/OptionsPipeline.js";

export default class Options extends OptionsPipeline {
  constructor(options = {}) {
    super({
      mountId: null,
      on: null,
      ids: null,
      title: "Are you sure ?",
      subtitle:
        "this action is non-reversible, click on confirm to continue and cancel to go back.",
      primaryButtonText: "Confirm",
      secondaryButtonText: "Cancel",
      onConfirmation: null,
      onCancel: null,
      onClose: null,
      onOpen: null,
      ...options,
    });

    Object.freeze(this);
  }

  // Must be an HTMLElement or a valid selector.
  mountId(value) {
    return this.validateString(value, "mountId");
  }

  on(value) {
    if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) {
      return [value];
    }

    if (typeof value === "string") {
      try {
        const elements = document.querySelectorAll(value);

        if (
          elements.length > 0 &&
          Array.from(elements).every(
            (element) => element instanceof HTMLElement,
          )
        ) {
          return Array.from(elements);
        }
      } catch {
        // Invalid selector.
      }
    }

    throw new TypeError(
      'property "on" must be an HTMLElement or a valid CSS selector resolving to one or more HTMLElements.',
    );
  }

  // Must be a NodeList or a selector returning a NodeList.
  ids(value) {
    //validate for a callback
    return this.validateCallbackOrNull(value, "ids");
  }

  // String gets converted into a callback.
  title(value) {
    return this.validateString(value, "title");
  }

  subtitle(value) {
    return this.validateString(value, "subtitle");
  }

  primaryButtonText(value) {
    return this.validateString(value, "primaryButtonText");
  }

  secondaryButtonText(value) {
    return this.validateString(value, "secondaryButtonText");
  }

  onConfirmation(value) {
    return this.validateCallback(value, "onConfirmation");
  }

  onCancel(value) {
    return this.validateCallbackOrNull(value, "onCancel");
  }

  onClose(value) {
    return this.validateCallbackOrNull(value, "onClose");
  }

  onOpen(value) {
    return this.validateCallbackOrNull(value, "onOpen");
  }

  // -------------------------
  // Reusable validation methods
  // -------------------------
  validateStringOrCallback(value, property) {
    if (typeof value === "function") {
      return value;
    }

    if (typeof value === "string") {
      return () => value;
    }

    throw new TypeError(`${property} must be a string or callback.`);
  }

  validateString(value, property) {
    if (typeof value !== "string") {
      throw new TypeError(`${property} must be a string.`);
    }

    return value;
  }

  validateCallback(value, property) {
    if (typeof value !== "function") {
      throw new TypeError(`${property} must be a callback.`);
    }

    return value;
  }

  validateCallbackOrNull(value, property) {
    if (value !== null && typeof value !== "function") {
      throw new TypeError(`${property} must be a callback or null.`);
    }

    return value;
  }
}
