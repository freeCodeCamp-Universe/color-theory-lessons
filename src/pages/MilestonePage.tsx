import { useParams, Link } from 'react-router-dom';
import { getMilestoneById } from '../data/milestones.ts';
import { MilestonePlayer } from '../components/milestone/MilestonePlayer.tsx';

export function MilestonePage() {
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const milestone = milestoneId ? getMilestoneById(milestoneId) : undefined;

  if (!milestone) {
    return (
      <div>
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
          milestone not found: {milestoneId}
        </p>
        <Link to="/" style={{ marginTop: '1rem', display: 'inline-block' }}>
          ← back to home
        </Link>
      </div>
    );
  }

  return <MilestonePlayer key={milestone.id} milestone={milestone} />;
}
