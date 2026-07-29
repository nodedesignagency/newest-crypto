import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Coin } from '../../services/types';
import { colors } from '../../theme/colors';
import { monogram } from '../../utils/format';

type Props = {
  coin: Coin;
  size?: number;
};

/**
 * Circular coin mark. Renders the coin's real artwork when the API supplied a
 * logo, and falls back to a monogram on the coin's color when it didn't — or
 * when the image fails to load (offline, dead URL, blocked by CSP).
 */
export function CoinAvatar({ coin, size = 44 }: Props) {
  const [failed, setFailed] = useState(false);
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (coin.logoUrl && !failed) {
    return (
      <Image
        source={{ uri: coin.logoUrl }}
        style={[styles.circle, shape]}
        onError={() => setFailed(true)}
        accessibilityIgnoresInvertColors
        accessibilityLabel={`${coin.name} logo`}
      />
    );
  }

  return (
    <View style={[styles.circle, shape, { backgroundColor: coin.color }]}>
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
