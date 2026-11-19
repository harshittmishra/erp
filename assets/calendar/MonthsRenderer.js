export default class MonthsRenderer {
  constructor(options) {
    this.options = options;

    this.init();

    this.options.mount.addEventListener("click", (event) => {
      this.handleClick(event);
    });
  }

  init() {
    this.yearElement = this.createHeader();
    this.monthsListElement = this.createMonthList();
    this.months = this.createMonths();
  }

  render(data) {
    this.update(data);
  }

  createHeader() {
    const header = document.createElement("div");
    header.className = "header";

    const monthTitle = document.createElement("div");
    monthTitle.className = "month-title";

    const yearElement = document.createElement("span");
    yearElement.className = "year";

    monthTitle.append(yearElement);
    header.append(monthTitle);

    this.options.mount.append(header);

    return yearElement;
  }

  createMonthList() {
    const monthsList = document.createElement("div");
    monthsList.className = "months-list";

    monthsList.style.setProperty("--columns", 4);

    this.options.mount.append(monthsList);

    return monthsList;
  }

  createMonths() {
    const months = [];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      const month = this.createMonth();

      fragment.append(month.month);
      months.push(month);
    }

    this.monthsListElement.append(fragment);

    return months;
  }

  createMonth() {
    const month = document.createElement("div");
    month.className = "tomonth";

    const effect = document.createElement("div");
    effect.className = "effect";

    const monthName = document.createElement("div");
    monthName.className = "monthname";

    month.append(effect, monthName);

    return {
      month,
      effect,
      monthName,
    };
  }

  update(data) {
    this.yearElement.textContent = this.getYear(data.year);

    for (let i = 0; i < this.months.length; i++) {
      const monthDom = this.months[i];
      const cell = monthDom.month;

      const month = data.months[i];

      // cleaning up
      cell.monthData = null;
      cell.classList.remove("disabled", "hidden", "current");

      if (month === undefined) {
        continue;
      }

      cell.monthData = month;
      monthDom.monthName.textContent = this.getMonthName(month);
      cell.classList.toggle("disabled", month.notAllowed === true);
    }
  }

  getMonthName(month, format = this.options.headerNameFormat) {
    return this.options.locale.months[format][month.month];
  }

  getYear(year) {
    return String(year);
  }

  handleClick(event) {
    const month = event.target.closest(".tomonth");

    if (month && this.options.mount.contains(month)) {
      this.handleMonthClick(month);
      return;
    }

    const yearViewTrigger = event.target.closest(".month-title");

    if (yearViewTrigger && this.options.mount.contains(yearViewTrigger)) {
      this.options.onYearViewClick?.();
      return;
    }
  }

  handleMonthClick(cell) {
    const month = cell.monthData;

    if (!month || month.notAllowed) {
      return;
    }

    this.options.onMonthClick?.(month);
  }

  renderState(renderFrom) {
    const month = renderFrom.getMonth();
    const year = renderFrom.getFullYear();

    this.months.forEach((monthDom) => {
      const cell = monthDom.month;

      cell.classList.remove("current");

      if (cell.monthData.month === month && cell.monthData.year === year) {
        cell.classList.add("current");
      }
    });
  }
}
