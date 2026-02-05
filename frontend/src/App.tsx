import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import OrderMenu from './pages/OrderMenu/OrderMenu';
import Dashboard from './pages/Dashboard/Dashboard';
import EditMenu from './pages/EditMenu/EditMenu';
import OrdersList from './pages/OrdersList/OrdersList';
import Tables from './pages/Tables/Tables';
import './index.css';
import './components/Layout.css';
import './components/AdminLayout.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="food" element={<OrderMenu />} />
            <Route path="softdrinks" element={<OrderMenu />} />
            <Route path="alcohol" element={<OrderMenu />} />
            <Route path="fast-foods" element={<OrderMenu />} />
          </Route>

          <Route path="/admin/login" element={<SignIn />} />
          <Route path="/admin/signup" element={<SignUp />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password/:uidb64/:token" element={<ResetPassword />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tables" element={<Tables />} />
            <Route path="edit-foods" element={<EditMenu />} />
            <Route path="edit-drinks" element={<EditMenu />} />
            <Route path="edit-alcohol" element={<EditMenu />} />
            <Route path="edit-fast-foods" element={<EditMenu />} />
            <Route path="orders/:category" element={<OrdersList />} />
          </Route>

          <Route path="/signin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/signup" element={<Navigate to="/admin/signup" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/admin/forgot-password" replace />} />
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="reset-password/:uidb64/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
