export default class DatesModel {
  constructor(options) {
    this.options = options;

    // Years view navigation state.
    this.yearsPage = 0;

    // Months view navigation state.
    // When null, the current year is derived from renderFrom.
    this.monthsYear = null;

    const initialMonth = options.renderFrom
      ? this.getMonthStart(options.renderFrom)
      : this.getMonthStart(new Date());

    this.renderFrom = this.resolveInitialMonth(initialMonth);

    this.syncYearsPage(this.renderFrom.getFullYear());

    this.today = this.normalizeDate(new Date());
  }

  // ============================================================
  // MONTH GENERATION
  // ============================================================

  /**
   * Generate consecutive months starting from the current month.
   *
   * @param {number} count
   * @returns {Array}
   */
  getMonths(count = 1) {
    count = Math.max(1, count);

    const months = [];

    for (let index = 0; index < count; index++) {
      const monthDate = this.addMonths(this.renderFrom, index);

      if (!this.isMonthAllowed(monthDate)) {
        break;
      }

      months.push(this.createMonth(monthDate));
    }

    return months;
  }

  /**
   * Generate a single month structure.
   *
   * @param {Date} date
   * @returns {Object}
   */
  createMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startPadding = this.getDaysPadding(
      firstDay.getDay(),
      this.options.weekStartDay,
    );

    const totalCells = startPadding + daysInMonth;
    const totalSlots = Math.ceil(totalCells / 7) * 7;

    const days = [];

    for (let index = 0; index < totalSlots; index++) {
      const dayOffset = index - startPadding + 1;
      const dayDate = new Date(year, month, dayOffset);

      days.push(this.createDay(dayDate, year, month));
    }

