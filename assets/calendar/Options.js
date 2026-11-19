import OptionsPipeline from "../options/OptionsPipeline.js";

export default class Options extends OptionsPipeline {
  constructor(options = {}) {
    super({
      trigger: options.trigger,
      autoTrigger: options.autoTrigger ?? true,
      locale: options.locale ?? null,
      weekStartDay: options.weekStartDay ?? 0,
      monthsInView: options.monthsInView ?? 1,
      fromDate: options.fromDate ?? null,
      tillDate: options.tillDate ?? null,
      selectMode: options.selectMode ?? "multi",
      toggleMode: options.toggleMode ?? false,
      maxSelectedDates: options.maxSelectedDates ?? null,
      presets: options.presets ?? [],
      headerNameFormat: options.headerNameFormat ?? "short",
      dayNameFormat: options.dayNameFormat ?? "compact",
      disableMutedDates: options.disableMutedDates ?? true,
      yearsPerPage: options.yearsPerPage ?? 10,
      positionMode: options.positionMode ?? "floating",
      gap: options.gap ?? [5],
    });

    Object.freeze(this);
  }

  validate() {
    this.validateDateRange();
  }

  validateDateRange() {
    if (
      this.fromDate !== null &&
      this.tillDate !== null &&
      this.fromDate.getTime() > this.tillDate.getTime()
    ) {
      throw new RangeError("fromDate cannot be later than tillDate.");
    }
  }

  // Pipeline transformations
  gap(value) {
    if (
      !Array.isArray(value) ||
      value.length < 1 ||
      value.length > 4 ||
      !value.every((v) => Number.isFinite(v) && v >= 0)
    ) {
      throw new TypeError(
        "gap must be an array of 1 to 4 non-negative numbers.",
      );
    }

    return value;
  }

  weekStartDay(value) {
    return ((value % 7) + 7) % 7;
  }

  fromDate(value) {
    return this.normalizeDate(value, "fromDate");
  }

  tillDate(value) {
    return this.normalizeDate(value, "tillDate");
  }

  // Validation pipeline

  trigger(value) {
    if (value === undefined || value === null) {
      throw new TypeError("trigger must be supplied.");
    }

    if (!(value instanceof HTMLElement)) {
      throw new TypeError("trigger must be an HTML element.");
    }

    return value;
  }

  autoTrigger(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("autoTrigger must be a boolean.");
    }

    return value;
  }

  locale(value) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new TypeError("locale must be an object.");
    }

    return value;
  }

  weekStartDay(value) {
    if (!Number.isInteger(value) || value < 0 || value > 6) {
      throw new TypeError("weekStartDay must be an integer between 0 and 6.");
    }

    return value;
  }

  monthsInView(value) {
    if (!Number.isInteger(value) || value < 1) {
      throw new TypeError("monthsInView must be a positive integer.");
    }

    return value;
  }

  selectMode(value) {
    const allowed = ["single", "multi", "range"];

    if (!allowed.includes(value)) {
      throw new TypeError(`selectMode must be one of: ${allowed.join(", ")}.`);
    }

    return value;
  }

  toggleMode(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("toggleMode must be a boolean.");
    }

    return value;
  }

  maxSelectedDates(value) {
    if (value === null) {
      return;
    }

    if (!Number.isInteger(value) || value < 1) {
      throw new TypeError(
        "maxSelectedDates must be a positive integer or null.",
      );
    }

    return value;
  }

  presets(presets) {
    if (!Array.isArray(presets)) {
      throw new TypeError("presets must be an array.");
    }

    presets.forEach((preset, index) => {
      if (!preset || typeof preset !== "object" || Array.isArray(preset)) {
        throw new TypeError(`presets[${index}] must be an object.`);
      }

      if (typeof preset.name !== "string" || !preset.name.trim()) {
        throw new TypeError(
          `presets[${index}].name must be a non-empty string.`,
        );
      }

      const hasOperation =
        typeof preset.operation === "string" && preset.operation.trim() !== "";

      const hasAmount = preset.amount !== undefined;
      const hasUnit = preset.unit !== undefined;

      if (hasAmount !== hasUnit) {
        throw new TypeError(
          `presets[${index}] must have both amount and unit together.`,
        );
      }

      const hasAmountUnit = hasAmount && hasUnit;
      const hasCallback = typeof preset.callback === "function";

      if (!hasOperation && !hasAmountUnit && !hasCallback) {
        throw new TypeError(
          `presets[${index}] must have either operation, amount + unit, or callback.`,
        );
      }
    });

    return presets;
  }

  headerNameFormat(headerNameFormat) {
    const allowed = ["full", "short"];

    if (!allowed.includes(headerNameFormat)) {
      throw new TypeError(
        `headerNameFormat must be one of: ${allowed.join(", ")}.`,
      );
    }

    return headerNameFormat;
  }

  dayNameFormat(dayNameFormat) {
    const allowed = ["full", "short", "compact"];

    if (!allowed.includes(dayNameFormat)) {
      throw new TypeError(
        `dayNameFormat must be one of: ${allowed.join(", ")}.`,
      );
    }

    return dayNameFormat;
  }

  disableMutedDates(disableMutedDates) {
    if (typeof disableMutedDates !== "boolean") {
      throw new TypeError("disableMutedDates must be a boolean.");
    }

    return disableMutedDates;
  }

  yearsPerPage(yearsPerPage) {
    if (!Number.isInteger(yearsPerPage) || yearsPerPage < 1) {
      throw new TypeError("yearsPerPage must be a positive integer.");
    }

    return yearsPerPage;
  }

  positionMode(positionMode) {
    const allowed = ["fixed", "floating"];

    if (!allowed.includes(positionMode)) {
      throw new TypeError(
        `position mode must be one of: ${allowed.join(", ")}.`,
      );
    }

    return positionMode;
  }

  // Date normalization

  normalizeDate(value, name) {
    if (value === null) {
      return null;
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new TypeError(`${name} must be a valid date.`);
      }

      return this.stripTime(value);
    }

    if (typeof value !== "string") {
      throw new TypeError(`${name} must be a Date, date string, or null.`);
    }

    const date = this.parseDate(value);

    if (!date) {
      throw new TypeError(`${name} must be a valid date in DD-MM-YYYY format.`);
    }

    return date;
  }

  parseDate(value) {
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);

    if (!match) {
      return null;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(year, month - 1, day);

    // Reject dates that JavaScript would otherwise roll over.
    // For example, 31-02-2025 must not become a date in March.
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return this.stripTime(date);
  }

  stripTime(date) {
    const result = new Date(date.getTime());

    result.setHours(0, 0, 0, 0);

    return result;
  }
}
