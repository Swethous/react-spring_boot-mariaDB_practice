import { Suspense, lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import {store} from './store/store'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const Loading = <div>Loading...</div>;
const queryClient = new QueryClient()

const MainPage = lazy(() => import("./pages/MainPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TodoIndex = lazy(() => import("./pages/todo/IndexPage"));
const TodoList = lazy(() => import("./pages/todo/ListPage"));
const TodoRead = lazy(() => import("./pages/todo/ReadPage"));
const TodoAdd = lazy(() => import("./pages/todo/AddPage"));
const TodoModify = lazy(() => import("./pages/todo/ModifyPage"));

const ProductsIndex = lazy(() => import("./pages/products/IndexPage"));
const ProductsList  = lazy(() => import("./pages/products/ListPage"));
const ProductsAdd  = lazy(() => import("./pages/products/AddPage"));
const ProductRead = lazy(() => import("./pages/products/ReadPage"));
const ProductModify = lazy(() => import("./pages/products/ModifyPage"));

const MemberIndex = lazy(() => import("./pages/member/MemberIndex"));
const LoginPage = lazy(() => import("./pages/member/LoginPage"));
const LogoutPage = lazy(() => import("./pages/member/LogoutPage"));
const KakaoRedirect = lazy(() => import("./pages/member/KakaoRedirectPage"));

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
  {
    path: "products",
    element:  <Suspense fallback={Loading}><ProductsIndex /></Suspense>,
    children: [
      {
        index: true,
        element: <Navigate to="list" replace />
      },
      {
        path: "list",
        element: <Suspense fallback={Loading}><ProductsList /></Suspense>
      },
      {
        path: "add",
        element: <Suspense fallback={Loading}><ProductsAdd /></Suspense>
      },     
      {
        path: "read/:pno",
        element: <Suspense fallback={Loading}><ProductRead /></Suspense>
      },
      {
        path: "modify/:pno",
        element: <Suspense fallback={Loading}><ProductModify /></Suspense>
      },
    ]
  },
  {
    path: "member",
    element:  <Suspense fallback={Loading}><MemberIndex /></Suspense>,

    children: [
      {
        path: "login",
        element:  <Suspense fallback={Loading}><LoginPage /></Suspense>,
      },
      {
        path: "logout",
        element:  <Suspense fallback={Loading}><LogoutPage /></Suspense>,
      },
      {
        path: "kakao",
        element:  <Suspense fallback={Loading}><KakaoRedirect /></Suspense>,
      },
      
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
