import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout';

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage })),
);
const TodoPage = lazy(() =>
  import('@/pages/TodoPage').then((module) => ({ default: module.TodoPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);

function RouteLoading() {
  return (
    <div
      className="mx-auto max-w-5xl animate-pulse space-y-4 px-4 py-12 sm:px-6"
      aria-label="Loading"
    >
      <div className="h-9 w-52 rounded-lg bg-muted" />
      <div className="h-4 w-80 max-w-full rounded-lg bg-muted" />
      <div className="mt-8 h-64 rounded-xl bg-muted" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="todos" element={<TodoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
