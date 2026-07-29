import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { CoinDrawerPage } from './CoinDrawerPage';
import { Coin } from '../../services/types';
import { colors } from '../../theme/colors';
import { CARD_BORDER_WIDTH, innerGlow } from '../../theme/effects';
import { spacing } from '../../theme/spacing';

type Props = {
  /** The coins that can be swiped between — the list the user opened from. */
  coins: Coin[];
  /** Index to open at, or null when the drawer is closed. */
  index: number | null;
  onClose: () => void;
};

/** Fraction of the screen the sheet occupies when open. */
const SHEET_RATIO = 0.85;

/** Drag past this, or flick faster than the velocity below, and it dismisses. */
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;

const OPEN_SPRING = { damping: 22, stiffness: 190, mass: 0.7 } as const;

/**
 * A coin opened from one of the home lists, presented as a floating sheet.
 *
 * Horizontal swipes page between the coins of the list it was opened from;
 * vertical drags dismiss. The two never contend because the drag gesture only
 * activates on vertical movement and fails outright on horizontal — otherwise a
 * diagonal swipe would both scroll the pager and start dragging the sheet.
 */
export function CoinDrawer({ coins, index, onClose }: Props) {
  const { height: screenHeight, width } = useWindowDimensions();
  const sheetHeight = screenHeight * SHEET_RATIO;

  // Kept mounted through the closing animation, then torn down.
  const [mounted, setMounted] = useState(index !== null);
  const [active, setActive] = useState(index ?? 0);
  // Measured rather than derived: the pager's height depends on the handle, dots
  // and padding around it, and pages need a definite height to lay out against.
  const [pageHeight, setPageHeight] = useState(0);
  const listRef = useRef<FlatList<Coin>>(null);
  // FlatList's initialScrollIndex is unreliable here, so the opening position is
  // applied explicitly once the pager has a width to scroll within.
  const pendingIndex = useRef(index ?? 0);

  const translateY = useSharedValue(sheetHeight);
  const progress = useSharedValue(0);

  const finishClose = useCallback(() => {
    setMounted(false);
    onClose();
  }, [onClose]);

  const close = useCallback(() => {
    'worklet';
    progress.value = withTiming(0, { duration: 180 });
    translateY.value = withTiming(sheetHeight, { duration: 220 }, (done) => {
      if (done) runOnJS(finishClose)();
    });
  }, [finishClose, progress, sheetHeight, translateY]);

  useEffect(() => {
    if (index === null) return;
    setMounted(true);
    setActive(index);
    pendingIndex.current = index;
    listRef.current?.scrollToOffset({ offset: index * width, animated: false });
    translateY.value = sheetHeight;
    translateY.value = withSpring(0, OPEN_SPRING);
    progress.value = withTiming(1, { duration: 220 });
  }, [index, progress, sheetHeight, translateY, width]);

  const drag = Gesture.Pan()
    // Only take over once the movement is clearly vertical, and give up entirely
    // if it turns horizontal — that hands the gesture to the pager underneath.
    .activeOffsetY([-12, 12])
    .failOffsetX([-16, 16])
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      const shouldClose = e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY;
      if (shouldClose) {
        close();
      } else {
        translateY.value = withSpring(0, OPEN_SPRING);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    // Fades on open, then tracks the drag so the page behind reappears as you pull.
    opacity:
      progress.value *
      interpolate(translateY.value, [0, sheetHeight], [1, 0], Extrapolation.CLAMP),
  }));

  if (!mounted) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={() => close()} statusBarTranslucent>
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => close()}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
        </Animated.View>

        <GestureDetector gesture={drag}>
          <Animated.View style={[styles.sheet, { height: sheetHeight }, sheetStyle]}>
            <View style={styles.handle} />

            <FlatList
              ref={listRef}
              data={coins}
              style={styles.pager}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, i) => `${item.id}-${i}`}
              initialScrollIndex={index ?? 0}
              getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
              onLayout={(e) => {
                setPageHeight(e.nativeEvent.layout.height);
                listRef.current?.scrollToOffset({
                  offset: pendingIndex.current * width,
                  animated: false,
                });
              }}
              // Tracked on scroll, not on momentum end: momentum never fires for a
              // trackpad or a slow drag, which would leave the page marked inactive
              // and its chart unfetched.
              scrollEventThrottle={32}
              onScroll={(e) => {
                const next = Math.round(e.nativeEvent.contentOffset.x / width);
                setActive((prev) => (prev === next ? prev : next));
              }}
              renderItem={({ item, index: i }) => (
                <CoinDrawerPage
                  coin={item}
                  width={width}
                  height={pageHeight}
                  active={i === active}
                />
              )}
            />

            {coins.length > 1 ? (
              <View style={styles.dots}>
                {coins.map((coin, i) => (
                  <View key={coin.id} style={[styles.dot, i === active && styles.dotActive]} />
                ))}
              </View>
            ) : null}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopWidth: CARD_BORDER_WIDTH,
    borderTopColor: colors.cardBorder,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
    boxShadow: innerGlow.tabBar,
  },
  pager: {
    flex: 1,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dividerCap,
    opacity: 0.5,
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.textFaint,
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
});
