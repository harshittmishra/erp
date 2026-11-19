import Options from "./Options.js";
import DatesModel from "./DatesModel.js";
import DateSelector from "./DateSelector.js";
import Renderer from "./Renderer.js";
import Presets from "./Presets.js";
import Positioner from "./Positioner.js";
import Events from "./Events.js";
import Toggle from "../toggle/Toggle.js";

export default class Calendar {
  constructor(rawOptions = {}) {
    this.options = new Options(rawOptions);

    this.isOpen = false;
    this.viewMode = null;

    this.state = {
      selectedDates: [],
      renderFrom: null,
    };

    this.events = new Events();

    this.datesModel = new DatesModel(this.options);
    this.today = this.datesModel.getToday();

    this.dateSelector = new DateSelector(this.options);
    this.presets = new Presets(this.options, this.today);

    this.renderer = new Renderer({
      ...this.options,
      onNextClick: () => this.next(),
      onPrevClick: () => this.prev(),
      onDateClick: (date) => this.selectDate(date),
      onMonthViewClick: () => this.showMonths(),
      onMonthClick: (month) => this.goToMonth(month),
      onYearViewClick: () => this.showYears(),
      onYearClick: (year) => this.goToYear(year),
      onPresetClick: (preset) => this.usePreset(preset),
    });

    const mounts = this.renderer.getMounts();

    this.positioner = new Positioner({
      ...this.options,
      mount: mounts.mount,
    });

    this.toggleController = null;

    if (this.options.autoTrigger) {
      this.toggleController = new Toggle({
        trigger: this.options.trigger,
        panel: mounts.mount,
        closeOutside: true,
        closeEscape: true,
        initialState: "closed",

        onOpen: () => {
          this.handleOpen();
        },

        onClose: () => {
          this.handleClose();
        },
      });
    }

    this.switchView("dates");
  }

  render() {
    this.renderer.render(this.getData(), this.viewMode);
    this.renderer.renderState(this.state, this.viewMode);
  }

  getData() {
    let data = null;

    switch (this.viewMode) {
      case "dates":
        data = this.datesModel.getMonths(this.options.monthsInView);
        break;

      case "months":
        data = this.datesModel.getYearMonths();
        console.log(data);
        break;

      case "years":
        data = this.datesModel.getYears();
        break;
    }

    return data;
  }

  next() {
    switch (this.viewMode) {
      case "dates":
        this.nextDates();
        break;

      case "months":
        this.nextMonths();
        break;

      case "years":
        this.nextYearPage();
        break;
    }
  }

  prev() {
    switch (this.viewMode) {
      case "dates":
        this.prevDates();
        break;

      case "months":
        this.prevMonths();
        break;

      case "years":
        this.prevYearPage();
        break;
    }
  }

  nextDates() {
    if (!this.datesModel.next(this.options.monthsInView)) {
      return false;
    }

    this.render();

    return true;
  }

  prevDates() {
    if (!this.datesModel.prev(this.options.monthsInView)) {
      return false;
    }

    this.render();

    return true;
  }

  nextMonths() {
    if (!this.datesModel.nextYear()) {
      return false;
    }

    this.render();

    return true;
  }

  prevMonths() {
    if (!this.datesModel.prevYear()) {
      return false;
    }

    this.render();

    return true;
  }

  nextYearPage() {
    if (!this.datesModel.nextYearPage()) {
      return false;
    }

    this.render();

    return true;
  }

  prevYearPage() {
    if (!this.datesModel.prevYearPage()) {
      return false;
    }

    this.render();

    return true;
  }

  selectDate(date) {
    this.state.selectedDates = this.dateSelector.select(
      this.state.selectedDates,
      date,
    );

    this.renderer.renderState(this.state, this.viewMode);
  }

  switchView(view) {
    this.updateRenderFromPointer();
    this.viewMode = view;
    this.renderer.switchView(view);
    this.render();
  }

  showMonths() {
    this.switchView("months");
  }

  updateRenderFromPointer() {
    this.state.renderFrom = this.datesModel.getRenderFrom();
  }

  goToMonth(month) {
    this.datesModel.goToMonth(month.year, month.month);
    this.switchView("dates");
  }

  showYears() {
    this.switchView("years");
  }

  goToYear(year) {
    this.datesModel.goToYear(year.year);
    this.switchView("months");
  }

  usePreset(preset) {
    this.state.selectedDates = this.presets.resolve(preset);
    this.renderer.renderState(this.state, this.viewMode);
  }

  open() {
    if (this.toggleController) {
      this.toggleController.open();
      return;
    }

    this.handleOpen();
  }

  close() {
    if (this.toggleController) {
      this.toggleController.close();
      return;
    }

    this.handleClose();
  }

  toggle() {
    if (this.toggleController) {
      this.toggleController.toggle();
      return;
    }

    this.isOpen ? this.close() : this.open();
  }

  handleOpen() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.positioner.show();

    this.events.emit("open", {
      calendar: this,
    });
  }

  handleClose() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.positioner.hide();

    this.events.emit("close", {
      calendar: this,
    });
  }

  on(event, handler) {
    this.events.on(event, handler);
    return this;
  }

  off(event, handler) {
    this.events.off(event, handler);
    return this;
  }

  destroy() {
    this.toggleController?.destroy();
    this.positioner.hide();

    this.isOpen = false;
  }
}
