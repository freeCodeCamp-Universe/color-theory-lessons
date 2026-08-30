import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './state/app-provider.tsx';
import { AppShell } from './components/layout/AppShell.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

const HomePage = lazy(() => import('./pages/HomePage.tsx').then((m) => ({ default: m.HomePage })));
const LessonPage = lazy(() => import('./pages/LessonPage.tsx').then((m) => ({ default: m.LessonPage })));
const MilestonePage = lazy(() => import('./pages/MilestonePage.tsx').then((m) => ({ default: m.MilestonePage })));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage.tsx').then((m) => ({ default: m.GlossaryPage })));
const ReviewPage = lazy(() => import('./pages/ReviewPage.tsx').then((m) => ({ default: m.ReviewPage })));
const PaletteBuilderPage = lazy(() => import('./pages/PaletteBuilderPage.tsx').then((m) => ({ default: m.PaletteBuilderPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx').then((m) => ({ default: m.NotFoundPage })));

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          <ErrorBoundary>
          <Suspense fallback={<h1 style={{ color: 'var(--muted)' }}>loading...</h1>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/milestone/:milestoneId" element={<MilestonePage />} />

              <Route path="/palette-builder" element={<PaletteBuilderPage />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route
                path="/capstone"
                element={<Navigate to="/milestone/milestone-6" replace />}
              />
              <Route path="/settings" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          </ErrorBoundary>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
}
