import React from 'react';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { RewardsIcon } from '../../components/icons';

export default function RewardsScreen() {
  return (
    <PlaceholderScreen
      icon={<RewardsIcon size={44} opacity={0.35} />}
      title="Rewards"
      subtitle="Not designed yet — this tab is a placeholder so navigation works end to end."
    />
  );
}
