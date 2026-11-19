export default class OptionsPipeline {
  constructor(options = {}) {
    if (
      options === null ||
      typeof options !== "object" ||
      Array.isArray(options)
    ) {
      throw new TypeError("Configuration must be an object.");
    }

    for (const [key, value] of Object.entries(options)) {
      this[key] = this.hasMethod(key) ? this[key](value, options) : value;
    }

    if (this.hasMethod("validate")) {
      this.validate();
    }
  }

  hasMethod(name) {
    const prototype = Object.getPrototypeOf(this);

    return (
      Object.hasOwn(prototype, name) && typeof prototype[name] === "function"
    );
  }
}
