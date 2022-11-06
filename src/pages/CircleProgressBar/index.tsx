import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "./index.less";

export default function CircleProgressBar() {
  const [style, setStyle] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setStyle({
        transform: "rotate(45deg)",
        transition: "all 2s",
      });
    }, 2000);
  }, []);

  return (
    <View className="container">
      <View className="left">
        <View className="leftcircle" style={style}></View>
      </View>
      <View className="right">
        <View className="rightcircle"></View>
      </View>
    </View>
  );
}
