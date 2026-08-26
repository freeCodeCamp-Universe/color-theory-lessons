import type { MilestoneChallengeType } from '../../types/milestone.ts';
import { AccessibilityRescueChallenge } from './challenges/AccessibilityRescueChallenge.tsx';
import { ChannelPredictionChallenge } from './challenges/ChannelPredictionChallenge.tsx';
import { DarkModeStressChallenge } from './challenges/DarkModeStressChallenge.tsx';
import { ReadInterfaceChallenge } from './challenges/ReadInterfaceChallenge.tsx';
import { SemanticAuditChallenge } from './challenges/SemanticAuditChallenge.tsx';
import { SimulationSpotterChallenge } from './challenges/SimulationSpotterChallenge.tsx';
import { ThemeFromScratchChallenge } from './challenges/ThemeFromScratchChallenge.tsx';
import type { ExerciseStageChangeHandler } from '../tools/exercise-stage.ts';

interface ChallengeRendererProps {
  challengeType: MilestoneChallengeType;
  onComplete: () => void;
  sessionKey?: string;
  onStageChange?: ExerciseStageChangeHandler;
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

export function ChallengeRenderer({
  challengeType,
  onComplete,
  sessionKey,
  onStageChange,
}: ChallengeRendererProps) {
  const challengeProps = { onComplete, sessionKey, onStageChange };

  switch (challengeType) {
    case 'read-interface':
      return <ReadInterfaceChallenge {...challengeProps} />;
    case 'channel-prediction':
      return <ChannelPredictionChallenge {...challengeProps} />;
    case 'theme-from-scratch':
      return <ThemeFromScratchChallenge {...challengeProps} />;
    case 'simulation-spotter':
      return <SimulationSpotterChallenge {...challengeProps} />;
    case 'accessibility-rescue':
      return <AccessibilityRescueChallenge {...challengeProps} />;
    case 'semantic-audit':
      return <SemanticAuditChallenge {...challengeProps} />;
    case 'dark-mode-stress':
      return <DarkModeStressChallenge {...challengeProps} />;
    default:
      return <UnimplementedChallenge challengeType={challengeType} />;
  }
}
