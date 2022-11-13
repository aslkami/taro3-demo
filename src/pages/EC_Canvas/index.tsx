import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import CustomEchart from "./CustomEchart";
import "./index.less";

// definePageConfig({
//   usingComponents: {
//     "ec-canvas": "../EC_Canvas/Core/ec-canvas.wxml",
//   },
// });
export default function EchartsDemo() {
  const [option, setOption] = useState({});

  useEffect(() => {
    let options = {
      legend: {},
      backgroundColor: "#ffffff",
      series: [
        {
          label: {
            normal: {
              fontSize: 14,
            },
          },
          type: "pie",
          center: ["50%", "50%"],
          radius: ["20%", "40%"],
          data: [
            {
              value: 55,
              name: "北京",
            },
            {
              value: 20,
              name: "武汉",
            },
            {
              value: 10,
              name: "杭州",
            },
            {
              value: 20,
              name: "广州",
            },
            {
              value: 38,
              name: "上海",
            },
          ],
        },
      ],
    };

    setOption(options);
  }, []);

  return (
    <View className="wrapper">
      <View className="left">
        <CustomEchart option={option} />;
      </View>
      <View className="right"></View>
    </View>
  );
}
