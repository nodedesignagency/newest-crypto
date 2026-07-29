import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { FADE_BLUR_INTENSITY, FADE_HEIGHT, FADE_MAX_OPACITY } from '../../theme/effects';

/**
 * The scroll affordance above the tab bar: content passing underneath softens and
 * dissolves toward the bar, so it reads as continuing rather than stopping.
 *
 * Figma draws this 402 x 112.19 with its lower 72px behind the nav bar, leaving
 * 40.2 visible. Rendering only the visible slice keeps it clear of the navigator,
 * so the gradient is truncated to the same fraction of its ramp (40.2 / 112.19)
 * that the design actually shows — the nav's own opaque fill carries on from there.
 *
 * Non-interactive: it sits over the list, so it must not swallow touches.
 */
export function BottomFade() {
  return (
    <View style={styles.container} pointerEvents="none">
      <BlurView intensity={FADE_BLUR_INTENSITY} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(2,2,14,0)', `rgba(2,2,14,${FADE_MAX_OPACITY})`]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FADE_HEIGHT,
  },
});
