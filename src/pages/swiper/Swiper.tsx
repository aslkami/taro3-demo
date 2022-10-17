import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView } from "@tarojs/components";
import "./swiper.less";
import useRefs from "./hooks/useRefs";
import useTouch from "./hooks/useTouch";

type PropsSwiper = {
  showIndicatorDot?: boolean;
  children: React.ReactNode;
  swiperOffset?: number;
  onLast?: () => void;
};

export default function Swiper({
  showIndicatorDot = true,
  children,
  swiperOffset = 30,
  onLast = () => {},
}) {
  const [current, setCurrent] = useState(0);
  const [swiperItemRef, setSwiperItemRefs] = useRefs();
  const [cardList, setCardList] = useState<any[]>(children);
  const [removeCardList, setRemoveCardList] = useState<any[]>([]);
  const touch = useTouch();
  const isAnimating = useRef(false);
  const catchMove = useRef(false);

  const onTouchStart = (e) => {
    touch.start(e);
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    touch.move(e);
    // const delta = touch.getDelta().deltaX;
    // swiperItemRef[0].translateX(delta);
  };

  const onTouchEnd = () => {
    const { deltaX, deltaY } = touch.end();
    if (Math.abs(deltaY) >= swiperOffset + 20) return;
    if (Math.abs(deltaX) <= swiperOffset) return;

    if (deltaX < -swiperOffset) {
      if (cardList.length > 1) {
        onNext();
      } else {
        onLast?.();
      }
    } else {
      if (removeCardList.length > 0) {
        onPrev();
      }
    }
  };

  const onPrev = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    swiperItemRef.forEach((item) => item?.clearClass());

    requestAnimationFrame(() => {
      let lastRemoveCard = removeCardList.pop();
      lastRemoveCard = React.cloneElement(lastRemoveCard, {
        className: "first-reverse",
      });
      swiperItemRef[0]?.addClass("second-reverse");
      swiperItemRef[1]?.addClass("third-reverse");
      cardList.unshift(lastRemoveCard);
      setCardList([...cardList]);

      new Promise((resolve) => {
        setTimeout(() => {
          setCurrent(current - 1);
          setRemoveCardList([...removeCardList]);
          isAnimating.current = false;
          resolve("reset");
        }, 350);
      });
    });
  };

  const onNext = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    swiperItemRef.forEach((item) => item?.clearClass());

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          swiperItemRef[0]?.addClass("first");
          swiperItemRef[1]?.addClass("second");
          swiperItemRef[2]?.addClass("third");
          new Promise((resolve) => {
            setTimeout(() => {
              setCurrent(current + 1);
              const removeCard = cardList.shift();
              removeCardList.push(removeCard);
              setRemoveCardList([...removeCardList]);
              setCardList([...cardList]);
              isAnimating.current = false;
              swiperItemRef.forEach((item) => item?.clearClass());
              resolve("reset");
            }, 350);
          });
        });
      });
    });
  };

  console.log(catchMove.current, "==========");

  return (
    <View onTouchMove={(e) => e.preventDefault()} style={{ height: "300rpx" }}>
      <View
        className="swiper-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {React.Children.map(cardList, (item, index) => {
          return React.cloneElement(item, {
            style: {
              color: "white",
            },
            ref: setSwiperItemRefs(index),
            sourceIndex: index,
          });
        })}
      </View>
      <View onClick={onPrev}>上一张</View>
      <View onClick={onNext}>下一张</View>
    </View>
  );
}
