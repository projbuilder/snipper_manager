import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SnippetList from './pages/SnippetList';
import SnippetDetail from './pages/SnippetDetail';
import SnippetEditor from './pages/SnippetEditor';
import Profile from './pages/Profile';
import PrivateRoute from './components/shared/PrivateRoute';

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
    }
  }, [isAuthenticated, loadUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="snippets" element={<SnippetList />} />
          <Route path="snippets/:id" element={<SnippetDetail />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="snippets/new" element={<SnippetEditor />} />
            <Route path="snippets/:id/edit" element={<SnippetEditor />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
