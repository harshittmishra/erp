import OptionsPipeline from "../options/OptionsPipeline.js";

export default class Options extends OptionsPipeline {
  constructor(options = {}) {
    super({
      mount: null,
      selectionType: "single",
      minSelection: 0,
      maxSelection: Infinity,
      disabled: false,
      placeholder: "Select",
      closeOnSelect: true,
      autoSelect: false,
      data: null,
      renderOption: null,
      searchable: false,
      onSearch: null,
      remoteSearch: false,
      searchPlaceholder: "Search...",
      searchDelay: 300,
      fetchOptions: {},
      onSelect: null,
      onDeselect: null,
      onChange: null,
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

    //finding native element.
    const nativeSelect = value.matches("select")
      ? value
      : value.querySelector("select");

    this.nativeSelect = nativeSelect;
    this.isNative = nativeSelect !== null;

    return value;
  }

  selectionType(value) {
    if (!["single", "multiple"].includes(value)) {
      throw new TypeError('selectionType must be "single" or "multiple".');
    }

    return value;
  }

  minSelection(value) {
    if (!Number.isInteger(value) || value < 0) {
      throw new TypeError("minSelection must be a non-negative integer.");
    }

    return value;
  }

  maxSelection(value) {
    if (value !== Infinity && (!Number.isInteger(value) || value < 0)) {
      throw new TypeError(
        "maxSelection must be a non-negative integer or Infinity.",
      );
    }

    return value;
  }

  disabled(value) {
    if (typeof value !== "boolean") {
      throw new TypeError(`disabled must be a boolean.`);
    }

    return value;
  }

  remoteSearch(value) {
    if (typeof value !== "boolean") {
      throw new TypeError(`remoteSearch must be a boolean.`);
    }

    return value;
  }

  closeOnSelect(value) {
    if (typeof value !== "boolean") {
      throw new TypeError(`closeOnSelect must be a boolean.`);
    }

    return value;
  }

  autoSelect(value) {
    if (typeof value !== "boolean") {
      throw new TypeError(`autoSelect must be a boolean.`);
    }

    return value;
  }

  renderOption(renderOption) {
    if (!renderOption) return null;

    if (typeof renderOption !== "function") {
      throw new TypeError(`renderOption must be a function`);
    }

    return renderOption;
  }

  placeholder(value) {
    if (typeof value !== "string") {
      throw new TypeError("placeholder must be a string.");
    }

    return value.trim() || "Select";
  }

  validateSelectionLimits() {
    if (
      !Number.isInteger(this.minSelection) ||
      this.minSelection < 0 ||
      !(
        this.maxSelection === Infinity ||
        (Number.isInteger(this.maxSelection) && this.maxSelection >= 0)
      ) ||
      this.minSelection > this.maxSelection
    ) {
      throw new Error("Invalid selection limits.");
    }
  }

  searchable(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("searchable must be a boolean.");
    }

    this.needSearchBox ||= value === true;

    return value;
  }

  onSearch(value) {
    if (value === null) return null;

    if (typeof value !== "function") {
      throw new TypeError("onSearch must be a function.");
    }

    this.needSearchBox = true;

    return value;
  }

  searchPlaceholder(value) {
    if (typeof value !== "string") {
      throw new TypeError("searchPlaceholder must be a string.");
    }

    return value.trim() || "Search...";
  }

  searchDelay(value) {
    if (!Number.isInteger(value) || value < 0) {
      throw new TypeError("searchDelay must be a non-negative integer.");
    }

    return value;
  }

  fetchOptions(value) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new TypeError("fetchOptions must be an object.");
    }

    return value;
  }

  onSelect(value) {
    if (value === null) return null;

    if (typeof value !== "function") {
      throw new TypeError("onSelect must be a function.");
    }

    return value;
  }

  onDeselect(value) {
    if (value === null) return null;

    if (typeof value !== "function") {
      throw new TypeError("onDeselect must be a function.");
    }

    return value;
  }

  onChange(value) {
    if (value === null) return null;

    if (typeof value !== "function") {
      throw new TypeError("onChange must be a function.");
    }

    return value;
  }
}
