import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './App.css';

const queryClient = new QueryClient()
const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router({routePrefix: '/'})} fallbackElement={<div>Sorry. The page you try to visit not existed.</div>}/>
          <ReactQueryDevtools initialIsOpen/>
      </QueryClientProvider>

  );
};

export default App;
