export default class Selection {
  constructor(options, source) {
    this.options = options;
    this.source = source;
    this.selected = new Map();

    for (const [value, option] of source.data) {
      if (option.selected) {
        this.selected.set(value, option);
      }
    }
  }

  toggle(value) {
    return this.has(value) ? this.deselect(value) : this.select(value);
  }

  select(value) {
    value = String(value);

    const option = this.source.data.get(value);

    if (!option || option.disabled) {
      return false;
    }

    if (this.options.selectionType === "single") {
      this.selected.clear();
    }
    // on multiple selection, respect max limit.
    else if (this.selected.size >= this.options.maxSelection) {
      return false;
    }

    this.selected.set(value, option);

    return true;
  }

  deselect(value) {
    value = String(value);

    if (!this.has(value)) {
      return false;
    }

    // respect min limit.
    if (this.selected.size <= this.options.minSelection) {
      return false;
    }

    return this.selected.delete(value);
  }

  has(value) {
    return this.selected.has(String(value));
  }

  clear() {
    this.selected.clear();
  }

  get() {
    return [...this.selected.values()];
  }

  sync(values) {
    this.selected.clear();

    for (const value of values) {
      const key = String(value);
      const option = this.source.data.get(key);

      if (option) {
        this.selected.set(key, option);
      }
    }
  }

  set(values) {
    if (!Array.isArray(values)) {
      throw new TypeError("Selected values must be an array.");
    }

    const next = new Map();

    for (const value of values) {
      const key = String(value);
      const option = this.source.data.get(key);

      // Reject invalid or disabled options.
      if (!option || option.disabled) {
        return false;
      }

      next.set(key, option);
    }

    // Validate selection type.
    if (this.options.selectionType === "single" && next.size > 1) {
      return false;
    }

    // Validate selection limits.
    if (
      next.size < this.options.minSelection ||
      next.size > this.options.maxSelection
    ) {
      return false;
    }

    // Detect added and removed options.
    const added = [...next]
      .filter(([value]) => !this.selected.has(value))
      .map(([, option]) => option);

    const removed = [...this.selected]
      .filter(([value]) => !next.has(value))
      .map(([, option]) => option);

    // Update selection.
    this.selected = next;

    return { added, removed };
  }
}
