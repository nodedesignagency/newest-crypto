import React from 'react';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { HoldingsIcon } from '../../components/icons';

export default function HoldingsScreen() {
  return (
    <PlaceholderScreen
      icon={<HoldingsIcon size={44} opacity={0.35} />}
      title="Holdings"
      subtitle="Not designed yet — this tab is a placeholder so navigation works end to end."
    />
  );
}
