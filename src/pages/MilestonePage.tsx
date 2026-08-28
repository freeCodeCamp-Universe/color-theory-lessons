import { useParams, Link, Navigate } from 'react-router-dom';
import { getMilestoneById } from '../data/milestones.ts';
import { MilestonePlayer } from '../components/milestone/MilestonePlayer.tsx';
import { useAppState } from '../state/app-context.tsx';
import { isDevelopmentMode, isMilestoneUnlocked } from '../utils/progression.ts';
import { DocumentTitle } from '../components/accessibility/DocumentTitle.tsx';

export function MilestonePage() {
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const { completedLessons, completedMilestones } = useAppState();
  const milestone = milestoneId ? getMilestoneById(milestoneId) : undefined;

  if (!milestone) {
    return (
      <div>
        <DocumentTitle page="Milestone not found" />
        <h1>milestone not found</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
          milestone not found: {milestoneId}
        </p>
        <Link to="/" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>
          ← back to home
        </Link>
      </div>
    );
  }

  const isLocked = !isDevelopmentMode() && !isMilestoneUnlocked(
    milestone.id,
    { completedLessons, completedMilestones },
  );

  if (isLocked) {
    return (
      <Navigate
        to="/"
        replace
        state={{ routeNotice: 'This milestone is not unlocked yet.' }}
      />
    );
  }

  return (
    <>
      <DocumentTitle page={milestone.title} />
      <MilestonePlayer key={milestone.id} milestone={milestone} />
    </>
  );
}
