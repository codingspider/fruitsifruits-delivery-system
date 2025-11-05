
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

import FinishGood from "./components/products/FinishGood";
import FinishGoodCreate from "./components/products/FinishGoodCreate";
import FinishGoodEdit from "./components/products/FinishGoodEdit";

import RecipeCreate from "./components/recipe/RecipeCreate";
import RecipeEdit from "./components/recipe/RecipeEdit";
import RecipeList from "./components/recipe/RecipeList";

import ProductionList from "./components/production/ProductionList";
import ProductionCreate from "./components/production/ProductionCreate";
import ProductionEdit from "./components/production/ProductionEdit";
import ProductionView from "./components/production/ProductionView";
import BackupProcessing from "./components/backup/BackupProcessing";
import LoginHistory from "./components/backup/LoginHistory";
import JuiceAllocationView from "./components/allocations/JuiceAllocationView";
import DriverDashboard from "./components/dashboard/DriverDashboard";
import JpsDashboard from "./components/jps/JpsDashboard";

import AssignTask from "./components/driver/AssignTask";
import TaskDetails from "./components/driver/TaskDetails";
import JuiceAllocation from "./components/driver/JuiceAllocation";
import DriverReport from "./components/driver/DriverReport";
import ReturnLeftover from "./components/driver_return/ReturnLeftover";
import DriverProfile from "./components/driver/DriverProfile";
import JpsReport from "./components/jps/JpsReport";

import LocationOverview from "./components/driver/LocationOverview";
import LocationProfitReport from "./components/reports/LocationProfitReport";
import DeliverySummeryReport from "./components/reports/DeliverySummeryReport";
import DailyCollection from "./components/driver/DailyCollection";

import DriverReportStats from "./components/driver/DriverStats";

// ✅ Public Routes
export const ROOT = '/';
export const LOGIN = '/login';
export const FORGOT = '/forgot/password';
export const RESET_PASSWORD = '/reset/password/:reset_token';
export const UNAUTHORIZED = '/unauthorized';

// ✅ Role-based base paths
export const SUPER_ADMIN_BASE = '/super/admin';
export const ADMIN_BASE = '/admin';
export const DRIVER_BASE = '/driver';
export const STAFF_BASE = '/jps';
export const DASHBOARD = 'dashboard';
export const COMMON_BASE = 'dashboard';

export const MASTER_SETTING = `${SUPER_ADMIN_BASE}/settings`;
export const DASHBOARD_PATH = `${SUPER_ADMIN_BASE}/dashboard`;
export const DRIVER_DASHBOARD_PATH = `${DRIVER_BASE}/dashboard`;
export const JPS_DASHBOARD_PATH = `${STAFF_BASE}/dashboard`;

export const SAVE_ORDER = `${SUPER_ADMIN_BASE}/save/order`;

// jps routes 
export const JPS_REPORT_PATH = `${STAFF_BASE}/jps/report`;

// driver routes 
export const ASSIGN_TASK_PATH = `${DRIVER_BASE}/assign/task`;
export const TASK_DETAILS_PATH = (id) => `${DRIVER_BASE}/task/details/${id}`;
export const TASK_DETAILS = "task/details/:id";
export const JUICE_ALLOCATION_PATH = `${DRIVER_BASE}/juice/allocation`;
export const DRIVER_REPORT_PATH = `${DRIVER_BASE}/report`;
export const RETURN_LEFTOVER_PATH = `${DRIVER_BASE}/return/leftover`;
export const DRIVER_PROFILE_PATH = `${DRIVER_BASE}/driver/profile`;
export const DRIVER_LOCATION_OVERVIEW = `${DRIVER_BASE}/driver/location/overview`;
export const DRIVER_DAILY_COLLECTION = `${DRIVER_BASE}/driver/daily/collection`;
export const DRIVER_REPORT_STATS = `${DRIVER_BASE}/driver/report/stats`;

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
export const JUICE_ALLOCATION_VIEW = "juice/allocation/view/:id";

