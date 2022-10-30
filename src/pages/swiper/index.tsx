import { View, ScrollView } from "@tarojs/components";
import Swiper from "./Swiper";
import SwiperItem from "./SwiperItem";
import "./index.less";

const colors = ["pink", "lightblue", "lightgreen"];

const mockData = new Array(5).fill(0).map((item, index) => index + 1);

export default function SwiperDemo() {
  return (
    <View className="swiper-wrapper">
      <Swiper>
        {mockData.map((item, index) => {
          return (
            <SwiperItem key={index}>
              <View
                className="content"
                style={{
                  backgroundColor: colors[index % colors.length],
                  borderRadius: "8px",
                }}
              >
                {item}
              </View>
            </SwiperItem>
          );
        })}
      </Swiper>
    </View>
  );
}
