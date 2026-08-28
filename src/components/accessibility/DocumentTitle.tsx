import { useLayoutEffect } from 'react';

const COURSE_TITLE = 'Color Theory Course';

interface DocumentTitleProps {
  page?: string;
}

export function DocumentTitle({ page }: DocumentTitleProps) {
  useLayoutEffect(() => {
    document.title = page ? `${page} | ${COURSE_TITLE}` : COURSE_TITLE;
  }, [page]);

  return null;
}
