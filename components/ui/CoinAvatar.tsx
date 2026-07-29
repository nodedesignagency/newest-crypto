import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Coin } from '../../services/types';
import { colors } from '../../theme/colors';
import { monogram } from '../../utils/format';

type Props = {
  coin: Coin;
  size?: number;
};

/**
 * Circular coin mark. Real logo artwork isn't in the repo yet, so this renders a
 * monogram on the coin's brand color — same footprint as an <Image>, so swapping
 * in remote logos later is a one-line change.
 */
export function CoinAvatar({ coin, size = 44 }: Props) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: coin.color },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.42 }]}>
        {monogram(coin.symbol, coin.glyph)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.text,
    fontWeight: '600',
  },
});
