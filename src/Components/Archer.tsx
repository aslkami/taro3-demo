import Taro from "@tarojs/taro";
import React, { useEffect } from "react";
import { View } from "@tarojs/components";

export default function Archer() {
  Taro.useReady(() => {
    console.log("Archer useReady 22222");
  });

  useEffect(() => {
    console.log("Archer useEffect 1111");
  });
  return <View>Archer</View>;
}
