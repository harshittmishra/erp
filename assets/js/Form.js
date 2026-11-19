export default class Form {
  constructor(form) {
    this.form = typeof form === "string" ? document.querySelector(form) : form;

    if (!(this.form instanceof HTMLFormElement)) {
      throw new TypeError("A valid HTMLFormElement is required.");
    }

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }

  /**
   * Get all named form controls.
   * Returns: Map<name, element | element[]>
   */
  getElements() {
    const elements = new Map();

    for (const element of this.form.elements) {
      const name = element.name;

      if (!elements.has(name)) {
        elements.set(name, element);
      } else {
        const existing = elements.get(name);

        if (Array.isArray(existing)) {
          existing.push(element);
        } else {
          elements.set(name, [existing, element]);
        }
      }
    }

    return elements;
  }

  /**
   * Get all form values.
   * Returns: Map<name, value | value[]>
   */
  getValues() {
    const values = new Map();

    for (const [name, elements] of this.getElements()) {
      const group = Array.isArray(elements) ? elements : [elements];

      const first = group[0];

      // Radio buttons: selected value only.
      if (first.type === "radio") {
        const selected = group.find((el) => el.checked);
        values.set(name, selected ? selected.value : null);
        continue;
      }

      // Checkboxes: checked values only.
      if (first.type === "checkbox") {
        const checked = group.filter((el) => el.checked);
        values.set(
          name,
          checked.length > 1 || group.length > 1
            ? checked.map((el) => el.value)
            : checked[0]
              ? checked[0].checked
              : false,
        );
        continue;
      }

      // Multiple select: array of selected values.
      if (first instanceof HTMLSelectElement && first.multiple) {
        values.set(
          name,
          Array.from(first.selectedOptions, (option) => option.value),
        );
        continue;
      }

      values.set(name, first.value);
    }

    return values;
  }

  getValue(name) {
    return this.getValues().get(name);
  }

  getElement(name) {
    return this.getElements().get(name) ?? null;
  }

  getObject() {
    return Object.fromEntries(this.getValues());
  }

  getElementsObject() {
    return Object.fromEntries(this.getElements());
  }

  getFormData(extra = {}) {
    const formData = new FormData();

    const values = new Map([...this.getValues(), ...Object.entries(extra)]);

    for (const [name, value] of values) {
      if (value == null) continue;

      (Array.isArray(value) ? value : [value]).forEach((item) =>
        formData.append(name, item),
      );
    }

    return formData;
  }
}
