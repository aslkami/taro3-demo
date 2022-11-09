import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, MovableView, MovableArea } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./swiper.less";
import useRefs from "./hooks/useRefs";
import useTouch from "./hooks/useTouch";

type PropsSwiper = {
  showIndicatorDot?: boolean;
  children: React.ReactNode;
  swiperOffset?: number;
  onLast?: () => void;
  showNum: number;
};

export default function Swiper({
  showIndicatorDot = true,
  children,
  swiperOffset = 50,
  onLast = () => {},
  showNum = 3,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperItemRef, setSwiperItemRefs] = useRefs();
  const touch = useTouch();
  const swipeDirection = useRef("");
  const itemCount = React.Children.count(children);
  const translateOffset = 50;
  const scaleRatio = 0.1;
  const maxZIndex = itemCount + 1;
  const end = Math.min(currentIndex + showNum, itemCount);
  const [, forceUpdate] = useState({});

  const onTouchStart = (e) => {
    touch.start(e);
  };

  const onTouchMove = (e) => {
    touch.move(e);
    const { deltaX: delta, touchStartTime } = touch.getDelta();
    if (new Date().getTime() - touchStartTime <= 100) {
      console.log("小于100ms, 则不拖动");
      return;
    }

    if (delta < 0) {
      if (currentIndex === itemCount - 1) return;
      if (swipeDirection.current === "right") return;
      swipeDirection.current = "left";
      const swiperDelta = delta > 0 ? 0 : delta;
      swiperItemRef[currentIndex].translatingX(swiperDelta);
    } else {
      if (currentIndex === 0) return;
      if (swipeDirection.current === "left") return;
      swipeDirection.current = "right";
      const width = swiperItemRef[currentIndex - 1].getWidth();
      // const swiperDelta = delta >= width * 1.5 ? 0 : `calc(-150% + ${delta}px)`;
      const swiperDelta = delta >= width * 1.5 ? 0 : -width * 1.5 + delta;
      swiperItemRef[currentIndex - 1].translatingX(swiperDelta);
    }
  };

  const onTouchEnd = () => {
    const { deltaX, deltaY } = touch.end();
    // if (Math.abs(deltaY) >= swiperOffset + 20) return;
    // if (Math.abs(deltaX) <= swiperOffset) return;

    if (swipeDirection.current === "left") {
      swiperItemRef[currentIndex].reset();
    }
    if (swipeDirection.current === "right") {
      swiperItemRef[currentIndex - 1].reset();
    }

    if (deltaX < 0) {
      if (currentIndex === itemCount - 1) return;

      if (Math.abs(deltaX) >= swiperOffset) {
        onNext();
      } else {
        swiperItemRef[currentIndex].translateX(0);
        forceUpdate({});
      }
    } else {
      if (currentIndex === 0) return;

      if (Math.abs(deltaX) >= 80) {
        onPrev();
      } else {
        swiperItemRef[currentIndex - 1].translateX("-150%");
        forceUpdate({});
      }
    }

    swipeDirection.current = "";
  };

  const onFinish = (index) => {
    setCurrentIndex(index);

    // swiperItemRef.forEach((ref) => {
    //   ref.clear();
    // });
  };

  const getAnimateStyle = (index) => {
    const translate =
      "-" + Taro.pxTransform((index - currentIndex) * translateOffset);
    const scale = 1 - (index - currentIndex) * scaleRatio;
    return {
      translate,
      scale,
    };
  };

  const onPrev = () => {
    let idx = currentIndex;
    swiperItemRef[idx - 1].translateX(0);
    swiperItemRef[idx].transformZ({
      translate: `${Taro.pxTransform(translateOffset)}`,
      scale: 0.9,
    });
    let count = 0;
    while (idx < end) {
      if (count++ === showNum - 1) break;

      const { translate, scale } = getAnimateStyle(idx + 1);
      swiperItemRef[idx].transformZ({ translate, scale });
      idx++;
    }

    onFinish(currentIndex - 1);
  };

  const onNext = () => {
    let idx = currentIndex;
    while (idx < end) {
      if (idx === currentIndex) {
        swiperItemRef[idx].translateX("-150%");
      } else {
        const { translate, scale } = getAnimateStyle(idx - 1);
        swiperItemRef[idx].transformZ({ translate, scale });
      }
      idx++;
    }

    onFinish(currentIndex + 1);
  };

  const initStyle = (index): React.CSSProperties => {
    const baseStyle = {
      zIndex: maxZIndex - index,
    };
    if (index < end && index >= currentIndex) {
      const { translate, scale } = getAnimateStyle(index);
      return {
        ...baseStyle,
        transform: `translate3d(0, 0, ${translate}) scale(${scale})`,
        opacity: 1,
      };
    } else if (index >= end) {
      return {
        ...baseStyle,
        opacity: 0.01,
      };
    }

    return baseStyle;
  };

  // useEffect(() => {
  //   const el = document.getElementById("swiper-container");
  //   const handler = (e) => {
  //     e.preventDefault();
  //   };
  //   if (el) {
  //     el.addEventListener("touchmove", handler);
  //   }

  //   return () => {
  //     el?.removeEventListener("touchmove", handler);
  //   };
  // }, []);

  return (
    <View style={{ height: "300rpx", width: "300px" }}>
      <View
        className="swiper-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        id="swiper-container"
        catchMove
      >
        {React.Children.map(children, (item, index) => {
          return React.cloneElement(item, {
            style: {
              color: "white",
              ...initStyle(index),
            },
            ref: setSwiperItemRefs(index),
            sourceIndex: index,
            currentIndex,
          });
        })}
      </View>
      <View onClick={onPrev}>上一张</View>
      <View onClick={onNext}>下一张</View>
    </View>
  );
}
