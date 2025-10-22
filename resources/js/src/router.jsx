
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
import IngredientList from "./components/ingredient/IngredientList";
import IngredientCreate from "./components/ingredient/IngredientCreate";
import IngredientEdit from "./components/ingredient/IngredientEdit";
import BottleCostCreate from "./components/bootle_cost/BottleCostCreate";
import BottleCostEdit from "./components/bootle_cost/BottleCostEdit";
import BottleCostList from "./components/bootle_cost/BottleCostList";
import DriverCreate from "./components/driver/DriverCreate";
import DriverEdit from "./components/driver/DriverEdit";
import DriverList from "./components/driver/DriverList";
import PurchaseList from "./components/purchase/PurchaseList";
import PurchaseCreate from "./components/purchase/PurchaseCreate";
import PurchaseEdit from "./components/purchase/PurchaseEdit";

import LocationList from "./components/location/LocationList";
import LocationCreate from "./components/location/LocationCreate";
import LocationEdit from "./components/location/LocationEdit";

import FlavourList from "./components/flavour/FlavourList";
import FlavourCreate from "./components/flavour/FlavourCreate";
import FlavourEdit from "./components/flavour/FlavourEdit";

import RouteCreate from "./components/routes/RouteCreate";
import RouteList from "./components/routes/RouteList";
import RouteEdit from "./components/routes/RouteEdit";

import JuiceAllocationCreate from "./components/allocations/JuiceAllocationCreate";
import JuiceAllocationEdit from "./components/allocations/JuiceAllocationEdit";
import JuiceAllocationList from "./components/allocations/JuiceAllocationList";

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


export const USER_LIST = "user/list";
export const USER_ADD = "user/create";
export const USER_EDIT = "user/edit/:id";

export const USER_LIST_PATH = `${SUPER_ADMIN_BASE}/user/list`;
export const USER_ADD_PATH = `${SUPER_ADMIN_BASE}/user/create`;
export const USER_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/user/edit/${id}`;

export const DRIVER_LIST = "driver/list";
export const DRIVER_ADD = "driver/create";
export const DRIVER_EDIT = "driver/edit/:id";

export const DRIVER_LIST_PATH = `${SUPER_ADMIN_BASE}/driver/list`;
export const DRIVER_ADD_PATH = `${SUPER_ADMIN_BASE}/driver/create`;
export const DRIVER_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/driver/edit/${id}`;


export const FLAVOUR_LIST = "flavour/list";
export const FLAVOUR_ADD = "flavour/create";
export const FLAVOUR_EDIT = "flavour/edit/:id";

export const FLAVOUR_LIST_PATH = `${SUPER_ADMIN_BASE}/flavour/list`;
export const FLAVOUR_ADD_PATH = `${SUPER_ADMIN_BASE}/flavour/create`;
export const FLAVOUR_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/flavour/edit/${id}`;


export const PURCHASE_LIST = "purchase/list";
export const PURCHASE_ADD = "purchase/create";
export const PURCHASE_EDIT = "purchase/edit/:id";

export const PURCHASE_LIST_PATH = `${SUPER_ADMIN_BASE}/purchase/list`;
export const PURCHASE_ADD_PATH = `${SUPER_ADMIN_BASE}/purchase/create`;
export const PURCHASE_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/purchase/edit/${id}`;


export const LOCATION_LIST = "location/list";
export const LOCATION_ADD = "location/create";
export const LOCATION_EDIT = "location/edit/:id";

export const LOCATION_LIST_PATH = `${SUPER_ADMIN_BASE}/location/list`;
export const LOCATION_ADD_PATH = `${SUPER_ADMIN_BASE}/location/create`;
export const LOCATION_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/location/edit/${id}`;


export const JUICE_ALLOCATION_LIST = "juice/allocation/list";
export const JUICE_ALLOCATION_ADD = "juice/allocation/create";
export const JUICE_ALLOCATION_EDIT = "juice/allocation/edit/:id";

export const JUICE_ALLOCATION_LIST_PATH = `${SUPER_ADMIN_BASE}/juice/allocation/list`;
export const JUICE_ALLOCATION_ADD_PATH = `${SUPER_ADMIN_BASE}/juice/allocation/create`;
export const JUICE_ALLOCATION_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/juice/allocation/edit/${id}`;


export const DRIVER_ROUTE_LIST = "driver/route/list";
export const DRIVER_ROUTE_ADD = "driver/route/create";
export const DRIVER_ROUTE_EDIT = "driver/route/edit/:id";

