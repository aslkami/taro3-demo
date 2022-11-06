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
function generateDay(year?: string, month?: string): string[] {
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

// 无 current || initValue 的时候进入
function filterOptionsExec(
  opt: any[] = [],
  filter: string[] = [],
  type: "limitStart" | "limitEnd"
) {
  filter = filter.slice(0, opt.length)
  filter.forEach((f, i) => {
    let value = opt[i] as string[];

    if (type === "limitStart") {
      // 生成的日期是根据当前月份的时间生成的，假设 当前是 11月有 30天， 但是 startDate 当月是 31 天，这样就有问题了
      if (i === 2) {
        value = generateDay(filter[0], filter[1]) // 根据开始时间重新生成时间
      }
      opt[i] = value.filter((item) => Number(item) >= Number(f));
    } else {
      opt[i] = value.filter((item) => Number(item) <= Number(f));
    }
  });

  return opt;
}



function dealWithInitialValue(opt: any[], currentDay: string, start, end, type) {
  const typeListIndex = getTypeListIndex(type)
  const length = Math.min(opt.length, 3)
  const current = currentDay.split('-').slice(0, length)


  const getOptions = () => {
    let options = opt

    let startDate;
    let endDate;

    if (start) {
      startDate = start.split('-').slice(0, length)
    }
    if (end) {
      endDate = end.split('-').slice(0, length)
    }

    options.forEach((item, index) => {
      const val = options[index] as []
      let filterVal
      if (start && end) {
        filterVal = val.filter(v => Number(v) >= Number(startDate[index]) && Number(v) <= Number(endDate[index]))
      } else if (start) {
        filterVal = val.filter(v => Number(v) >= Number(startDate[index]))
      } else if (end) {
        filterVal = val.filter(v => Number(v) <= Number(endDate[index]))
      }
      options[index] = filterVal.length > 0 ? filterVal : val
    })

    if (type === 'Year') return options
    if (start && end && startDate[0] === current[0] && endDate[0] === current[0]) return options

    if (typeListIndex >= 2) {
      options[2] = generateMethodList.generateDay(current[0], current[1])
    }

    if (start && startDate[0] === current[0]) {
      options[1] = generateMethodList.generateMonth().filter(v => Number(v) >= Number(startDate[1]))
      if (typeListIndex >= 2 && startDate[1] === current[1]) {
        options[2] = generateMethodList.generateDay(startDate[0], startDate[1]).filter(v => Number(v) >= Number(startDate[2]))
      }
    } else if (end && endDate[0] === current[0]) {
      options[1] = generateMethodList.generateMonth().filter(v => Number(v) <= Number(endDate[1]))
      if (typeListIndex >= 2 && endDate[1] === current[1]) {
        options[2] = generateMethodList.generateDay(endDate[0], endDate[1]).filter(v => Number(v) <= Number(endDate[2]))
      }
    } else {
      if ((start && !end) || (!start && end)) {
        options[1] = generateMethodList.generateMonth()
      }
    }

    return options
  }

  return getOptions()
}

export function filterDateOptions({
  start,
  end,
  options,
  current,
  initValue,
  type
}: {
  start?: string;
  end?: string;
  options: any[];
  current?: boolean;
  initValue?: string;
  type: DatePickerProps["type"]
}) {
  let opt = options;

  const currentDay = current ? dayjs().format('YYYY-MM-DD') : initValue

  if ((current || initValue) && isValid(start, end, currentDay)) {
    opt = dealWithInitialValue(opt, currentDay!, start, end, type)
  } else {
    if (start) {
      opt = filterOptionsExec(opt, start.split("-"), "limitStart");
    } else if (end) {
      opt = filterOptionsExec(opt, end.split("-"), "limitEnd");
    }
  }

  return opt;
}

// 判断初始值是否合法
export function isValid(start, end, currentDay): boolean {
  const startDate = formatter(start)
  const endDate = formatter(end)

  if (!currentDay && startDate && endDate) {
    return Number(startDate) <= Number(endDate)
  }

  const current = formatter(currentDay)
  if (start && end) {
    return Number(current) >= Number(startDate) && Number(current) <= Number(endDate)
  } else if (start) {
    return Number(current) >= Number(startDate)
  } else if (end) {
    return Number(current) <= Number(endDate)
  }

  return true
}

function formatter(date: string) {
  return date.replace(/[,-]/g, '')
}

export function getCurrentTime(opt: any[] = [], initDate?: string): number[] {
  const [date, time] = dayjs(initDate).format("YYYY-MM-DD HH:mm:ss").split(" ");
  const Date = date.split("-");
  const Time = time.split(":");

  const DayTime = Date.concat(Time)
  return DayTime.slice(0, opt.length).map((dt, index) => {
    const item = opt[index] as [];
    let idx = item.findIndex((it) => Number(it) === Number(dt));
    return idx > -1 ? idx : 0
  });
}


export function isAllSame(before, after) {
  return before.every((item, index) => Number(item) === Number(after[index]))
}

export function getTypeListIndex(type) {
  return typeList.findIndex((tl) => tl === type);
}
