import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './App.css';
import {Watermark} from "antd";

const queryClient = new QueryClient()
const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
          <Watermark content="Tokei">
              <RouterProvider router={router({routePrefix: '/'})} fallbackElement={<div>Sorry. The page you try to visit not existed.</div>}/>
              <ReactQueryDevtools initialIsOpen/>
          </Watermark>

      </QueryClientProvider>

  );
};

export default App;
