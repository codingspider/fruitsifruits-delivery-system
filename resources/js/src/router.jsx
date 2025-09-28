
import {
  createBrowserRouter,
} from "react-router-dom";

import Login from "./components/auth/Login";
import Welcome from "./components/pages/Welcome";
import Unauthorized from "./components/auth/Unauthorized";
import Forgot from "./components/auth/Forgot";
import ResetPassword from "./components/auth/ResetPassword";
import Dashboard from "./components/superadmin/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "./components/layouts/MainLayout";
import ErrorPage from "./components/pages/ErrorPage";
import MasterSetting from "./components/superadmin/MasterSetting";
import SaveOrder from "./components/order/SaveOrder";
import UserList from "./components/user/UserList";
import UserCreate from "./components/user/UserCreate";
import UserEdit from "./components/user/UserEdit";


// ✅ Public Routes
export const ROOT = '/';
export const LOGIN = '/login';
export const FORGOT = '/forgot/password';
export const RESET_PASSWORD = '/reset/password/:reset_token';
export const UNAUTHORIZED = '/unauthorized';

// ✅ Role-based base paths
export const SUPER_ADMIN_BASE = '/super/admin';
export const ADMIN_BASE = '/admin';
export const USER_BASE = '/user';
export const STAFF_BASE = '/staff';
export const DASHBOARD = 'dashboard';

export const MASTER_SETTING = `${SUPER_ADMIN_BASE}/settings`;
export const DASHBOARD_PATH = `${SUPER_ADMIN_BASE}/dashboard`;

export const SAVE_ORDER = `${SUPER_ADMIN_BASE}/save/order`;


export const USER_LIST_PATH = `${SUPER_ADMIN_BASE}/user/list`;
export const USER_ADD_PATH = `${SUPER_ADMIN_BASE}/user/create`;
export const USER_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/user/edit/${id}`;

const router = createBrowserRouter([
  {
    path: LOGIN,
    element: <Login />,
  },
  {
    path: ROOT,
    element: <Welcome />,
  },
  {
    path: UNAUTHORIZED,
    element: <Unauthorized />,
  },
  {
    path: FORGOT,
    element: <Forgot />,
  },
  {
    path: RESET_PASSWORD,
    element: <ResetPassword />,
  },


    // 🔐 SUPER ADMIN ROUTES
  {
    path: SUPER_ADMIN_BASE,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: DASHBOARD, element: <ProtectedRoute role="superadmin"><Dashboard /></ProtectedRoute> },
      { path: MASTER_SETTING, element: <ProtectedRoute role="superadmin"><MasterSetting /></ProtectedRoute> },
      { path: SAVE_ORDER, element: <ProtectedRoute role="superadmin"><SaveOrder /></ProtectedRoute> },
      { path: USER_LIST_PATH, element: <ProtectedRoute role="superadmin"><UserList /></ProtectedRoute> },
      { path: USER_ADD_PATH, element: <ProtectedRoute role="superadmin"><UserCreate /></ProtectedRoute> },
    ],
  },
]);

export default router;