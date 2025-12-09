import { Suspense, lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import './index.css';

const Loading = <div>Loading...</div>;

const MainPage = lazy(() => import("./pages/MainPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TodoIndex = lazy(() => import("./pages/todo/IndexPage"));
const TodoList = lazy(() => import("./pages/todo/ListPage"));
const TodoRead = lazy(() => import("./pages/todo/ReadPage"));
const TodoAdd = lazy(() => import("./pages/todo/AddPage"));
const TodoModify = lazy(() => import("./pages/todo/ModifyPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={Loading}>
        <MainPage />
      </Suspense>
    ),
  },
  {
    path: "about",
    element: (
      <Suspense fallback={Loading}>
        <AboutPage />
      </Suspense>
    ),
  },
  {
    path: "todo",
    element: <Suspense fallback={Loading}><TodoIndex /></Suspense>,
    children: [
      {
        index: true,
        element: <Navigate to="list" replace />
      },
      {
        path: "list",
        element: <Suspense fallback={Loading}><TodoList /></Suspense>
      },
      {
        path: "add",
        element: <Suspense fallback={Loading}><TodoAdd /></Suspense>
      },
      {
        path: "modify/:tno",
        element: <Suspense fallback={Loading}><TodoModify /></Suspense>
      },
      {
        path: "read/:tno",
        element: <Suspense fallback={Loading}><TodoRead /></Suspense>
      }
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
