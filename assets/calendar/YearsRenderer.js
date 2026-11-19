export default class YearsRenderer {
  constructor(options) {
    this.options = options;

    this.init();

    this.options.mount.addEventListener("click", (event) => {
      this.handleClick(event);
    });
  }

  init() {
    this.header = this.createHeader();
    this.yearsListElement = this.createYearsList();
    this.years = this.createYears();
  }

  createHeader() {
    const header = document.createElement("div");
    header.className = "header";

    const yearTitle = document.createElement("div");
    yearTitle.className = "year-title";

    const fromYear = document.createElement("span");
    fromYear.className = "year";

    const separator = document.createElement("span");
    separator.textContent = "-";
    separator.setAttribute("aria-hidden", "true");

    const tillYear = document.createElement("span");
    tillYear.className = "year";

    yearTitle.append(fromYear, separator, tillYear);

    header.append(yearTitle);

    this.options.mount.append(header);

    return {
      header,
      yearTitle,
      fromYear,
      tillYear,
    };
  }

  createYearsList() {
    const yearsList = document.createElement("div");

    yearsList.className = "years-list";
    yearsList.style.setProperty("--columns", this.options.yearsColumns ?? 5);

    this.options.mount.append(yearsList);

    return yearsList;
  }

  createYears() {
    const years = [];

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < this.options.yearsPerPage; i++) {
      const year = this.createYear();

      fragment.append(year.year);
      years.push(year);
    }

    this.yearsListElement.append(fragment);

    return years;
  }

  createYear() {
    const year = document.createElement("div");
    year.className = "year";

    const effect = document.createElement("span");
    effect.className = "effect";

    const yearName = document.createElement("span");
    yearName.className = "yearname";

    year.append(effect, yearName);

    return {
      year,
      effect,
      yearName,
    };
  }

  render(data) {
    this.updateTitle(data);
    this.updateYearCells(data);
  }

  updateTitle(data) {
    // Update the header range
    if (data.length) {
      this.header.fromYear.textContent = this.getYear(data[0].year);
      this.header.tillYear.textContent = this.getYear(
        data[data.length - 1].year,
      );
    } else {
      this.header.fromYear.textContent = "";
      this.header.tillYear.textContent = "";
    }
  }

  updateYearCells(data) {
    for (let i = 0; i < this.years.length; i++) {
      const yearDom = this.years[i];
      const cell = yearDom.year;
      const year = data[i];

      // Cleaning up previous state
      cell.yearData = null;
      cell.classList.remove("disabled", "hidden", "current");

      yearDom.yearName.textContent = "";

      if (year === undefined) {
        continue;
      }

      cell.yearData = year;

      yearDom.yearName.textContent = this.getYear(year.year);

      cell.classList.toggle("disabled", year.notAllowed === true);
    }
  }

  getYear(year) {
    return String(year);
  }

  handleClick(event) {
    const year = event.target.closest(".year");

    if (year && this.options.mount.contains(year)) {
      this.handleYearClick(year);
      return;
    }
  }

  handleYearClick(cell) {
    const year = cell.yearData;

    if (!year || year.notAllowed) {
      return;
    }

    this.options.onYearClick?.(year);
  }
}
