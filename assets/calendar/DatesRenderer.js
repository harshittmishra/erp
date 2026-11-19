export default class DatesRenderer {
  DAY_STATE_CLASSES = [
    "hidden",
    "disabled",
    "muted",
    "today",
    "selected",
    "range-selected",
    "range-start",
    "range-end",
  ];

  constructor(options) {
    this.options = options;

    // DOM pool for month views.
    this.months = [];
    this.renderedMonths = new Set();

    this.options.mount.addEventListener("click", (event) => {
      this.handleClick(event);
    });
  }

  render(months) {
    this.renderedMonths.clear();

    for (let i = 0; i < months.length; i++) {
      // If no DOM, create it.
      if (!this.months[i]) {
        this.months.push(this.buildMonthView());
      }

      // Render data.
      this.update(this.months[i], months[i]);

      // Track rendered months.
      this.renderedMonths.add(`${months[i].month}-${months[i].year}`);

      // Unhide rendered month.
      this.months[i].month.classList.remove("hidden");
    }

    // Hide unused month views.
    for (let i = months.length; i < this.months.length; i++) {
      this.months[i].month.classList.add("hidden");
    }
  }

  buildMonthView() {
    const month = document.createElement("div");
    month.className = "month";

    const { header, monthName, yearName } = this.buildHeader();
    const weekdays = this.buildWeekDayNames();

    const daysElement = document.createElement("div");
    daysElement.className = "days grid";

    const days = this.buildDays(daysElement);

    month.append(header, weekdays, daysElement);
    this.options.mount.append(month);

    return {
      month,
      monthName,
      yearName,
      days,
    };
  }

  buildHeader() {
    const header = document.createElement("div");
    header.className = "header";

    const { title, monthName, yearName } = this.buildMonthTitle();

    header.append(title);

    return {
      header,
      monthName,
      yearName,
    };
  }

  buildMonthTitle() {
    const title = document.createElement("div");
    title.className = "month-title";

    title.classList.toggle("short", this.options.headerNameFormat === "short");

    const monthName = document.createElement("div");
    monthName.className = "month-name";

    const yearName = document.createElement("div");
    yearName.className = "year-name";

    title.append(monthName, yearName);

    return {
      title,
      monthName,
      yearName,
    };
  }

  buildWeekDayNames() {
    const weekdays = document.createElement("div");
    weekdays.className = "weekdays grid";

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 7; i++) {
      const weekday = (this.options.weekStartDay + i) % 7;

      const cell = document.createElement("div");
      cell.className = "cell";

      const dayname = document.createElement("span");
      dayname.className = "dayname";

      dayname.textContent = this.getDayName(
        weekday,
        this.options.dayNameFormat,
      );

      cell.append(dayname);
      fragment.append(cell);
    }

    weekdays.append(fragment);

    return weekdays;
  }

  buildDays(daysElement) {
    const days = [];

    for (let i = 0; i < 42; i++) {
      const cell = this.createDayCell();

      daysElement.append(cell.cell);

      days.push({
        cell: cell.cell,
        dayname: cell.dayname,
      });
    }

    return days;
  }

  createDayCell() {
    const cell = document.createElement("div");
    cell.className = "cell day";

    const effect = document.createElement("span");
    effect.className = "effect";

    const dayname = document.createElement("span");
    dayname.className = "dayname";

    const toggle = document.createElement("span");
    toggle.className = "date-toggle";
    toggle.innerHTML = "&times;";

    cell.append(effect, dayname, toggle);

    return {
      cell,
      dayname,
    };
  }

  update(monthDom, monthData) {
    // Updating header.
    monthDom.monthName.textContent = this.getMonthName(monthData.month);

    monthDom.yearName.textContent = this.getYear(monthData.year);

    // Updating day's grid.
    const daysDom = monthDom.days;

    for (let i = 0; i < daysDom.length; i++) {
      const day = monthData.days[i];
      const cell = daysDom[i].cell;

      // Reset recycled DOM state.
      this.purgeDayCell(cell);

      if (!day) {
        cell.classList.add("hidden");
        continue;
      }

      // Updating data into cell DOM.
      cell.dayData = day;

      daysDom[i].dayname.textContent = this.getDayDigit(day.day);

      cell.classList.toggle("disabled", !!day.notAllowed);

      cell.classList.toggle("muted", !!day.notCurrentMonth);

      cell.classList.toggle("today", !!day.isToday);
    }
  }

  getDayDigit(value) {
    const digits = this.options.locale?.digits;

    if (!digits) {
      return value;
    }

    return String(value)
      .split("")
      .map((digit) => digits[digit] ?? digit)
      .join("");
  }

  getDayName(day, format = this.options.dayNameFormat) {
    return this.options.locale.weekdays[format][day];
  }

  getMonthName(month, format = this.options.headerNameFormat) {
    return this.options.locale.months[format][month];
  }

  getYear(year, format = this.options.headerNameFormat) {
    return format === "short" ? String(year).slice(-2) : String(year);
  }

  handleClick(event) {
    const day = event.target.closest(".day");

    if (day && this.options.mount.contains(day)) {
      this.handleDayClick(day);
      return;
    }

    const monthsTitle = event.target.closest(".month-title");

    if (monthsTitle && this.options.mount.contains(monthsTitle)) {
      this.options.onMonthViewClick?.();
      return;
    }
  }

  handleDayClick(cell) {
    const day = cell.dayData;

    if (!day || day.notAllowed) {
      return;
    }

    if (day.notCurrentMonth && this.options.disableMutedDates) {
      return;
    }

    this.options.onDateClick?.(day.date);
  }

  renderSelection(dates = [], selectionMode = this.options.selectMode) {
    switch (selectionMode) {
      case "single":
        this.renderSingleSelection(dates);
        break;

      case "range":
        this.renderRangeSelection(dates);
        break;

      case "multi":
      default:
        this.renderMultiSelection(dates);
        break;
    }
  }

  renderMultiSelection(dates) {
    for (const month of this.months) {
      for (const day of month.days) {
        const dayData = day.cell?.dayData;

        if (!dayData) {
          continue;
        }

        const selected = dates.some(
          (date) => date.getTime() === dayData.date.getTime(),
        );

        day.cell.classList.toggle("selected", selected);
      }
    }
  }

  renderSingleSelection(dates) {
    const selectedDate = dates[0];

    for (const month of this.months) {
      for (const day of month.days) {
        const dayData = day.cell?.dayData;

        if (!dayData) {
          continue;
        }

        const selected =
          selectedDate && selectedDate.getTime() === dayData.date.getTime();

        day.cell.classList.toggle("selected", !!selected);
      }
    }
  }

  renderRangeSelection(dates) {
    const start = dates[0];
    const end = dates[1];

    const startTime = start?.getTime();
    const endTime = end?.getTime();

    const startMonthRendered = start && this.isMonthRendered(start);

    const endMonthRendered = end && this.isMonthRendered(end);

    for (const month of this.months) {
      for (const day of month.days) {
        const dayData = day.cell?.dayData;

        if (!dayData) {
          continue;
        }

        const time = dayData.date.getTime();

        const isStart =
          start &&
          time === startTime &&
          startMonthRendered !== dayData.notCurrentMonth;

        const isEnd =
          end &&
          time === endTime &&
          endMonthRendered !== dayData.notCurrentMonth;

        const selected = start && end && time >= startTime && time <= endTime;

        day.cell.classList.toggle("range-selected", !!selected);

        day.cell.classList.toggle("range-start", !!isStart);

        day.cell.classList.toggle("range-end", !!isEnd);
      }
    }
  }

  isMonthRendered(date) {
    return this.renderedMonths.has(`${date.getMonth()}-${date.getFullYear()}`);
  }

  purgeDayCell(cell) {
    cell.classList.remove(...this.DAY_STATE_CLASSES);
    cell.dayData = null;
  }
}
