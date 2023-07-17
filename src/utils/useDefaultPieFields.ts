import {
  useColorField,
  useItemSize,
  useMemoizedMetricField,
  useNumberField
} from "@modbros/dashboard-sdk";
import { getMetricMaxValue } from "./metricUtils";
import { useCallback } from "react";
import { ChannelValue } from "@modbros/dashboard-core";

export function useDefaultPieFields(defaultColor: string = "#000000") {
  const { width, height } = useItemSize();
  const thickness = useNumberField({
    field: "thickness",
    defaultValue: 15
  });
  const cornerRadius = useNumberField({
    field: "corner_radius",
    defaultValue: 0
  });
  const color = useColorField({ field: "color", defaultColor });
  const backColor = useColorField({ field: "back_color" });
  const maxValue = useNumberField({ field: "max" });

  const memo = useCallback((channelValue: ChannelValue) => {
    return parseFloat(channelValue.value?.value?.toString()).toFixed(0);
  }, []);

  const { value, channelValue } = useMemoizedMetricField({ field: "metric", memo });
  const diameter = Math.min(width, height);
  const radius = diameter / 2;
  const max = getMetricMaxValue(channelValue, maxValue);

  return {
    width,
    height,
    thickness,
    cornerRadius,
    channelValue,
    color,
    backColor,
    max,
    radius,
    value
  };
}
