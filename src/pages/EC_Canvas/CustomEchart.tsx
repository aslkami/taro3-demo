import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import * as echarts from "./Core/echarts";

export default function CustomEchart({ option }) {
  const [instance, setInstance] = useState<any>(null);
  const [ec] = useState({ onInit: initChart });

  function initChart(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr, // 像素
    });
    canvas.setChart(chart);
    setInstance(chart);

    return chart;
  }

  useEffect(() => {
    if (!instance) return;

    instance.setOption(option);
  }, [instance, option]);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <ec-canvas ec={ec}></ec-canvas>
    </View>
  );
}
