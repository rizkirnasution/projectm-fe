import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from "./PrivateRoute";
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Task from '../pages/Task';
import User from '../pages/Users'

export const router = createBrowserRouter([
    {
        path: '/dashboard',
        element: (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
      
          ),
    },
    {
        path: '/task',
        element: (
            <PrivateRoute>
              <Task />
            </PrivateRoute>
      
          ),
    },
    {
        path: '/user',
        element: (
            <PrivateRoute>
              <User />
            </PrivateRoute>
      
          ),
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: "/",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
])