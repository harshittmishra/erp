import DatesRenderer from "./DatesRenderer.js";
import MonthsRenderer from "./MonthsRenderer.js";
import YearsRenderer from "./YearsRenderer.js";

export default class Renderer {
  constructor(options) {
    this.options = options;

    this.buildMount();
    this.buildNavigation();
    this.buildViewMounts();

    this.datesRenderer = new DatesRenderer({
      ...this.options,
      mount: this.datesMount,
    });

    this.monthsRenderer = new MonthsRenderer({
      ...this.options,
      mount: this.monthsMount,
    });

    this.yearsRenderer = new YearsRenderer({
      ...this.options,
      mount: this.yearsMount,
    });

    this.renderPresets();

    this.mountEle.addEventListener("click", (event) => {
      this.handleClick(event);
    });
  }

  buildMount() {
    const mountEle = document.createElement("div");
    mountEle.className = "calendar";

    mountEle.classList.toggle("double-months", this.options.monthsInView == 2);

    mountEle.classList.toggle("toggleable-dates", this.options.toggleMode);

    this.mountEle = mountEle;
  }

  buildNavigation() {
    const navigation = document.createElement("div");
    navigation.className = "navigation";

    navigation.append(this.buildControl("prev"), this.buildControl("next"));

    this.mountEle.append(navigation);
  }

  buildControl(type) {
    const control = document.createElement("div");
    control.className = `control ${type}`;

    const icon = document.createElement("span");
    icon.className = "icon xs";

    control.append(icon);

    return control;
  }

  buildViewMounts() {
    this.datesMount = this.createViewMount("dates");
    this.monthsMount = this.createViewMount("months");
    this.yearsMount = this.createViewMount("years");

    this.mountEle.append(this.datesMount, this.monthsMount, this.yearsMount);
  }

  createViewMount(type) {
    const mount = document.createElement("div");
    mount.className = `${type}`;

    return mount;
  }

  handleClick(event) {
    const next = event.target.closest(".control.next");

    if (next && this.mountEle.contains(next)) {
      this.options.onNextClick?.();
      return;
    }

    const prev = event.target.closest(".control.prev");

    if (prev && this.mountEle.contains(prev)) {
      this.options.onPrevClick?.();
    }

    const preset = event.target.closest(".preset");

    if (preset && this.mountEle.contains(preset)) {
      this.options.onPresetClick?.(preset.presetData);
    }
  }

  getViewMounts() {
    return {
      datesMount: this.datesMount,
      monthsMount: this.monthsMount,
      yearsMount: this.yearsMount,
    };
  }

  getMounts() {
    return {
      ...this.getViewMounts,
      mount: this.mountEle,
    };
  }

  render(data, view) {
    switch (view) {
      case "dates":
        this.datesRenderer.render(data);
        break;

      case "months":
        this.monthsRenderer.render(data);
        break;

      case "years":
        this.yearsRenderer.render(data);
        break;
    }
  }

  renderState(state, view) {
    switch (view) {
      case "dates":
        this.datesRenderer.renderSelection(state.selectedDates);
        break;

      case "months":
        this.monthsRenderer.renderState(state.renderFrom);
        break;

      case "years":
        this.yearsRenderer.renderState(state.renderFrom);
        break;
    }
  }

  switchView(view) {
    const mounts = this.getViewMounts();

    for (const key in mounts) {
      mounts[key].classList.remove("active");
    }

    mounts[view + "Mount"].classList.add("active");
  }

  renderPresets() {
    if (this.options.presets.length <= 0) {
      return;
    }

    const presets = document.createElement("div");
    presets.className = "presets";

    const presetList = document.createElement("div");
    presetList.className = "preset-list";

    const fragment = document.createDocumentFragment();

    this.options.presets.forEach((preset) => {
      fragment.appendChild(this.createPreset(preset));
    });

    presetList.appendChild(fragment);
    presets.appendChild(presetList);

    this.mountEle.classList.add("have-presets");
    this.mountEle.append(presets);
  }

  createPreset(preset) {
    const element = document.createElement("div");
    element.className = "preset";
    element.presetData = preset;

    const name = document.createElement("span");
    name.className = "presetname";
    name.textContent = preset.name;

    element.appendChild(name);

    return element;
  }
}
