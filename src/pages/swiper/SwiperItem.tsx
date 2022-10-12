import { View } from "@tarojs/components";
import React, { useImperativeHandle, useRef } from "react";

type PropsSwiperItem = {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
};

const SwiperItem = React.forwardRef<any, PropsSwiperItem>((props, ref) => {
  const { children, style, className } = props;
  const itemRef = useRef<any>();

  useImperativeHandle(ref, () => {
    return {
      addClass(classname) {
        itemRef.current.classList.add(classname);
      },
      clearClass() {
        if (itemRef.current) {
          const classList = ["first", "second", "third"];
          classList.forEach((name) => {
            if (itemRef.current.classList.contains(name)) {
              itemRef.current.classList.remove(name);
            }
            if (itemRef.current.classList.contains(name + "-reverse")) {
              itemRef.current.classList.remove(name + "-reverse");
            }
          });
        }
      },
      translateX(offset) {
        itemRef.current.style.transform = `translateX(${offset}px)`;
      },
    };
  });

  return (
    <View
      className={`swiper-item-container ${className}`}
      ref={itemRef}
      style={style}
    >
      {children}
    </View>
  );
});

export default SwiperItem;
