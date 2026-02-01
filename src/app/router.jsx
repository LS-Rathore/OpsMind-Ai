
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from './users/layout/UsersLayout';
import Login from "./users/pages/Login"
import Signup from "./users/pages/Signup"
import Chat from "./users/pages/Chat"
import Profile from "./users/pages/Profile"
import AdminLayout from "./admin/layout/adminLayout"
import Dashboard from "./admin/pages/Dashboard"
import UsersList from './admin/pages/UsersList';
import AdminProfile from './admin/pages/Profile';
import AdminLogin from './admin/pages/Login';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("admintoken")
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

const AppRouter = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Chat />} />

              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/userslist"
                element={
                  <AdminRoute>
                    <UsersList />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <AdminRoute>
                    <AdminProfile />
                  </AdminRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </AuthProvider>
      </QueryClientProvider>

    </>
  );
}

export default AppRouter