export const DRIVER_ROUTE_LIST_PATH = `${SUPER_ADMIN_BASE}/driver/route/list`;
export const DRIVER_ROUTE_ADD_PATH = `${SUPER_ADMIN_BASE}/driver/route/create`;
export const DRIVER_ROUTE_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/driver/route/edit/${id}`;


export const INGREDIENT_LIST = "ingredient/list";
export const INGREDIENT_ADD = "ingredient/create";
export const INGREDIENT_EDIT = "ingredient/edit/:id";

export const BOTTLE_LIST = "bottle/cost/list";
export const BOTTLE_ADD = "bottle/cost/create";
export const BOTTLE_EDIT = "bottle/cost/edit/:id";

export const INGREDIENT_LIST_PATH = `${SUPER_ADMIN_BASE}/ingredient/list`;
export const INGREDIENT_ADD_PATH = `${SUPER_ADMIN_BASE}/ingredient/create`;
export const INGREDIENT_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/ingredient/edit/${id}`;

export const BOTTLE_LIST_PATH = `${SUPER_ADMIN_BASE}/bottle/cost/list`;
export const BOTTLE_ADD_PATH = `${SUPER_ADMIN_BASE}/bottle/cost/create`;
export const BOTTLE_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/bottle/cost/edit/${id}`;

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
      { path: USER_EDIT, element: <ProtectedRoute role="superadmin"><UserEdit /></ProtectedRoute> },
      
      { path: INGREDIENT_LIST_PATH, element: <ProtectedRoute role="superadmin"><IngredientList /></ProtectedRoute> },
      { path: INGREDIENT_ADD_PATH, element: <ProtectedRoute role="superadmin"><IngredientCreate /></ProtectedRoute> },
      { path: INGREDIENT_EDIT, element: <ProtectedRoute role="superadmin"><IngredientEdit /></ProtectedRoute> },
      
      { path: BOTTLE_LIST_PATH, element: <ProtectedRoute role="superadmin"><BottleCostList /></ProtectedRoute> },
      { path: BOTTLE_ADD_PATH, element: <ProtectedRoute role="superadmin"><BottleCostCreate /></ProtectedRoute> },
      { path: BOTTLE_EDIT, element: <ProtectedRoute role="superadmin"><BottleCostEdit /></ProtectedRoute> },

      { path: DRIVER_LIST_PATH, element: <ProtectedRoute role="superadmin"><DriverList /></ProtectedRoute> },
      { path: DRIVER_ADD_PATH, element: <ProtectedRoute role="superadmin"><DriverCreate /></ProtectedRoute> },
      { path: DRIVER_EDIT, element: <ProtectedRoute role="superadmin"><DriverEdit /></ProtectedRoute> },
      
      { path: PURCHASE_LIST_PATH, element: <ProtectedRoute role="superadmin"><PurchaseList /></ProtectedRoute> },
      { path: PURCHASE_ADD_PATH, element: <ProtectedRoute role="superadmin"><PurchaseCreate /></ProtectedRoute> },
      { path: PURCHASE_EDIT, element: <ProtectedRoute role="superadmin"><PurchaseEdit /></ProtectedRoute> },
      
      { path: FLAVOUR_LIST_PATH, element: <ProtectedRoute role="superadmin"><FlavourList /></ProtectedRoute> },
      { path: FLAVOUR_ADD_PATH, element: <ProtectedRoute role="superadmin"><FlavourCreate /></ProtectedRoute> },
      { path: FLAVOUR_EDIT, element: <ProtectedRoute role="superadmin"><FlavourEdit /></ProtectedRoute> },

      { path: LOCATION_LIST_PATH, element: <ProtectedRoute role="superadmin"><LocationList /></ProtectedRoute> },
      { path: LOCATION_ADD_PATH, element: <ProtectedRoute role="superadmin"><LocationCreate /></ProtectedRoute> },
      { path: LOCATION_EDIT, element: <ProtectedRoute role="superadmin"><LocationEdit /></ProtectedRoute> },
      
      { path: DRIVER_ROUTE_LIST_PATH, element: <ProtectedRoute role="superadmin"><RouteList /></ProtectedRoute> },
      { path: DRIVER_ROUTE_ADD_PATH, element: <ProtectedRoute role="superadmin"><RouteCreate /></ProtectedRoute> },
      { path: DRIVER_ROUTE_EDIT, element: <ProtectedRoute role="superadmin"><RouteEdit /></ProtectedRoute> },
      
      { path: JUICE_ALLOCATION_LIST_PATH, element: <ProtectedRoute role="superadmin"><JuiceAllocationList /></ProtectedRoute> },
      { path: JUICE_ALLOCATION_ADD_PATH, element: <ProtectedRoute role="superadmin"><JuiceAllocationCreate /></ProtectedRoute> },
      { path: JUICE_ALLOCATION_EDIT, element: <ProtectedRoute role="superadmin"><JuiceAllocationEdit /></ProtectedRoute> },
    ],
  },
]);

export default router;