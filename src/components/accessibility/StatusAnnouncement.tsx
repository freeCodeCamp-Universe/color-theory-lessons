interface StatusAnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

/** Announces a concise state change at the component where it occurs. */
export function StatusAnnouncement({ message, priority = 'polite' }: StatusAnnouncementProps) {
  return (
    <span
      className="sr-only"
      role={priority === 'polite' ? 'status' : 'alert'}
      aria-live={priority}
      aria-atomic="true"
    >
      {message}
    </span>
  );
}