export const JUICE_ALLOCATION_LIST_PATH = `${SUPER_ADMIN_BASE}/juice/allocation/list`;
export const JUICE_ALLOCATION_ADD_PATH = `${SUPER_ADMIN_BASE}/juice/allocation/create`;
export const JUICE_ALLOCATION_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/juice/allocation/edit/${id}`;
export const JUICE_ALLOCATION_VIEW_PATH = (id) => `${SUPER_ADMIN_BASE}/juice/allocation/view/${id}`;

export const DRIVER_ROUTE_LIST = "driver/route/list";
export const DRIVER_ROUTE_ADD = "driver/route/create";
export const DRIVER_ROUTE_EDIT = "driver/route/edit/:id";

export const DRIVER_ROUTE_LIST_PATH = `${SUPER_ADMIN_BASE}/driver/route/list`;
export const DRIVER_ROUTE_ADD_PATH = `${SUPER_ADMIN_BASE}/driver/route/create`;
export const DRIVER_ROUTE_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/driver/route/edit/${id}`;

export const FINISH_GOOD_LIST = "product/list";
export const FINISH_GOOD_ADD = "product/create";
export const FINISH_GOOD_EDIT = "product/edit/:id";

export const FINISH_GOOD_LIST_PATH = `${SUPER_ADMIN_BASE}/product/list`;
export const FINISH_GOOD_ADD_PATH = `${SUPER_ADMIN_BASE}/product/create`;
export const FINISH_GOOD_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/product/edit/${id}`;

export const RECIPE_LIST = "recipe/list";
export const RECIPE_ADD = "recipe/create";
export const RECIPE_EDIT = "recipe/edit/:id";

export const RECIPE_LIST_PATH = `${SUPER_ADMIN_BASE}/recipe/list`;
export const RECIPE_ADD_PATH = `${SUPER_ADMIN_BASE}/recipe/create`;
export const RECIPE_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/recipe/edit/${id}`;

export const PRODUCTION_LIST = "production/list";
export const PRODUCTION_ADD = "production/create";
export const PRODUCTION_EDIT = "production/edit/:id";
export const PRODUCTION_VIEW = "production/view/:id";

export const PRODUCTION_LIST_PATH = `${SUPER_ADMIN_BASE}/production/list`;
export const PRODUCTION_ADD_PATH = `${SUPER_ADMIN_BASE}/production/create`;
export const PRODUCTION_VIEW_PATH = (id) => `${SUPER_ADMIN_BASE}/production/view/${id}`;
export const PRODUCTION_EDIT_PATH = (id) => `${SUPER_ADMIN_BASE}/production/edit/${id}`;

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

export const BACKUP_PROCESSING_PATH = `${SUPER_ADMIN_BASE}/backup/processing`;
export const LOGIN_HISTORY_PATH = `${SUPER_ADMIN_BASE}/login/history`;


