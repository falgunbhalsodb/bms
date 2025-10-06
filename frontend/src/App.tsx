import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router';
import type { Navigation } from '@toolpad/core';
import './App.css'
import { HomeOutlined } from '@mui/icons-material';
import BookIcon from '@mui/icons-material/Book';

const NAVIGATION: Navigation = [
  {
    title: 'Home',
    icon: <HomeOutlined />
  },
  {
    title: 'Books',
    segment: 'books',
    icon: <BookIcon />
  },
];

const BRANDING = {
  title: 'Book Management System',
};

function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}

export default App
