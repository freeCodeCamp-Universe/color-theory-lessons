import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { lessonRegistry } from '../lessons/lesson-registry.ts';
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
});

describe('LessonPage', () => {
  const lessonRoute = (
    <Routes>
      <Route path="/lesson/:lessonId" element={<LessonPage />} />
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
});
