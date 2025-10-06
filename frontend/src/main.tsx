import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css'
import App from './App.tsx'
import Layout from './layouts/dashboard.tsx';
import DashboardPage from './pages/index.tsx';
import BooksPage from './pages/Books.tsx';

const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [{
      path: '/',
      Component: Layout,
      children: [{
        path: '',
        Component: DashboardPage
      }, {
        path: 'books',
        Component: BooksPage
      }]
    }]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