export const LOCAITON_PROFIT_REPORT_PATH = `${SUPER_ADMIN_BASE}/location/profit/report`;
export const DELIVERY_SUMMERY_REPORT_PATH = `${SUPER_ADMIN_BASE}/delivery/summery/report`;

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
      
      { path: FINISH_GOOD_LIST_PATH, element: <ProtectedRoute role="superadmin"><FinishGood /></ProtectedRoute> },
      { path: FINISH_GOOD_ADD_PATH, element: <ProtectedRoute role="superadmin"><FinishGoodCreate /></ProtectedRoute> },
      { path: FINISH_GOOD_EDIT, element: <ProtectedRoute role="superadmin"><FinishGoodEdit /></ProtectedRoute> },


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

      { path: LOCATION_LIST_PATH, element: <ProtectedRoute roles={["superadmin", "jps"]}><LocationList /></ProtectedRoute> },
      { path: LOCATION_ADD_PATH,  element: <ProtectedRoute roles={["superadmin", "jps"]}><LocationCreate /></ProtectedRoute> },
      { path: LOCATION_EDIT,      element: <ProtectedRoute roles={["superadmin", "jps"]}><LocationEdit /></ProtectedRoute> },
      
      { path: DRIVER_ROUTE_LIST_PATH, element: <ProtectedRoute role={["superadmin", "jps"]}><RouteList /></ProtectedRoute> },
      { path: DRIVER_ROUTE_ADD_PATH, element: <ProtectedRoute role={["superadmin", "jps"]}><RouteCreate /></ProtectedRoute> },
      { path: DRIVER_ROUTE_EDIT, element: <ProtectedRoute role={["superadmin", "jps"]}><RouteEdit /></ProtectedRoute> },
      
      { path: JUICE_ALLOCATION_LIST_PATH, element: <ProtectedRoute role={["superadmin", "jps"]}><JuiceAllocationList /></ProtectedRoute> },
      { path: JUICE_ALLOCATION_ADD_PATH, element: <ProtectedRoute role={["superadmin", "jps"]}><JuiceAllocationCreate /></ProtectedRoute> },
      { path: JUICE_ALLOCATION_EDIT, element: <ProtectedRoute role={["superadmin", "jps"]}><JuiceAllocationEdit /></ProtectedRoute> },
      { path: JUICE_ALLOCATION_VIEW, element: <ProtectedRoute role={["superadmin", "jps"]}><JuiceAllocationView /></ProtectedRoute> },
      
      { path: RECIPE_LIST_PATH, element: <ProtectedRoute role="superadmin"><RecipeList /></ProtectedRoute> },
      { path: RECIPE_ADD_PATH, element: <ProtectedRoute role="superadmin"><RecipeCreate /></ProtectedRoute> },
      { path: RECIPE_EDIT, element: <ProtectedRoute role="superadmin"><RecipeEdit /></ProtectedRoute> },
      
      { path: PRODUCTION_LIST_PATH, element: <ProtectedRoute role={["superadmin", "jps"]}><ProductionList /></ProtectedRoute> },
      { path: PRODUCTION_ADD_PATH, element: <ProtectedRoute role={["superadmin", "jps"]}><ProductionCreate /></ProtectedRoute> },
      { path: PRODUCTION_EDIT, element: <ProtectedRoute role={["superadmin", "jps"]}><ProductionEdit /></ProtectedRoute> },
      { path: PRODUCTION_VIEW, element: <ProtectedRoute role={["superadmin", "jps"]}><ProductionView /></ProtectedRoute> },

      { path: BACKUP_PROCESSING_PATH, element: <ProtectedRoute role="superadmin"><BackupProcessing /></ProtectedRoute> },
      { path: LOGIN_HISTORY_PATH, element: <ProtectedRoute role="superadmin"><LoginHistory /></ProtectedRoute> },
      { path: LOCAITON_PROFIT_REPORT_PATH, element: <ProtectedRoute role="superadmin"><LocationProfitReport /></ProtectedRoute> },
      { path: DELIVERY_SUMMERY_REPORT_PATH, element: <ProtectedRoute role="superadmin"><DeliverySummeryReport /></ProtectedRoute> },
    ],
  },
  {
    path: DRIVER_BASE,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: DRIVER_DASHBOARD_PATH, element: <ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute> },
      { path: ASSIGN_TASK_PATH, element: <ProtectedRoute role="driver"><AssignTask /></ProtectedRoute> },
      { path: TASK_DETAILS, element: <ProtectedRoute role="driver"><TaskDetails /></ProtectedRoute> },
      { path: JUICE_ALLOCATION_PATH, element: <ProtectedRoute role="driver"><JuiceAllocation /></ProtectedRoute> },
      { path: DRIVER_REPORT_PATH, element: <ProtectedRoute role="driver"><DriverReport /></ProtectedRoute> },
      { path: RETURN_LEFTOVER_PATH, element: <ProtectedRoute role="driver"><ReturnLeftover /></ProtectedRoute> },
      { path: DRIVER_PROFILE_PATH, element: <ProtectedRoute role="driver"><DriverProfile /></ProtectedRoute> },
      { path: DRIVER_LOCATION_OVERVIEW, element: <ProtectedRoute role="driver"><LocationOverview /></ProtectedRoute> },
      { path: DRIVER_DAILY_COLLECTION, element: <ProtectedRoute role="driver"><DailyCollection /></ProtectedRoute> },
      { path: DRIVER_REPORT_STATS, element: <ProtectedRoute role="driver"><DriverReportStats /></ProtectedRoute> },
      
    ],
  },
  {
    path: STAFF_BASE,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: JPS_DASHBOARD_PATH, element: <ProtectedRoute role="jps"><JpsDashboard /></ProtectedRoute> },
      { path: JPS_REPORT_PATH, element: <ProtectedRoute role="jps"><JpsReport /></ProtectedRoute> },
      
    ],
  },
]);

export default router;