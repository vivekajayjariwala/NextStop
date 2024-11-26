import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PolicyPage from './pages/PolicyPage';
import SearchPage from './pages/SearchPage';
import CommunityPage from './pages/CommunityPage';
import EditPage from './pages/EditPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminPage from './pages/AdminPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
