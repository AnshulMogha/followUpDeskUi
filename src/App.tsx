import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Records } from './pages/Records';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename='/followupdesk/'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <Records />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/records" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
