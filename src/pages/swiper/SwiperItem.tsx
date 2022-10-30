import { View } from "@tarojs/components";
import React, { useImperativeHandle, useRef, useState } from "react";
import Taro, { useReady } from "@tarojs/taro";

type PropsSwiperItem = {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  sourceIndex?: number;
  currentIndex?: number;
};

const SwiperItem = React.forwardRef<any, PropsSwiperItem>((props, ref) => {
  const { children, style, className, sourceIndex, currentIndex } = props;
  const itemRef = useRef<any>();
  const itemInfo =
    useRef<Taro.NodesRef.BoundingClientRectCallbackResult | null>(null);
  const [animation, setAnimation] = useState<any>({
    actions: [],
  });
  const [offsetPos, setOffsetPos] = useState(0);
  const animateRef = useRef<any>({
    actions: [],
  });

  const factoryAnimation = (options?: Taro.createAnimation.Option) => {
    return Taro.createAnimation({
      duration: 500,
      timingFunction: "linear",
      ...options,
    });
  };

  useImperativeHandle(ref, () => {
    return {
      translatingX(offset) {
        // console.log(
        //   itemRef.current,
        //   itemRef.current.style.transform,
        //   currentIndex,
        //   sourceIndex
        // );
        itemRef.current.style.transform = `translateX(${offset}px) !important`;
        itemRef.current.style.transition = `transform 0s linear !important`;
        // const animate = factoryAnimation({
        //   duration: 0,
        //   timingFunction: "step-start",
        // })
        //   .translateX(offset)
        //   .step();
        // setAnimation(animate.export());
        // animateRef.current = animate.export();
        // setOffsetPos(offset);

        // console.log(animate);
      },
      reset() {
        itemRef.current.style.transform = "unset";
        itemRef.current.style.transition = "unset";
      },
      translateX(offset) {
        const animate = factoryAnimation().translateX(offset).step();
        // setAnimation(animate.export());
        animateRef.current = animate.export();
      },
      transformZ({ translate, scale }) {
        const animate = factoryAnimation({
          timingFunction: "ease",
        })
          .translate3d(0, 0, translate)
          .scale(scale)
          .step();
        // setAnimation(animate.export());
        animateRef.current = animate.export();
      },
      getWidth() {
        return itemInfo.current?.width;
      },
      clear() {
        // setAnimation({
        //   actions: [],
        // });
        animateRef.current = {
          actions: [],
        };
      },
    };
  });

  useReady(() => {
    Taro.createSelectorQuery()
      .select(".swiper-item-container")
      .boundingClientRect((res) => {
        itemInfo.current = res;
      })
      .exec();
  });

  return (
    <View
      className={`swiper-item-container ${className}`}
      ref={itemRef}
      style={{
        ...style,
      }}
      // animation={animation}
      animation={animateRef.current}
    >
      {children}
    </View>
  );
});

export default SwiperItem;
