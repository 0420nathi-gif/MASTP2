import React, { forwardRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export const HoverablePressable = forwardRef(function HoverablePressable(
  {
    children,
    disabled,
    onHoverIn,
    onHoverOut,
    style,
    ...pressableProps
  },
  ref,
) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      {...pressableProps}
      ref={ref}
      disabled={disabled}
      onHoverIn={(event) => {
        setIsHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setIsHovered(false);
        onHoverOut?.(event);
      }}
      style={(state) => [
        typeof style === "function" ? style(state) : style,
        !disabled && isHovered && styles.hovered,
        !disabled && state.pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
});

export function HoverableView({
  children,
  onPointerEnter,
  onPointerLeave,
  onFocusCapture,
  onBlurCapture,
  hoverStyle,
  style,
  ...viewProps
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      {...viewProps}
      onPointerEnter={(event) => {
        setIsHovered(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setIsHovered(false);
        onPointerLeave?.(event);
      }}
      onFocusCapture={(event) => {
        setIsFocused(true);
        onFocusCapture?.(event);
      }}
      onBlurCapture={(event) => {
        setIsFocused(false);
        onBlurCapture?.(event);
      }}
      style={[style, (isHovered || isFocused) && hoverStyle]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hovered: { opacity: 0.88, transform: [{ scale: 1.015 }] },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
