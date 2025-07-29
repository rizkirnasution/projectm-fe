import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './store/index';
import { setCredentials } from './store/slices/authSlice';
import { router } from './routes/index';
import './index.css';


const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
const role = localStorage.getItem('role');

if (token && email && role) {
  store.dispatch(setCredentials({ token, email, role }));
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);