import React, { useState, useEffect, useRef } from 'react';
import {
  FcHome,
  FcSettings,
  FcShop,
  FcList,
  FcOk,
  FcMoneyTransfer,
  FcServices,
  FcCurrencyExchange,
  FcBarChart,
  FcPositiveDynamic,
  FcAdvance,
  FcShipped,
  FcFilledFilter,
  FcAddDatabase,
  FcMindMap,
  FcManager,
  FcHeatMap,
  FcTimeline,
  FcMultipleInputs,
  FcFactory,
  FcDatabase,
  FcFlowChart,
  FcUndo,
  FcBusinessman
} from 'react-icons/fc';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Icon,
  CloseButton,
  Collapse,
  useColorModeValue,
  Button
} from '@chakra-ui/react';
import { BiBox } from "react-icons/bi";
import { useTranslation } from 'react-i18next';
import { BACKUP_PROCESSING_PATH, DRIVER_ROUTE_LIST_PATH, FINISH_GOOD_LIST_PATH, FLAVOUR_LIST_PATH, INGREDIENT_LIST_PATH, JUICE_ALLOCATION_LIST_PATH, LOCATION_LIST_PATH, LOGIN_HISTORY_PATH, PRODUCTION_LIST_PATH, PURCHASE_LIST_PATH, RECIPE_LIST_PATH, USER_LIST_PATH, BOTTLE_LIST_PATH, ASSIGN_TASK_PATH, DRIVER_DASHBOARD_PATH, JUICE_ALLOCATION_PATH, DRIVER_REPORT_PATH, RETURN_LEFTOVER_PATH, DRIVER_PROFILE_PATH } from '../../router';
import api from '../../axios';
import { logoutUser } from '../../services/authService';
import { useNavigate } from "react-router-dom";

