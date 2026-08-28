import { Link } from 'react-router-dom';
import { DocumentTitle } from '../components/accessibility/DocumentTitle.tsx';

export function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1rem',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <DocumentTitle page="Page not found" />
      <span style={{
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--muted)',
      }}>
        404
      </span>
      <h1 style={{
        fontSize: '1.5rem',
        color: 'var(--primary-foreground)',
        margin: 0,
      }}>
        page not found
      </h1>
      <p style={{
        color: 'var(--secondary-foreground)',
        fontSize: '1rem',
        margin: 0,
        maxWidth: '360px',
      }}>
        That URL doesn't exist. Head back to the course to keep learning.
      </p>
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '0.5rem',
          fontSize: '1rem',
          color: 'var(--accent-link)',
          textDecoration: 'none',
        }}
      >
        ← back to course
      </Link>
    </div>
  );
}
