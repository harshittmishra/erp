import Options from "./Options.js";
import Source from "./Source.js";
import Renderer from "./Renderer.js";
import Selection from "./Selection.js";
import Search from "./Search.js";

export default class Select {
  constructor(rawOptions) {
    this.options = new Options(rawOptions);
    this.renderer = null;
    this.source = null;
    this.selection = null;
    this.search = null;

    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  /**
   * Public entry point.
   * Creates Select instances for all matching elements.
   */
  static async create(target = ".select", options = {}) {
    const elements = [];

    if (typeof target === "string") {
      target = document.querySelectorAll(target);
    }

    if (target instanceof HTMLElement) {
      elements.push(target);
    } else {
      elements.push(...target);
    }

    return Promise.all(
      elements.map(async (element) => {
        const instance = new Select({
          ...options,
          mount: element,
        });

        await instance.init();

        return instance;
      }),
    );
  }

  /**
   * Initializes an individual Select instance.
   */
  async init() {
    this.renderer = new Renderer(this.options);
    this.renderer.init();

    this.source = await Source.create(this.options);
    this.selection = new Selection(this.options, this.source);

    this.renderer.setDataSource(this.source);
    this.renderer.setSelection(this.selection);

    this.renderer.render();

    if (this.options.searchable) {
      this.search = new Search(this.options, this.source, this.renderer);
      this.search.init();
    }

    this.renderer.panel.addEventListener("click", this.handleOptionClick);
  }

  emitSelectionChange({ action, changed = null }) {
    const selected = this.selection.get();

    const data = {
      selected,
      changed,
      action,
    };

    // General selection change callback.
    this.options.onChange?.(data);

    // Specific callbacks.
    if (action === "select") {
      this.options.onSelect?.(data);
    }

    if (action === "deselect") {
      this.options.onDeselect?.(data);
    }

    return data;
  }

  handleOptionClick(event) {
    const option = event.target.closest(".option");

    if (!option || !this.renderer.panel.contains(option)) return;

    const value = option.dataset.value;

    // Determine action before changing selection.
    const action = this.selection.has(value) ? "deselect" : "select";

    const changed = this.selection.toggle(value);

    if (!changed) return;

    this.renderer.renderSelection();
    this.renderer.dispatchNativeChange();

    // Notify callbacks.
    this.emitSelectionChange({
      action,
      changed: this.source.data.get(value),
    });

    if (this.options.selectionType !== "multiple") {
      this.renderer.toggle.close();
    }
  }

  getSelected() {
    return this.selection.get();
  }

  getSelectedValues() {
    return this.selection.get().map((option) => option.value);
  }

  setSelected(values) {
    const previous = this.getSelected();

    const result = this.selection.set(values);

    // Invalid selection.
    if (result === false) return false;

    // Nothing changed.
    if (!result.added.length && !result.removed.length) {
      return true;
    }

    // Update UI and native select.
    this.renderer.renderSelection();
    this.renderer.dispatchNativeChange();

    // Notify deselected options.
    result.removed.forEach((option) => {
      this.options.onDeselect?.({
        selected: this.getSelected(),
        values: this.getSelectedValues(),
        labels: this.getSelected().map((item) => item.label),
        changed: option,
        action: "deselect",
      });
    });

    // Notify selected options.
    result.added.forEach((option) => {
      this.options.onSelect?.({
        selected: this.getSelected(),
        values: this.getSelectedValues(),
        labels: this.getSelected().map((item) => item.label),
        changed: option,
        action: "select",
      });
    });

    // Notify overall change once.
    this.emitSelectionChange({
      action: "set",
      changed: null,
    });

    return true;
  }

  clearSelection() {
    const previous = this.getSelected();

    // Nothing to clear.
    if (!previous.length) return false;

    // Respect minSelection.
    if (this.selection.selected.size <= this.options.minSelection) {
      return false;
    }

    this.selection.clear();

    // Update UI and native select.
    this.renderer.renderSelection();
    this.renderer.dispatchNativeChange();

    // Notify individual deselections.
    previous.forEach((option) => {
      this.options.onDeselect?.({
        selected: [],
        values: [],
        labels: [],
        changed: option,
        action: "deselect",
      });
    });

    // Notify overall change once.
    this.emitSelectionChange({
      action: "clear",
      changed: null,
    });

    return true;
  }

  sync() {
    if (!this.options.isNative) {
      return false;
    }

    const selectedValues = Array.from(
      this.options.nativeSelect.selectedOptions,
    ).map((option) => option.value);

    const previousValues = this.getSelectedValues();

    // Synchronize internal selection.
    this.selection.sync(selectedValues);

    // Update custom UI.
    this.renderer.renderSelection();

    const currentValues = this.getSelectedValues();

    // Notify only when something actually changed.
    if (
      previousValues.length !== currentValues.length ||
      previousValues.some((value) => !currentValues.includes(value))
    ) {
      this.emitSelectionChange({
        action: "sync",
        changed: null,
      });
    }

    return true;
  }

  destroy() {
    this.renderer.panel.removeEventListener("click", this.handleOptionClick);

    this.search?.destroy();
    this.renderer?.destroy();
  }
}
