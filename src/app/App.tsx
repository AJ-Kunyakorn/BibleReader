import { RouterProvider } from 'react-router';
import { router } from './routes';
import { BibleProvider } from './contexts/BibleContext';

export default function App() {
  return (
    <BibleProvider>
      <RouterProvider router={router} />
    </BibleProvider>
  );
}