const SidebarContent = ({ onClose, ...rest }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [appName, setAppName] = useState("");
  const [open, setOpen] = useState({
    expense: false,
    services: false,
    payments: false,
    reports: false,
    tools: false,
  });
  const location = useLocation();

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const sidebarBg   = useColorModeValue('white', 'gray.900');
  const activeBg    = useColorModeValue('teal.500', 'teal.700');
  const activeColor = 'white';
  const hoverBg     = useColorModeValue('teal.400', 'teal.600');
  const subBg       = useColorModeValue('gray.50', 'gray.800');
  const role = localStorage.getItem('role');

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const storedAppName = localStorage.getItem("app_name");
    if (storedAppName) {
      setAppName(storedAppName);
    }
  }, []);

  const handleLogout = async () => {
      await logoutUser(navigate);
  };

  return (
    <Box
      bg={sidebarBg}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="100vh"
      overflowY="auto" 
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">{appName ? appName : "Fruits"}</Text>
        <CloseButton
          size="sm"
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
        />
      </Flex>

      {role === 'superadmin' && (

      <>
      
      {/* ----- Static links ----- */}
      <NavLink to="/super/admin/dashboard" icon={FcHome} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/dashboard')} label={t('dashboard')} />
      <NavLink to={JUICE_ALLOCATION_LIST_PATH}      icon={FcShop} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(JUICE_ALLOCATION_LIST_PATH)} label={t('driver_allocation')} />
      <NavLink to={DRIVER_ROUTE_LIST_PATH}  icon={FcList} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(DRIVER_ROUTE_LIST_PATH)} label={t('manage_route')} />
      <NavLink to={LOCATION_LIST_PATH} icon={FcHeatMap } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(LOCATION_LIST_PATH)} label={t('manage_locations')} />
      <NavLink to={INGREDIENT_LIST_PATH} icon={FcTimeline } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(INGREDIENT_LIST_PATH)} label={t('manage_ingredients')} />
      <NavLink to={BOTTLE_LIST_PATH} icon={BiBox } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(BOTTLE_LIST_PATH)} label={t('manage_bottle')} />
      
      <NavLink to={FINISH_GOOD_LIST_PATH} icon={FcOk } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(FINISH_GOOD_LIST_PATH)} label={t('products')} />
      {/* <NavLink to={RECIPE_LIST_PATH} icon={FcMultipleInputs } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(RECIPE_LIST_PATH)} label={t('recipe')} /> */}
      <NavLink to={PRODUCTION_LIST_PATH} icon={FcFactory } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(PRODUCTION_LIST_PATH)} label={t('juice_production')} />
      
      <NavLink to={FLAVOUR_LIST_PATH} icon={FcFilledFilter } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(FLAVOUR_LIST_PATH)} label={t('manage_flavour')} />
      <NavLink to={PURCHASE_LIST_PATH} icon={FcMoneyTransfer } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(PURCHASE_LIST_PATH)} label={t('purchase')} />

      {/* ----- Dropdown: user management ----- */}
      <DropdownHeader
        label={t('user_management')}
        icon={FcManager}
        isOpen={open.user || location.pathname.startsWith(USER_LIST_PATH)}
        onToggle={() => toggle('user')}
        hoverBg={hoverBg}
      />

      <Collapse in={open.user || location.pathname.startsWith(USER_LIST_PATH)} animateOpacity>
        <Box ml="8" mt="1"  borderRadius="md">
          <NavLink to={USER_LIST_PATH}         icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(USER_LIST_PATH)}         label={t('user_list')} small />
        </Box>
      </Collapse>

      {/* ----- Dropdown: delivery boy ----- */}
      <DropdownHeader
        label={t('driver_manage')}
        icon={FcShipped}
        isOpen={open.delivery || location.pathname.startsWith('/super/admin/driver/list')}
        onToggle={() => toggle('delivery')}
        hoverBg={hoverBg}
      />
      <Collapse in={open.delivery || location.pathname.startsWith('/super/admin/driver/list')} animateOpacity>
        <Box ml="8" mt="1"  borderRadius="md">
          <NavLink to="/super/admin/driver/list" icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/driver/list')} label={t('driver_list')} small />
        </Box>
      </Collapse>

      {/* ----- Dropdown: Reports ----- */}
      <DropdownHeader
        label={t('reports')}
        icon={FcBarChart}
        isOpen={open.reports || location.pathname.startsWith('/super/admin/reports')}
        onToggle={() => toggle('reports')}
        hoverBg={hoverBg}
      />
      <Collapse in={open.reports || location.pathname.startsWith('/super/admin/reports')} animateOpacity>
        <Box ml="8" mt="1"  borderRadius="md">
          <NavLink to="/super/admin/reports/sales"    icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/reports/sales')}    label={t('sales_report')}   small />
          <NavLink to="/super/admin/reports/expense"  icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/reports/expense')}  label={t('expense_report')} small />
        </Box>
      </Collapse>
      
      <NavLink to="/super/admin/settings" icon={FcSettings} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/settings')} label="Settings" />
      <NavLink to={BACKUP_PROCESSING_PATH} icon={FcAddDatabase } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(BACKUP_PROCESSING_PATH)} label={t('backup')} />
      <NavLink to={LOGIN_HISTORY_PATH} icon={FcMindMap } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(LOGIN_HISTORY_PATH)} label={ t('login_history') } />
      </>
      )}

      {role === 'driver' && ( 
        <>
        <NavLink to={DRIVER_DASHBOARD_PATH} icon={FcHome } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(DRIVER_DASHBOARD_PATH)} label={ t('dashboard') } />
        <NavLink to={ASSIGN_TASK_PATH} icon={FcList } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(ASSIGN_TASK_PATH)} label={ t('assign_task') } />
        <NavLink to={JUICE_ALLOCATION_PATH} icon={FcFlowChart } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(JUICE_ALLOCATION_PATH)} label={ t('juice_allocation') } />
        <NavLink to={DRIVER_REPORT_PATH} icon={FcBarChart } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(DRIVER_REPORT_PATH)} label={ t('report') } />
        <NavLink to={RETURN_LEFTOVER_PATH} icon={FcUndo } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(RETURN_LEFTOVER_PATH)} label={ t('return_leftover') } />
        <NavLink to={DRIVER_PROFILE_PATH} icon={FcBusinessman } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(DRIVER_PROFILE_PATH)} label={ t('driver_profile') } />
        </>
      )}
      <Flex
        align="center"
        px={6}
        py={2}
        cursor="pointer"
        onClick={handleLogout}
      >
        <FcAdvance style={{ marginRight: "20px" }} />
        Logout
      </Flex>

    </Box>
  );
};

export default SidebarContent;

/* ---------- Helpers without .map() ---------- */

const NavLink = ({ to, icon, label, active, activeBg, activeColor, hoverBg, small }) => (
  <Box
    mt={2}
    as={RouterLink}
    to={to}
    display="flex"
    alignItems="center"
    p={small ? '2' : '2'}
    pl={small ? '4' : '2'}
    mx="4"
    borderRadius="lg"
    fontSize={small ? 'sm' : 'md'}
    fontWeight="medium"
    bg={active ? activeBg : 'transparent'}
    color={active ? activeColor : 'inherit'}
    _hover={{ bg: hoverBg, color: 'white' }}
  >
    {icon && <Icon boxSize={6} as={icon} mr="4" />}
    {label}
  </Box>
);

const DropdownHeader = ({ label, icon, isOpen, onToggle, hoverBg }) => (
  <Box
    mt={2}
    display="flex"
    alignItems="center"
    p="2"
    mx="4"
    borderRadius="lg"
    cursor="pointer"
    fontWeight="medium"
    _hover={{ bg: hoverBg, color: 'white' }}
    onClick={onToggle}
  >
    <Icon boxSize={6} as={icon} mr="4" />
    {label}
  </Box>
);
