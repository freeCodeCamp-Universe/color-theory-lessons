import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteAccessibility() {
  const location = useLocation();
  const routeId = location.pathname;
  const previousRouteId = useRef(routeId);

  useEffect(() => {
    if (previousRouteId.current === routeId) return;
    previousRouteId.current = routeId;

    const main = document.getElementById('main-content');
    if (!main) return;
    const mainContent = main;

    let focused = false;
    function focusHeading() {
      if (focused) return true;
      const heading = mainContent.querySelector<HTMLElement>(
        'h1:not([data-route-loading-heading])',
      );
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
