import React, { useEffect, useState, useRef } from "react";
import { View, Swiper, SwiperItem } from "@tarojs/components";

import Taro, { useDidShow, useDidHide, useReady } from "@tarojs/taro";

import Echarts from "taro-react-echarts";
import "./index.less";

import echartjs from "./echarts";

function Grandfather() {
  const [options, setEchartsOptions] = useState({});
  const [options2, setEchartsOptions2] = useState({});
  const [type, setType] = useState(true);

  useEffect(() => {
    let option = {
      title: {
        text: "World Population",
      },
      // tooltip: {
      //   trigger: "axis",
      //   axisPointer: {
      //     type: "shadow",
      //   },
      // },
      legend: {},
      grid: {
        left: "1%",
        right: "1%",
        bottom: "1%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: [
          "Brazil",
          "Indonesia",
          "USA",
          "India",
          "China",
          "World",
          "Brazil1",
          "Indonesia2",
          "USA3",
          "India4",
          "China5",
          "World6",
        ],
      },
      series: [
        {
          name: "2011",
          type: "bar",
          data: [
            18203, 23489, 29034, 104970, 131744, 630230, 18203, 23489, 29034,
            104970, 131744, 630230,
          ],
        },
        {
          name: "2012",
          type: "bar",
          data: [
            19325, 23438, 31000, 121594, 134141, 681807, 19325, 23438, 31000,
            121594, 134141, 681807,
          ],
        },
      ],
      dataZoom: [
        {
          type: "slider",
          orient: "vertical",
          // start: 0,
          // end: 50,
        },
        {
          type: "inside",
          orient: "vertical",
          // start: 0,
          // end: 50,
        },
      ],
    };
    setTimeout(() => {
      setEchartsOptions(option);
    }, 1000);
  }, []);

  useReady(() => {
    console.log("grandFather, useReady");
  });

  return (
    <View
      catchMove
      onTouchMove={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Father option={options} option2={options2} type={type} />
      <View onClick={() => setType(!type)}>toggle~~~~~~~~~~~~~~~</View>
    </View>
  );
}

function Father({ ...args }) {
  useReady(() => {
    console.log("Father, useReady");
  });
  return (
    <View style={{ width: "100vw", height: "100vh", marginTop: "300rpx" }}>
      <View
        style={{
          width: "100%",
          height: "600rpx",
          display: args.type ? "block" : "none",
        }}
      >
        <GrandSon {...args} isPage />
      </View>
      {/* <View
        style={{
          width: "100%",
          height: "300rpx",
          // display: !args.type ? "block" : "none",
          // display: "block",
        }}
      >
        <GrandSon option={args.option2} />;
      </View> */}
      {/* <View style={{ width: "100%", height: "300rpx" }}>
        <GrandSon {...args} isPage={false} />;
      </View> */}
    </View>
  );
}

function GrandSon({ ...args }) {
  useReady(() => {
    console.log("GrandSon, useReady");
  });

  return <EchartsComponent {...args}></EchartsComponent>;
}

function EchartsComponent({ ...args }) {
  return (
    <Echarts
      style={{ width: "375px", height: "300px" }}
      echarts={echartjs}
      {...args}
      // option={option}
    ></Echarts>
  );
}

export default Grandfather;
