import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { FADE_BLUR_INTENSITY, FADE_HEIGHT, FADE_MAX_OPACITY } from '../../theme/effects';

/**
 * A gradient mask so the blur ramps in instead of switching on.
 *
 * On web the mask has to live on the blurred element itself: `backdrop-filter`
 * samples what is painted behind it, and wrapping it in a masking container
 * creates a stacking context that severs that sampling — the blur silently
 * disappears. Masking the element directly is the standard CSS approach and
 * keeps the filter intact.
 */
const webMask = {
  maskImage: 'linear-gradient(to bottom, transparent 0%, #000 85%)',
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 85%)',
} as const;

function RampedBlur() {
  const blur = (
    <BlurView
      intensity={FADE_BLUR_INTENSITY}
      tint="dark"
      style={[StyleSheet.absoluteFill, Platform.OS === 'web' ? (webMask as object) : null]}
    />
  );

  // Native has no CSS masking, but MaskedView composites correctly there because
  // the platform blur isn't backdrop-sampled the way the web one is.
  if (Platform.OS === 'web') return blur;

  return (
    <MaskedView
      style={StyleSheet.absoluteFill}
      maskElement={
        <LinearGradient
          colors={['transparent', '#000']}
          locations={[0, 0.85]}
          style={StyleSheet.absoluteFill}
        />
      }
    >
      {blur}
    </MaskedView>
  );
}

/**
 * The scroll affordance above the tab bar: content passing underneath softens and
 * dissolves toward the bar, so it reads as continuing rather than stopping.
 *
 * Figma draws this 402 x 112.19 with its lower 72px behind the nav bar, leaving
 * 40.2 visible. Rendering only the visible slice keeps it clear of the navigator,
 * so the gradient is truncated to the same fraction of its ramp (40.2 / 112.19)
 * that the design actually shows — the nav's own opaque fill carries on from there.
 *
 * Figma's background blur is uniform, but applied flat that snaps content from
 * sharp to fully blurred at the layer's top edge — a seam cutting through
 * whatever row sits there. The blur is ramped in instead; see RampedBlur.
 *
 * Non-interactive: it sits over the list, so it must not swallow touches.
 */
export function BottomFade() {
  return (
    <View style={styles.container} pointerEvents="none">
      <RampedBlur />
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
