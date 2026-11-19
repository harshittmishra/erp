export default class DateSelector {
  constructor(options) {
    this.options = options;
  }

  select(selectedDates, date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new TypeError("date must be a valid Date.");
    }

    if (!Array.isArray(selectedDates)) {
      throw new TypeError("selectedDates must be an array.");
    }

    switch (this.options.selectMode) {
      case "single":
        return this.selectSingle(selectedDates, date);

      case "multi":
        return this.selectMulti(selectedDates, date);

      case "range":
        return this.selectRange(selectedDates, date);

      default:
        return selectedDates;
    }
  }

  selectSingle(selectedDates, date) {
    const current = selectedDates[0];

    // Nothing selected.
    if (!current) {
      return [date];
    }

    // Same date.
    if (this.isSameDate(current, date)) {
      return this.options.toggleMode ? [] : selectedDates;
    }

    // Different date replaces current selection.
    return [date];
  }

  selectMulti(selectedDates, date) {
    const index = selectedDates.findIndex((selectedDate) =>
      this.isSameDate(selectedDate, date),
    );

    // Already selected.
    if (index !== -1) {
      if (!this.options.toggleMode) {
        return selectedDates;
      }

      return selectedDates.filter((_, i) => i !== index);
    }

    // Maximum reached.
    if (
      this.options.maxSelectedDates !== null &&
      selectedDates.length >= this.options.maxSelectedDates
    ) {
      return selectedDates;
    }

    return [...selectedDates, date];
  }

  selectRange(selectedDates, date) {
    const count = selectedDates.length;

    // Nothing selected.
    if (count === 0) {
      return [date];
    }

    // One date selected.
    if (count === 1) {
      const start = selectedDates[0];

      // Same date.
      if (this.isSameDate(start, date)) {
        return this.options.toggleMode ? [] : selectedDates;
      }

      // Earlier date starts a new range.
      if (date < start) {
        return [date];
      }

      // Later date completes range.
      return [start, date];
    }

    // Two dates selected.
    const start = selectedDates[0];
    const end = selectedDates[1];

    // Click first endpoint.
    if (this.isSameDate(date, start)) {
      return this.options.toggleMode ? [end] : selectedDates;
    }

    // Click second endpoint.
    if (this.isSameDate(date, end)) {
      return this.options.toggleMode ? [start] : selectedDates;
    }

    // Any new date starts a new range.
    return [date];
  }

  isSameDate(a, b) {
    return a.getTime() === b.getTime();
  }
}