    return {
      year,
      month,
      days,
    };
  }

  /**
   * Generate a single day object.
   *
   * @param {Date} date
   * @param {number} monthYear
   * @param {number} month
   * @returns {Object}
   */
  createDay(date, monthYear, month) {
    const normalizedDate = this.normalizeDate(date);

    const day = {
      date: normalizedDate,
      day: normalizedDate.getDate(),
      weekday: normalizedDate.getDay(),
    };

    if (normalizedDate.getTime() === this.today.getTime()) {
      day.isToday = true;
    }

    if (
      normalizedDate.getFullYear() !== monthYear ||
      normalizedDate.getMonth() !== month
    ) {
      day.notCurrentMonth = true;
    }

    if (!this.isDateAllowed(normalizedDate)) {
      day.notAllowed = true;
    }

    return day;
  }

  // ============================================================
  // MONTH NAVIGATION
  // ============================================================

  /**
   * Move to a specific month.
   *
   * @param {Date|string|number} date
   * @returns {boolean}
   */
  goTo(date) {
    const month = this.getMonthStart(new Date(date));

    if (!this.isMonthAllowed(month)) {
      return false;
    }

    this.renderFrom = month;

    this.syncYearsPage(month.getFullYear());

    // The month selector pointer is no longer needed
    // after selecting a month.
    this.monthsYear = null;

    return true;
  }

  goToMonth(year, month) {
    return this.goTo(new Date(year, month, 1));
  }

  goToYear(year) {
    const date = new Date(year, this.renderFrom.getMonth(), 1);

    if (!this.isMonthAllowed(date)) {
      return this.goTo(new Date(year, 0, 1));
    }

    return this.goTo(date);
  }

  /**
   * Move to the next month.
   *
   * @param {number} step
   * @returns {boolean}
   */
  next(step = 1) {
    const month = this.addMonths(this.renderFrom, step);

    if (!this.isMonthAllowed(month)) {
      return false;
    }

    this.renderFrom = month;

    this.syncYearsPage(month.getFullYear());

    return true;
  }

  /**
   * Move to the previous month.
   *
   * @param {number} step
   * @returns {boolean}
   */
  prev(step = 1) {
    const month = this.addMonths(this.renderFrom, -step);

    if (!this.isMonthAllowed(month)) {
      return false;
    }

    this.renderFrom = month;

    this.syncYearsPage(month.getFullYear());

    return true;
  }

  /**
   * Check whether the next month is available.
   *
   * @returns {boolean}
   */
  hasNext() {
    return this.isMonthAllowed(this.addMonths(this.renderFrom, 1));
  }

  /**
   * Check whether the previous month is available.
   *
   * @returns {boolean}
   */
  hasPrev() {
    return this.isMonthAllowed(this.addMonths(this.renderFrom, -1));
  }

  // ============================================================
  // DATE VALIDATION
  // ============================================================

  /**
   * Check whether a specific date is inside the allowed range.
   *
   * @param {Date} date
   * @returns {boolean}
   */
  isDateAllowed(date) {
    const value = this.normalizeDate(date);

    if (this.options.fromDate && value < this.options.fromDate) {
      return false;
    }

    if (this.options.tillDate && value > this.options.tillDate) {
      return false;
    }

    return true;
  }

  /**
   * Check whether a month intersects the allowed date range.
   *
   * A month is allowed when at least one day of that month
   * falls inside the configured date range.
   *
   * @param {Date} date
   * @returns {boolean}
   */
  isMonthAllowed(date) {
    const monthStart = this.getMonthStart(date);

    if (
      this.options.fromDate &&
      this.getMonthEnd(monthStart) < this.options.fromDate
    ) {
      return false;
    }

    if (this.options.tillDate && monthStart > this.options.tillDate) {
      return false;
    }

    return true;
  }

  // ============================================================
  // DATE CALCULATIONS
  // ============================================================

  /**
   * Return the first day of a month.
   *
   * @param {Date} date
   * @returns {Date}
   */
  getMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Return the last day of a month.
   *
   * @param {Date} date
   * @returns {Date}
   */
  getMonthEnd(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  /**
   * Remove the time component from a date.
   *
   * @param {Date} date
   * @returns {Date}
   */
  normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Add or subtract months.
   *
   * Always returns the first day of the resulting month.
   *
   * @param {Date} date
   * @param {number} amount
   * @returns {Date}
   */
  addMonths(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  }

  /**
   * Calculate the number of leading cells required
   * before the first day of a month.
   *
   * @param {number} firstWeekday
   * @param {number} weekStartDay
   * @returns {number}
   */
  getDaysPadding(firstWeekday, weekStartDay = this.options.weekStartDay) {
    return (firstWeekday - weekStartDay + 7) % 7;
  }

  // ============================================================
  // INITIAL MONTH
  // ============================================================

  /**
   * Resolve the initial month when renderFrom is outside
   * the configured date range.
   *
   * @param {Date} month
   * @returns {Date}
   */
  resolveInitialMonth(month) {
    if (this.isMonthAllowed(month)) {
      return month;
    }

    if (this.options.fromDate) {
      return this.getMonthStart(this.options.fromDate);
    }

    if (this.options.tillDate) {
      return this.getMonthStart(this.options.tillDate);
    }

    return month;
  }

  // ============================================================
  // YEAR NAVIGATION
  // ============================================================

  /**
   * Return the years belonging to the current year page.
   *
   * @returns {Array<number>}
   */
  getYears() {
    const yearsPerPage = this.options.yearsPerPage;
    const startYear = this.getYearsStartYear() + this.yearsPage * yearsPerPage;

    const years = [];

    for (let index = 0; index < yearsPerPage; index++) {
      const year = startYear + index;
      const yearData = { year };

      if (!this.isYearAllowed(year)) {
        yearData.notAllowed = true;
      }

      years.push(yearData);
    }

    return years;
  }

  /**
   * Move to the next year page.
   *
   * @returns {boolean}
   */
  nextYearPage() {
    if (!this.hasNextYearPage()) {
      return false;
    }

    this.yearsPage++;

    return true;
  }

  /**
   * Move to the previous year page.
   *
   * @returns {boolean}
   */
  prevYearPage() {
    if (!this.hasPrevYearPage()) {
      return false;
    }

    this.yearsPage--;

    return true;
  }

  /**
   * Check whether another year page exists.
   *
   * @returns {boolean}
   */
  hasNextYearPage() {
    if (!this.options.fromDate || !this.options.tillDate) {
      return false;
    }

    const totalYears =
      this.options.tillDate.getFullYear() -
      this.options.fromDate.getFullYear() +
      1;

    return (this.yearsPage + 1) * this.options.yearsPerPage < totalYears;
  }

  /**
   * Check whether a previous year page exists.
   *
   * @returns {boolean}
   */
  hasPrevYearPage() {
    return this.yearsPage > 0;
  }

  /**
   * Synchronize the year page with a calendar year.
   *
   * @param {number} year
   */
  syncYearsPage(year) {
    const fromYear = this.getYearsStartYear();

    this.yearsPage = Math.max(
      0,
      Math.floor((year - fromYear) / this.options.yearsPerPage),
    );
  }

  /**
   * Get the first year available to the year selector.
   *
   * @returns {number}
   */
  getYearsStartYear() {
    return this.options.fromDate
      ? this.options.fromDate.getFullYear()
      : new Date().getFullYear();
  }

  // ============================================================
  // MONTH SELECTOR
  // ============================================================

  /**
   * Return the year currently displayed by the month selector.
   *
   * If the month selector has not been navigated yet,
   * use the year represented by the Dates view.
   *
   * @returns {number}
   */
  getMonthsYear() {
    return this.monthsYear ?? this.renderFrom.getFullYear();
  }

  /**
   * Set the year displayed by the month selector.
   *
   * @param {number} year
   * @returns {boolean}
   */
  setMonthsYear(year) {
    if (!this.isYearAllowed(year)) {
      return false;
    }

    this.monthsYear = year;

    return true;
  }

  /**
   * Move the month selector to the next year.
   *
   * @returns {boolean}
   */
  nextYear() {
    const year = this.getMonthsYear() + 1;

    if (!this.isYearAllowed(year)) {
      return false;
    }

    this.monthsYear = year;

    return true;
  }

  /**
   * Move the month selector to the previous year.
   *
   * @returns {boolean}
   */
  prevYear() {
    const year = this.getMonthsYear() - 1;

    if (!this.isYearAllowed(year)) {
      return false;
    }

    this.monthsYear = year;

    return true;
  }

  /**
   * Check whether a year contains at least one allowed month.
   *
   * @param {number} year
   * @returns {boolean}
   */
  isYearAllowed(year) {
    return this.getYearMonths(year).months.some((month) => !month.notAllowed);
  }

  /**
   * Return the twelve numerical months of a year.
   *
   * @param {number} year
   * @returns {Object}
   */
  getYearMonths(year = null) {
    if (year === null) {
      if (this.monthsYear === null) {
        this.monthsYear = this.renderFrom.getFullYear();
      }

      year = this.monthsYear;
    }

    const months = [];

    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);

      const monthData = {
        year,
        month,
      };

      if (!this.isMonthAllowed(date)) {
        monthData.notAllowed = true;
      }

      months.push(monthData);
    }

    return {
      year,
      months,
    };
  }

  getRenderFrom() {
    return this.renderFrom;
  }

  getToday() {
    return this.today;
  }
}
