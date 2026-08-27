import { useAppDispatch, useAppState } from '../../state/app-context.tsx';
import type { ThemePreference } from '../../state/app-context.tsx';
import styles from './ThemeControl.module.css';

export function ThemeControl() {
  const { preferences } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <label className={styles.control}>
      <span className="sr-only">Theme preference</span>
      <select
        className={styles.select}
        value={preferences.theme}
        onChange={(event) => dispatch({
          type: 'SET_PREFERENCE',
          key: 'theme',
          value: event.target.value as ThemePreference,
        })}
        aria-label="Theme preference"
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="system">System</option>
      </select>
    </label>
  );
}
