import Api from "assets/js/Api.js";
import Calendar from "assets/calendar/Calendar.js";

export default class Dashboard {
  constructor() {
    this.initDateRange();
  }

  async initDateRange() {
    const response = await fetch("./assets/calendar/locales/en.json");
    const en = await response.json();

    const calendar = new Calendar({
      trigger: document.getElementById("date-range"),
      positionMode: "floating",
      weekStartDay: 0,
      selectMode: "range",
      toggleMode: false,
      maxSelectedDates: 3,
      weekStartDay: 0,
      fromDate: "01-01-2000",
      tillDate: "01-01-2027",
      monthsInView: 2,
      weekStartDay: 0,
      locale: en,
      headerNameFormat: "full",
      dayNameFormat: "compact",
      disableMutedDates: false,
      yearsPerPage: 20,

      presets: [
        {
          name: "Today",
          operation: "today",
        },
        {
          name: "Last Week",
          operation: "lastWeek",
        },
        {
          name: "Last Month",
          operation: "lastMonth",
        },
        {
          name: "Last 7 days",
          amount: -7,
          unit: "days",
        },
        {
          name: "Custom Weekend",
          callback: (anchorDate) => {
            const start = new Date(anchorDate);
            start.setDate(start.getDate() - 10);

            const end = new Date(anchorDate);

            return [start, end];
          },
        },
      ],

      gap: [5, 25, 5, 5],
    });

    calendar.on("open", ({ calendar }) => {
      console.log(calendar);
    });
  }
}
