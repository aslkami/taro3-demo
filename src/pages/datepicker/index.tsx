import { useState, useEffect, useRef } from "react";
import {
  PickerView,
  View,
  PickerViewColumn,
  Text,
  PickerViewProps,
  CommonEventFunction,
} from "@tarojs/components";
import {
  filterDateOptions,
  generateDateOptions,
  getCurrentTime,
  generateMethodList,
  isAllSame,
  getTypeListIndex,
} from "./utils";

const { generateDay, generateMonth } = generateMethodList;

export type DatePickerProps = {
  type: "Year" | "Month" | "Day" | "Hour" | "Minute" | "Second";
  rangeYear?: number;
  defautRenderUnit: string[];
  start?: string; // 2022-08-31
  end?: string; // 2023-03-31
  current?: boolean;
  initValue?: string;
};

export default function DatePicker(props: DatePickerProps) {
  const {
    type = "Day",
    defautRenderUnit = ["年", "月", "日", "时", "分", "秒"],
    start = "2022-08-30",
    // start,
    end = "2023-03-20",
    // end,
    current = false,
    rangeYear = 10,
    initValue,
    // initValue = "2024-03-15",
  } = props;
  const [pickerValue, setPickerValue] = useState(() => {
    const typeIndex = getTypeListIndex(type);
    return new Array(typeIndex + 1).fill(0).map(() => 0);
  });
  const [dateOptions, setDateOptions] = useState<any[]>([]);
  const latestChangeValue = useRef<any[] | null>(null);
  console.log("pickerValue", pickerValue, dateOptions);

  useEffect(() => {
    let opt = generateDateOptions({ type, range: rangeYear });
    if (start || end) {
      opt = filterDateOptions({
        options: opt,
        start,
        end,
        current,
        initValue,
        type,
      });
    }

    setDateOptions(opt);

    if (current || initValue) {
      setPickerValue(getCurrentTime(opt, current ? undefined : initValue));
    }
  }, [current, end, initValue, rangeYear, start, type]);

  const onChange: CommonEventFunction<PickerViewProps.onChangeEventDetail> = (
    e
  ) => {
    const oldValue = pickerValue;
    const newValue = e.detail.value;
    let resetValue = newValue;
    regenerateMonthOptions(oldValue, newValue, resetValue);
    regenerateDayOptions(oldValue, newValue, resetValue);
    latestChangeValue.current = resetValue;
    Promise.resolve().then(() => {
      setTimeout(() => {
        setPickerValue(resetValue);
      }, 0);
    });
  };

  const regenerateMonthOptions = (oldValue, newValue, resetValue) => {
    if (type === "Year") return;

    if (oldValue[0] !== newValue[0]) {
      let monthOptions = generateMonth();
      const valueYear = getValue(0, [newValue[0]]);

      if (start) {
        const startDate = start.split("-");
        if (startDate[0] === valueYear) {
          monthOptions = monthOptions.filter(
            (opt) => Number(opt) >= Number(startDate[1])
          );
        }
      }

      if (end) {
        const endDate = end.split("-");
        if (endDate[0] === valueYear) {
          let last = monthOptions;
          monthOptions = monthOptions.filter(
            (opt) => Number(opt) <= Number(endDate[1])
          );
          monthOptions = monthOptions.length > 0 ? monthOptions : last;
        }
      }

      const valueMonth = getValue(1, [newValue[1]]);
      const findRes = monthOptions.findIndex((item) => item === valueMonth);
      dateOptions[1] = monthOptions;
      resetValue[1] = findRes > -1 ? findRes : 0;
      setDateOptions([...dateOptions]);
    }
  };

  const regenerateDayOptions = (oldValue, newValue, resetValue) => {
    if (type === "Month" || type === "Year") return;

    if (oldValue[0] !== newValue[0] || oldValue[1] !== newValue[1]) {
      const valueYear = getValue(0, [newValue[0]]);
      const valueMonth = getValue(1, [newValue[1]]);
      let dayOptions = generateDay(valueYear, valueMonth);

      if (start) {
        const startDate = start.split("-");
        if (isAllSame([valueYear, valueMonth], startDate)) {
          dayOptions = dayOptions.filter(
            (d) => Number(d) >= Number(startDate[2])
          );
        }
      }
      if (end) {
        const endDate = end.split("-");
        if (isAllSame([valueYear, valueMonth], endDate)) {
          dayOptions = dayOptions.filter(
            (d) => Number(d) <= Number(endDate[2])
          );
        }
      }

      const valueDay = getValue(2, [newValue[2]]);
      const findRes = dayOptions.findIndex((item) => item === valueDay);
      dateOptions[2] = dayOptions;
      resetValue[2] = findRes > -1 ? findRes : 0;
      setDateOptions([...dateOptions]);
    }
  };

  const getValue = (index, valueIndex) => {
    return dateOptions[index][valueIndex];
  };

  return (
    <PickerView
      indicatorStyle="height: 50px;"
      value={pickerValue}
      onChange={onChange}
      immediateChange
    >
      {dateOptions.map((o, i) => {
        return (
          <PickerViewColumn style={{ height: "300px" }} key={i}>
            {o.map((v, idx) => {
              return (
                <View
                  style={{
                    lineHeight: "50px",
                    textAlign: "center",
                    color: pickerValue[i] === idx ? "red" : "#000",
                  }}
                  key={v}
                >
                  {v}
                  <Text style={{ marginLeft: "1px" }}>
                    {defautRenderUnit[i]}
                  </Text>
                </View>
              );
            })}
          </PickerViewColumn>
        );
      })}
    </PickerView>
  );
}
