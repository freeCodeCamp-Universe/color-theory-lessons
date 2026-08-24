import type { MilestoneChallengeType } from '../../types/milestone.ts';
import { AccessibilityRescueChallenge } from './challenges/AccessibilityRescueChallenge.tsx';
import { ChannelPredictionChallenge } from './challenges/ChannelPredictionChallenge.tsx';
import { DarkModeStressChallenge } from './challenges/DarkModeStressChallenge.tsx';
import { ReadInterfaceChallenge } from './challenges/ReadInterfaceChallenge.tsx';
import { SemanticAuditChallenge } from './challenges/SemanticAuditChallenge.tsx';
import { SimulationSpotterChallenge } from './challenges/SimulationSpotterChallenge.tsx';
import { ThemeFromScratchChallenge } from './challenges/ThemeFromScratchChallenge.tsx';

interface ChallengeRendererProps {
  challengeType: MilestoneChallengeType;
  onComplete: () => void;
  sessionKey?: string;
}

function UnimplementedChallenge({ challengeType }: { challengeType: MilestoneChallengeType }) {
  return (
    <div>
      <h2>Challenge not implemented yet</h2>
      <p>
        <code>{challengeType}</code> is planned but not wired yet.
      </p>
    </div>
  );
}

export function ChallengeRenderer({ challengeType, onComplete, sessionKey }: ChallengeRendererProps) {
  switch (challengeType) {
    case 'read-interface':
      return <ReadInterfaceChallenge onComplete={onComplete} sessionKey={sessionKey} />;
    case 'channel-prediction':
      return <ChannelPredictionChallenge onComplete={onComplete} sessionKey={sessionKey} />;
    case 'theme-from-scratch':
      return <ThemeFromScratchChallenge onComplete={onComplete} sessionKey={sessionKey} />;
    case 'simulation-spotter':
      return <SimulationSpotterChallenge onComplete={onComplete} sessionKey={sessionKey} />;
    case 'accessibility-rescue':
      return <AccessibilityRescueChallenge onComplete={onComplete} sessionKey={sessionKey} />;
    case 'semantic-audit':
      return <SemanticAuditChallenge onComplete={onComplete} />;
    case 'dark-mode-stress':
      return <DarkModeStressChallenge onComplete={onComplete} />;
    default:
      return <UnimplementedChallenge challengeType={challengeType} />;
  }
}
