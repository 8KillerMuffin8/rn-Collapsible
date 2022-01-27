import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  EasingNode,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface collapsableProps {
  header: any;
  children: any;
  isOpen: boolean;
}

const animDuration = 400;

const Collapsable = ({ header, children, isOpen }: collapsableProps) => {
  const containerHeight = useSharedValue(null);
  const displaceHeight = useSharedValue(null);
  const [defaultHeight, setDefaultHeight] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(null);

  useEffect(() => {
    if (isOpen) {
      displaceHeight.value = withTiming(-defaultHeight, {
        duration: animDuration,
        easing: Easing.inOut(Easing.ease),
      });
      containerHeight.value = withTiming(0, {
        duration: animDuration,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      displaceHeight.value = withTiming(headerHeight, {
        duration: animDuration,
        easing: Easing.inOut(Easing.ease),
      });
      containerHeight.value = withTiming(-defaultHeight, {
        duration: animDuration,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isOpen]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      top: containerHeight.value ? containerHeight.value : 0,
    };
  });

  const displaceStyle = useAnimatedStyle(() => {
    return {
      height: displaceHeight.value ? displaceHeight.value * -1 : 0,
    };
  });

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: "100%",
          alignItems: "center",
        }}
        onLayout={(event) => {
          setHeaderHeight(event.nativeEvent.layout.height);
        }}
      >
        {header()}
      </View>
      <Animated.View pointerEvents="none" style={displaceStyle}></Animated.View>
      <View
        style={{
          overflow: "hidden",
          height: defaultHeight + headerHeight,
          width: "100%",
          position: "absolute",
          zIndex: -10,
          marginTop: headerHeight,
        }}
      >
        <Animated.View
          style={[
            containerStyle,
            {
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              zIndex: -10,
            },
          ]}
          onLayout={(event) => {
            setDefaultHeight(event.nativeEvent.layout.height);
          }}
        >
          {children}
        </Animated.View>
      </View>
    </View>
  );
};

export default Collapsable;
