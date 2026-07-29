import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Line, Path, Stop } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors } from '../../theme/colors';

type Props = {
  points: number[];
  width: number;
  height: number;
  /** Line and fill hue; defaults to the brand teal. */
  color?: string;
  /** Index currently being scrubbed, or null when the user isn't touching it. */
  scrubIndex?: number | null;
};

/** Top and bottom breathing room so the line never touches the edges. */
const INSET = 8;

/**
 * The price line: a bright stroke over a fill that fades to nothing at the
 * baseline, plus a scrub marker when the user is dragging across it.
 *
 * Values are normalised to their own min/max rather than to zero, so a coin that
 * moved 1% fills the same vertical space as one that moved 40% — the shape of
 * the move is what matters here, not its absolute scale.
 */
export function PriceChart({ points, width, height, color = colors.accent, scrubIndex }: Props) {
  const geometry = useMemo(() => buildGeometry(points, width, height), [points, width, height]);

  if (!geometry) return <View style={{ width, height }} />;

  const { line, area, x, y } = geometry;
  const scrubbing = scrubIndex != null && scrubIndex >= 0 && scrubIndex < points.length;

  return (
    <Animated.View entering={FadeIn.duration(420)} style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.28} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Path d={area} fill="url(#priceFill)" />
        <Path d={line} stroke={color} strokeWidth={1.6} fill="none" strokeLinejoin="round" />

        {scrubbing ? (
          <>
            <Line
              x1={x(scrubIndex)}
              y1={0}
              x2={x(scrubIndex)}
              y2={height}
              stroke={colors.dividerCap}
              strokeWidth={1}
              opacity={0.4}
            />
            <Circle
              cx={x(scrubIndex)}
              cy={y(points[scrubIndex])}
              r={5}
              fill={colors.bg}
              stroke={color}
              strokeWidth={2}
            />
          </>
        ) : null}
      </Svg>
    </Animated.View>
  );
}

/** Where a given sample sits horizontally — shared with the scrub bubble. */
export function scrubX(index: number, count: number, width: number) {
  if (count < 2) return 0;
  return (index / (count - 1)) * width;
}

function buildGeometry(points: number[], width: number, height: number) {
  if (points.length < 2 || width <= 0 || height <= 0) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  // A perfectly flat series would divide by zero; draw it down the middle.
  const span = max - min || 1;
  const usable = height - INSET * 2;

  const x = (i: number) => scrubX(i, points.length, width);
  const y = (v: number) => INSET + (1 - (v - min) / span) * usable;

  const line = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(v).toFixed(2)}`)
    .join(' ');
  const area = `${line} L${width.toFixed(2)},${height} L0,${height} Z`;

  return { line, area, x, y, min, max };
}
