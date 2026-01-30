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
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="food" element={<OrderMenu />} />
            <Route path="softdrinks" element={<OrderMenu />} />
            <Route path="alcohol" element={<OrderMenu />} />
            <Route path="fast-foods" element={<OrderMenu />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:uidb64/:token" element={<ResetPassword />} />
          </Route>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/admin/edit-foods" element={<AdminLayout />}>
            <Route index element={<EditMenu />} />
          </Route>
          <Route path="/admin/edit-drinks" element={<AdminLayout />}>
            <Route index element={<EditMenu />} />
          </Route>
          <Route path="/admin/edit-alcohol" element={<AdminLayout />}>
            <Route index element={<EditMenu />} />
          </Route>
          <Route path="/admin/edit-fast-foods" element={<AdminLayout />}>
            <Route index element={<EditMenu />} />
          </Route>
          <Route path="/admin/orders/:category" element={<AdminLayout />}>
            <Route index element={<OrdersList />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
