import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getMilestoneById } from '../../data/milestones.ts';
import { LESSON_TITLES } from '../../lessons/lesson-titles.ts';

const COURSE_TITLE = 'Color Theory Course';

function pageTitle(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pageTitle(pathname.slice(0, -1));
  }

  if (pathname === '/') return COURSE_TITLE;
  if (pathname === '/palette-builder') return `Palette Builder | ${COURSE_TITLE}`;
  if (pathname === '/glossary') return `Glossary | ${COURSE_TITLE}`;
  if (pathname === '/review') return `Review | ${COURSE_TITLE}`;

  const lessonMatch = pathname.match(/^\/lesson\/([^/]+)$/);
  if (lessonMatch) {
    const lessonTitle = LESSON_TITLES[lessonMatch[1]];
    return `${lessonTitle ?? 'Lesson not found'} | ${COURSE_TITLE}`;
  }

  const milestoneMatch = pathname.match(/^\/milestone\/([^/]+)$/);
  if (milestoneMatch) {
    const milestone = getMilestoneById(milestoneMatch[1]);
    return `${milestone?.title ?? 'Milestone not found'} | ${COURSE_TITLE}`;
  }

  return `Page not found | ${COURSE_TITLE}`;
}

export function RouteAccessibility() {
  const location = useLocation();
  const routeId = location.pathname;
  const previousRouteId = useRef(routeId);

  useLayoutEffect(() => {
    document.title = pageTitle(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (previousRouteId.current === routeId) return;
    previousRouteId.current = routeId;

    const main = document.getElementById('main-content');
    if (!main) return;
    const mainContent = main;

    let focused = false;
    function focusHeading() {
      if (focused) return true;
      const heading = mainContent.querySelector<HTMLElement>('h1');
      if (!heading) return false;

      heading.tabIndex = -1;
      heading.focus();
      focused = true;
      return true;
    }

    const observerRef: { current: MutationObserver | null } = { current: null };
    const frame = window.requestAnimationFrame(() => {
      if (focusHeading()) return;

      const observer = new MutationObserver(() => {
        if (focusHeading()) observer.disconnect();
      });
      observer.observe(mainContent, { childList: true, subtree: true });
      observerRef.current = observer;
    });
    return () => {
      window.cancelAnimationFrame(frame);
      observerRef.current?.disconnect();
    };
  }, [routeId]);

  return null;
}
