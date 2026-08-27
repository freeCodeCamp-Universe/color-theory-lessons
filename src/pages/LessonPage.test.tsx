import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { lessonRegistry } from '../lessons/lesson-registry.ts';
import { units } from '../data/units.ts';
import { RouteSnackbar } from '../components/feedback/RouteSnackbar.tsx';
import { renderWithAppState } from '../test-utils.tsx';
import { LessonPage } from './LessonPage.tsx';

const { loadLessonById } = vi.hoisted(() => ({ loadLessonById: vi.fn() }));

vi.mock('../lessons/lesson-loader.ts', () => ({
  loadLessonById,
  prefetchLessonById: vi.fn(),
}));
vi.mock('../components/tools/tool-prefetch.ts', () => ({ prefetchToolByInteractionType: vi.fn() }));
vi.mock('../components/lesson/LessonPlayer.tsx', () => ({
  LessonPlayer: ({ lesson }: { lesson: { title: string } }) => <h1>{lesson.title}</h1>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe('LessonPage', () => {
  const lessonRoute = (
    <Routes>
      <Route path="/lesson/:lessonId" element={<LessonPage />} />
      <Route path="/" element={<RouteSnackbar />} />
    </Routes>
  );

  it('shows the loading state before rendering a valid lesson', async () => {
    const lesson = lessonRegistry[0];
    let resolveLesson: (value: typeof lesson) => void = () => undefined;
    loadLessonById.mockReturnValue(new Promise((resolve) => {
      resolveLesson = resolve;
    }));

    renderWithAppState(lessonRoute, { route: `/lesson/${lesson.id}` });
    expect(screen.getByText('loading lesson...')).toBeInTheDocument();

    resolveLesson(lesson);
    expect(await screen.findByRole('heading', { name: lesson.title })).toBeInTheDocument();
    expect(loadLessonById).toHaveBeenCalledWith(lesson.id);
  });

  it('shows the loading and not-found states for an invalid lesson ID', async () => {
    loadLessonById.mockResolvedValue(undefined);

    renderWithAppState(lessonRoute, { route: '/lesson/not-a-lesson' });
    expect(screen.getByText('loading lesson...')).toBeInTheDocument();

    expect(await screen.findByText('lesson not found: not-a-lesson')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });

  it('redirects a locked production lesson to the dashboard without loading it', async () => {
    renderWithAppState(lessonRoute, { route: '/lesson/u2-l1' });

    expect(await screen.findByRole('status')).toHaveTextContent(
      'This lesson is not unlocked yet.',
    );
    expect(loadLessonById).not.toHaveBeenCalled();
  });

  it('loads a locked lesson directly in development mode', async () => {
    vi.stubEnv('VITE_DEV_MODE', '1');
    const lesson = lessonRegistry.find(({ id }) => id === 'u2-l1')!;
    loadLessonById.mockResolvedValue(lesson);

    renderWithAppState(lessonRoute, { route: `/lesson/${lesson.id}` });

    expect(await screen.findByRole('heading', { name: lesson.title })).toBeInTheDocument();
    expect(loadLessonById).toHaveBeenCalledWith(lesson.id);
  });

  it('loads a later production lesson after its prerequisites are complete', async () => {
    const lesson = lessonRegistry.find(({ id }) => id === 'u2-l1')!;
    loadLessonById.mockResolvedValue(lesson);

    renderWithAppState(lessonRoute, {
      route: `/lesson/${lesson.id}`,
      state: {
        completedLessons: units[0].lessons,
        completedMilestones: ['milestone-1'],
      },
    });

    expect(await screen.findByRole('heading', { name: lesson.title })).toBeInTheDocument();
    expect(loadLessonById).toHaveBeenCalledWith(lesson.id);
  });
});
