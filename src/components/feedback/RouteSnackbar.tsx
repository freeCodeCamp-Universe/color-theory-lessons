import { useLocation, useNavigate } from 'react-router-dom';
import styles from './RouteSnackbar.module.css';

interface RouteNoticeState {
  routeNotice?: string;
}

export function RouteSnackbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const message = (location.state as RouteNoticeState | null)?.routeNotice;

  if (!message) return null;

  function dismiss() {
    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: null,
    });
  }

  return (
    <div className={styles.snackbar}>
      <span role="status" aria-live="polite" aria-atomic="true">{message}</span>
      <button type="button" className={styles.dismiss} onClick={dismiss}>
        dismiss
      </button>
    </div>
  );
}
