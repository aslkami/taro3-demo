import React, { useEffect, useState, useRef } from "react";
import { View, Swiper, SwiperItem } from "@tarojs/components";

import Taro, { useDidShow, useDidHide, useReady } from "@tarojs/taro";
import cloneDeep from "lodash.clonedeep";

import Echarts from "../../TaroEcharts";
import "./index.less";

import echartjs from "./echarts";
import Fate from "./../../Components/Fate";

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
    setEchartsOptions(option);
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
  const [key, setKey] = useState();

  useReady(() => {
    console.log("GrandSon, useReady");
  });

  useEffect(() => {
    console.log(13131314, key);
    const randomKey = Math.random()
      .toString(36)
      .substring(7)
      .split("")
      .join(".");
    setKey(randomKey);
  }, []);

  return (
    <>
      {/* <Fate /> */}
      <EchartsComponent {...args}></EchartsComponent>
    </>
  );
}

const genKey = () => {
  return Math.random().toString(36).substring(7).split("").join(".");
};

function EchartsComponent({ ...args }) {
  const ref = useRef();
  const [key, setKey] = useState();
  const [, forceUpdate] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const [canvasId, setCanvasId] = useState(genKey());

  useEffect(() => {
    // console.log(args.option, "useEffect==========");
    // console.log(ref.current, "nextick111");
    // Taro.nextTick(() => {
    //   Taro.nextTick(() => {
    //     console.log(ref.current, "nextick222");
    //     if (!ref.current) {
    //       const randomKey = Math.random()
    //         .toString(36)
    //         .substring(7)
    //         .split("")
    //         .join(".");
    //       setKey(randomKey);
    //       console.log(cloneDeep(options) === options);
    //     } else {
    //       ref.current.setOption(options);
    //     }
    //   });
    // });
    Taro.nextTick(() => {
      setTimeout(() => {
        setIsMounted(true);
        console.log("nextTick isMounted");
      }, 2000);
    });
  }, []);

  // if (Reflect.ownKeys(args.option).length === 0) {
  //   return null;
  // }
  console.log(args.option, "__________________________");

  return (
    <Echarts
      style={{ width: "375px", height: "300px" }}
      ref={ref}
      echarts={echartjs}
      option={args.option}
      notMerge
      isPage={false}
      // option={option}
      onChartReady={(ins) => {
        console.log(ins, "echarts实例");
        // ref.current = ins;
        console.log(args.option, "echarts实例?????????????????");
        ins?.setOption(args.option, true, true);
        // setIsMounted(true);
      }}
    ></Echarts>
  );
}

export default Grandfather;
