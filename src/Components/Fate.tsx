import Taro from "@tarojs/taro";
import React, { useEffect } from "react";
import { View } from "@tarojs/components";
import Archer from "./Archer";

export default function Fate() {
  Taro.useReady(() => {
    console.log("fate useReady 22222");
  });

  useEffect(() => {
    console.log("fate useEffect 1111");
  });
  return (
    <View>
      <View>fate</View>
      <Archer />
    </View>
  );
}
