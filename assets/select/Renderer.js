import Toggle from "../toggle/Toggle.js";

export default class Renderer {
  constructor(options) {
    this.options = options;
    this.hasRendered = false;
    this.nativeOptionsSynced = false;

    this.mount = options.mount;
    this.trigger = null;
    this.panel = null;
    this.toggle = null;

    this.optionsWrapper = null;
    this.optionStub = null;
    this.optionElements = new Map();

    this.isDispatchingNativeChange = false;
    this.handleNativeChange = this.handleNativeChange.bind(this);
  }

  setDataSource(source) {
    this.source = source;
  }
  setSelection(selection) {
    this.selection = selection;
  }

  init() {
    if (this.hasRendered) {
      return;
    }

    // resolving wrapper
    this.wrapper = this.mount.matches(".select") ? this.mount : null;

    if (!this.wrapper) {
      this.wrapper = document.createElement("div");
      this.wrapper.className = "select";

      // wrap nativeSelect
      if (this.options.isNative) {
        this.options.nativeSelect.replaceWith(this.wrapper);
        this.wrapper.appendChild(this.options.nativeSelect);
        this.options.nativeSelect.setAttribute("hidden", "true");
      }
      //insert into mount.
      else {
        this.mount.appendChild(this.wrapper);
      }
    }

    //resolving trigger
    this.trigger = this.wrapper.querySelector(":scope > .trigger");

    if (!this.trigger) {
      this.trigger = document.createElement("div");
      this.trigger.className = "selected";

      this.wrapper.appendChild(this.trigger);
    }

    this.panel = this.wrapper.querySelector(":scope > .panel");

    if (!this.panel) {
      this.panel = document.createElement("div");
      this.panel.className = "panel";

      this.wrapper.appendChild(this.panel);
    }

    // attaching toggle
    this.toggle = new Toggle({
      trigger: this.trigger,
      panel: this.panel,
      setAttribute: "data-state",
      initialState: "closed",
      onOpen: (e) => {
        this.focusOnOpen();
      },
    });

    this.buildPanel();

    if (this.options.isNative) {
      // syncing multiple attribute to native select.
      this.options.nativeSelect.multiple =
        this.options.selectionType === "multiple";

      this.options.nativeSelect.addEventListener(
        "change",
        this.handleNativeChange,
      );
    }

    this.hasRendered = true;
  }

  buildPanel() {
    const fragment = document.createDocumentFragment();

    this.createOptionStub();

    //building searchbox if needed.
    if (this.options.needSearchBox) {
      fragment.append(this.buildSearchBox());
    }

    //build options wrapper
    this.optionsWrapper = document.createElement("div");
    this.optionsWrapper.className = "options";

    fragment.append(this.optionsWrapper);

    //replace existing elements in panel.
    this.panel.replaceChildren(fragment);
  }

  createOptionStub() {
    //creating a option stub to reuse.
    this.optionStub = document.createElement("div");
    this.optionStub.className = "option";
  }

  buildSearchBox() {
    const searchWrapper = document.createElement("div");
    searchWrapper.className = "search";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "search-input";
    searchInput.placeholder = this.options.searchPlaceholder || "Search...";

    searchWrapper.appendChild(searchInput);
    this.searchInput = searchInput;

    return searchWrapper;
  }

  render(data = this.source.data) {
    this.syncNativeOptions();
    this.renderOptions(data);
    this.renderSelection();
  }

  syncNativeOptions(force = false) {
    if (!this.options.isNative) return;
    if (this.nativeOptionsSynced && !force) return;

    const nativeSelect = this.options.nativeSelect;
    const fragment = document.createDocumentFragment();

    for (const option of this.source.data.values()) {
      const element = document.createElement("option");

      element.value = String(option.value);
      element.textContent = option.label;
      element.disabled = !!option.disabled;

      fragment.appendChild(element);
    }

    nativeSelect.replaceChildren(fragment);

    this.nativeOptionsSynced = true;
  }

  renderOptions(data) {
    //validate data must be map.
    if (!(data instanceof Map)) {
      throw new Error("Options data must be a Map.");
    }

    const fragment = document.createDocumentFragment();

    this.optionElements.clear();

    let index = 0;

    for (const [value, option] of data) {
      const element = this.createOption(option, index++);

      this.optionElements.set(String(value), element);
      fragment.appendChild(element);
    }

    this.optionsWrapper.replaceChildren(fragment);
  }

  createOption(option, index) {
    if (typeof this.options.renderOption === "function") {
      return this.options.renderOption(option, {
        index,
        options: this.options,
        renderer: this,
      });
    }

    return this.defaultOption(option);
  }

  defaultOption(option) {
    const element = this.optionStub.cloneNode(false);

    element.dataset.value = option.value;
    element.textContent = option.label;

    element.classList.toggle("disabled", !!option.disabled);
    element.toggleAttribute("selected", !!option.selected);

    return element;
  }

  renderSelection() {
    const selectedOptions = this.selection.get();

    // Synchronize custom option elements.
    for (const [value, element] of this.optionElements) {
      element.toggleAttribute("selected", this.selection.has(value));
    }

    // Synchronize native select options.
    if (this.options.isNative) {
      for (const option of this.options.nativeSelect.options) {
        option.selected = this.selection.has(option.value);
      }
    }

    // Render selected value in trigger.
    if (!selectedOptions.length) {
      this.renderPlaceholder();
      return;
    }

    const currentOption = this.trigger.querySelector(".option");

    const element = document.createElement("div");
    element.className = "option";

    element.textContent = selectedOptions
      .map((option) => option.label)
      .join(", ");

    if (currentOption) {
      currentOption.replaceWith(element);
    } else {
      this.trigger.prepend(element);
    }
  }

  renderPlaceholder() {
    const currentOption = this.trigger.querySelector(".option");

    const element = document.createElement("div");

    element.className = "option placeholder";
    element.textContent = this.options.placeholder;

    if (currentOption) {
      currentOption.replaceWith(element);
    } else {
      this.trigger.prepend(element);
    }
  }

  handleNativeChange() {
    if (this.isDispatchingNativeChange) return;

    const nativeSelect = this.options.nativeSelect;

    const selectedValues = Array.from(nativeSelect.selectedOptions).map(
      (option) => option.value,
    );

    const result = this.selection.set(selectedValues);

    if (result === false) {
      this.renderSelection();
      return;
    }

    this.renderSelection();

    if (!result.added.length && !result.removed.length) {
      return;
    }

    this.options.onChange?.({
      selected: this.selection.get(),
      changed: null,
      action: "sync",
    });
  }

  dispatchNativeChange() {
    if (!this.options.isNative) return;

    this.isDispatchingNativeChange = true;

    try {
      this.options.nativeSelect.dispatchEvent(
        new Event("change", { bubbles: true }),
      );
    } finally {
      this.isDispatchingNativeChange = false;
    }
  }

  focusOnOpen() {
    requestAnimationFrame(() => {
      const target = this.searchInput;

      if (!target?.isConnected || target.disabled) return;

      target.focus({ preventScroll: true });
    });
  }

  destroy() {
    this.toggle?.destroy();

    if (this.options.isNative) {
      this.options.nativeSelect.removeEventListener(
        "change",
        this.handleNativeChange,
      );
    }
  }
}
