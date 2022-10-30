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
  typeList,
  generateMethodList,
} from "./utils";

const { generateDay, generateMonth } = generateMethodList;

export type DatePickerProps = {
  type: "Year" | "Month" | "Day" | "Hour" | "Minute" | "Second";
  rangeYear?: number;
  defautRenderUnit: string[];
  start?: string; // 2022-08-31
  end?: string; // 2022-08-31
  current?: boolean;
};

export default function DatePicker(props: DatePickerProps) {
  const {
    type = "Day",
    defautRenderUnit = ["年", "月", "日", "时", "分", "秒"],
    start = "2022-08-30",
    end,
    current = true,
    rangeYear = 10,
  } = props;
  const [pickerValue, setPickerValue] = useState(() => {
    const typeIndex = typeList.findIndex((tl) => tl === type);
    return new Array(typeIndex + 1).fill(0).map(() => 0);
  });
  console.log("pickerValue", pickerValue);
  const [dateOptions, setDateOptions] = useState<any[]>([]);

  useEffect(() => {
    let opt = generateDateOptions({ type, range: rangeYear });
    if (start || end) {
      opt = filterDateOptions({ options: opt, start, end });
    }
    setDateOptions(opt);

    if (current) {
      setPickerValue(getCurrentTime(opt));
    }
  }, [current, end, rangeYear, start, type]);

  const onChange: CommonEventFunction<PickerViewProps.onChangeEventDetail> = (
    e
  ) => {
    const oldValue = pickerValue;
    const newValue = e.detail.value;
    console.log(newValue, "==========");

    regenerateYearOptions(oldValue, newValue);
    regenerateDayOptions(oldValue, newValue);
    setPickerValue(newValue);
  };

  const regenerateYearOptions = (oldValue, newValue) => {
    if (start) {
      const startDate = start.split("-");
      if (oldValue[0] !== newValue[0]) {
        let monthOptions = generateMonth();
        const year = getValue(0, newValue[0]);
        if (year === startDate[0]) {
          monthOptions = monthOptions.filter(
            (opt) => Number(opt) >= Number(startDate[1])
          );
        }
        dateOptions[1] = monthOptions;
        setDateOptions([...dateOptions]);
      }
    } else if (end) {
      const endDate = end.split("-");
      if (oldValue[0] !== newValue[0]) {
        let monthOptions = generateMonth();
        const year = getValue(0, newValue[0]);
        if (year === endDate[0]) {
          monthOptions = monthOptions.filter(
            (opt) => Number(opt) <= Number(endDate[1])
          );
        }
        dateOptions[1] = monthOptions;
        setDateOptions([...dateOptions]);
      }
    }
  };

  const regenerateDayOptions = (oldValue, newValue) => {
    if (oldValue[0] !== newValue[0] || oldValue[1] !== newValue[1]) {
      const dayOptions = generateDay(
        getValue(0, [newValue[0]]),
        getValue(1, [newValue[1]])
      );
      dateOptions[2] = dayOptions;
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
                    // color: pickerValue[i] === idx ? "lightblue" : "#000",
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
