import dayjs from "dayjs";
import { DatePickerProps } from "./index";

let currentType;
export const typeList: Array<DatePickerProps["type"]> = [
  "Year",
  "Month",
  "Day",
  "Hour",
  "Minute",
  "Second",
];

const generateHelper = (max) => {
  const opt = new Array(max).fill(0).map((item, index) => {
    let idx = ["Hour", "Minute", "Second"].includes(currentType)
      ? index
      : index + 1;
    return idx < 10 ? `0${idx}` : `${idx}`;
  });
  currentType = "";
  return opt;
};

function generateYear(range) {
  const thisYear = dayjs().get("year");
  const startYear = thisYear - range - 1;
  return new Array(range * 2 + 1)
    .fill(0)
    .map((item, index) => `${startYear + index + 1}`);
}

const monthDayList = {};
function generateDay(year = undefined, month = undefined) {
  const Year = dayjs(year).get("year");
  const Month = dayjs(month).get("month") + 1;
  const maxDate = dayjs(`${Year}-${Month}`).daysInMonth();
  if (monthDayList[maxDate]) return monthDayList[maxDate];

  const res = generateHelper(maxDate);
  monthDayList[maxDate] = res
  return res
}

export const generateMethodList = {
  generateYear,
  generateMonth: () => generateHelper(12),
  generateDay,
  generateHour: () => generateHelper(24),
  generateMinute: () => generateHelper(60),
  generateSecond: () => generateHelper(60),
};

export function generateDateOptions({
  type,
  range,
  start,
  end,
}: {
  type: DatePickerProps["type"];
  range?: number;
  start?: string;
  end?: string;
}) {
  const typeIndex = typeList.findIndex((tl) => tl === type);
  let options: any[] = [];
  let index = 0;
  while (index <= typeIndex) {
    const val = typeList[index];
    currentType = val;
    index++;
    switch (val) {
      case "Year":
        options.push(generateMethodList.generateYear(range));
        break;
      case "Day":
        options.push(generateMethodList.generateDay());
        break;
      default:
        options.push(generateMethodList["generate" + val]());
        break;
    }
  }

  return options;
}

function filterOptionsExec(
  opt: any[] = [],
  filter: string[] = [],
  type: "limitStart" | "limitEnd"
) {
  filter.forEach((f, i) => {
    const value = opt[i] as [];
    if (type === "limitStart") {
      opt[i] = value.filter((item) => Number(item) >= Number(f));
    } else {
      opt[i] = value.filter((item) => Number(item) <= Number(f));
    }
  });

  return opt;
}

export function filterDateOptions({
  start,
  end,
  options,
}: {
  start?: string;
  end?: string;
  options: any[];
}) {
  let opt = options;

  if (start) {
    opt = filterOptionsExec(opt, start.split("-"), "limitStart");
  }

  if (end) {
    opt = filterOptionsExec(opt, end.split("-"), "limitEnd");
  }

  return opt;
}

export function getCurrentTime(opt: any[] = []): number[] {
  const [date, time] = dayjs().format("YYYY-MM-DD HH:mm:ss").split(" ");
  const Date = date.split("-");
  const Time = time.split(":");

  const DayTime = Date.concat(Time)
  return DayTime.slice(0, opt.length).map((dt, index) => {
    const item = opt[index] as [];
    return item.findIndex((it) => Number(it) === Number(dt));
  });
}
