import Taro from "@tarojs/taro";
import React, { useEffect } from "react";
import { View } from "@tarojs/components";

export default function Fate() {
  Taro.useReady(() => {
    console.log("fate useReady");
  });

  useEffect(() => {
    console.log("fate useEffect");
  });
  return <View>fate</View>;
}
