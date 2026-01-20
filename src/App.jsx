import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@stores/authStore';
import wsService from '@services/websocket';

// Pages
import Login from '@components/pages/Login';
import DashboardLayout from '@components/layout/DashboardLayout';
import Dashboard from '@components/pages/Dashboard';
import Sensors from '@components/pages/Sensors';
import Location from '@components/pages/Location';
import Communication from '@components/pages/Communication';
import Cracks from '@components/pages/Cracks';
import Settings from '@components/pages/Settings';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user document from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            };
            
            setUser(userData);
            
            // Connect WebSocket
            const token = await firebaseUser.getIdToken();
            wsService.connect(token);
          } else {
            console.error('User document not found');
            logout();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          logout();
        }
      } else {
        setUser(null);
        wsService.disconnect();
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribe();
      wsService.disconnect();
    };
  }, [setUser, setLoading, logout]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#334155',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="sensors" element={<Sensors />} />
          <Route path="location" element={<Location />} />
          <Route path="communication" element={<Communication />} />
          <Route path="cracks" element={<Cracks />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
