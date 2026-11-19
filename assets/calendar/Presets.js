export default class Presets {
  constructor(options, anchorDate) {
    this.options = options;
    this.anchorDate = anchorDate;
  }

  resolve(preset) {
    // validate any operation must return array of max 2 dates.

    if (typeof preset.callback === "function") {
      return this.resolveCallback(preset);
    }

    if (preset.operation !== undefined) {
      return this.resolveOperation(preset);
    }

    if (preset.amount !== undefined && preset.unit !== undefined) {
      return this.resolveAdjustment(preset);
    }

    throw new TypeError("Invalid preset definition.");
  }

  resolveOperation(preset) {
    const operation = this[preset.operation];

    if (typeof operation !== "function") {
      throw new Error(`Unknown preset operation "${preset.operation}".`);
    }

    return operation.call(this);
  }

  resolveAdjustment(preset) {
    return this.adjust(preset.amount, preset.unit);
  }

  resolveCallback(preset) {
    return preset.callback(this.anchorDate);
  }

  adjust(amount, unit) {
    const start = new Date(this.anchorDate);
    const end = new Date(this.anchorDate);

    switch (unit) {
      case "day":
      case "days":
        end.setDate(end.getDate() + amount);
        break;

      case "month":
      case "months":
        end.setMonth(end.getMonth() + amount);
        break;

      case "year":
      case "years":
        end.setFullYear(end.getFullYear() + amount);
        break;

      default:
        throw new Error(`Unsupported preset unit "${unit}".`);
    }

    return amount >= 0 ? [start, end] : [end, start];
  }

  today() {
    return [this.anchorDate, new Date(this.anchorDate)];
  }

  thisWeek() {
    const start = new Date(this.anchorDate);

    const day = start.getDay();
    const diff = (day - this.options.weekStartDay + 7) % 7;

    start.setDate(start.getDate() - diff);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    return [start, end];
  }

  thisMonth() {
    const start = new Date(
      this.anchorDate.getFullYear(),
      this.anchorDate.getMonth(),
      1,
    );

    const end = new Date(
      this.anchorDate.getFullYear(),
      this.anchorDate.getMonth() + 1,
      0,
    );

    return [start, end];
  }

  lastWeek() {
    const currentWeek = this.thisWeek();

    const start = new Date(currentWeek[0]);
    start.setDate(start.getDate() - 7);

    const end = new Date(currentWeek[1]);
    end.setDate(end.getDate() - 7);

    return [start, end];
  }

  lastMonth() {
    const start = new Date(
      this.anchorDate.getFullYear(),
      this.anchorDate.getMonth() - 1,
      1,
    );

    const end = new Date(
      this.anchorDate.getFullYear(),
      this.anchorDate.getMonth(),
      0,
    );

    return [start, end];
  }

  yesterday() {
    const date = new Date(this.anchorDate);
    date.setDate(date.getDate() - 1);

    return [date, new Date(date)];
  }

  tomorrow() {
    const date = new Date(this.anchorDate);
    date.setDate(date.getDate() + 1);

    return [date, new Date(date)];
  }

  nextWeek() {
    const currentWeek = this.thisWeek();

    const start = new Date(currentWeek[0]);
    start.setDate(start.getDate() + 7);

    const end = new Date(currentWeek[1]);
    end.setDate(end.getDate() + 7);

    return [start, end];
  }

  nextMonth() {
    const start = new Date(
      this.anchorDate.getFullYear(),
      this.anchorDate.getMonth() + 1,
      1,
    );

    const end = new Date(
      this.anchorDate.getFullYear(),
      this.anchorDate.getMonth() + 2,
      0,
    );

    return [start, end];
  }

  thisYear() {
    const year = this.anchorDate.getFullYear();

    return [new Date(year, 0, 1), new Date(year, 11, 31)];
  }

  lastYear() {
    const year = this.anchorDate.getFullYear() - 1;

    return [new Date(year, 0, 1), new Date(year, 11, 31)];
  }

  nextYear() {
    const year = this.anchorDate.getFullYear() + 1;

    return [new Date(year, 0, 1), new Date(year, 11, 31)];
  }
}
