
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app/router';

function App() {
  return (
    <>
    <BrowserRouter>
    {/* <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

            <Route element={<Layout />}>
              <Route path="/" element={<ChatPage />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>

            <Route element={<Layout />}>
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider> */}
    <AppRouter />
    </BrowserRouter>
    </>
  );
}

export default App;
