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
  FcReadingEbook,
  FcAddDatabase,
  FcMindMap,
  FcManager,
  FcConferenceCall,
  FcHeatMap,
  FcTimeline
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
  
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { USER_LIST_PATH } from '../../router';

const SidebarContent = ({ onClose, ...rest }) => {
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

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const storedAppName = localStorage.getItem("app_name");
    if (storedAppName) {
      setAppName(storedAppName);
    }
  }, []);

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

      {/* ----- Static links ----- */}
      <NavLink to="/super/admin/dashboard" icon={FcHome} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/dashboard')} label={t('dashboard')} />
      <NavLink to="/super/admin/pos"      icon={FcPositiveDynamic  } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/pos')} label={t('juice_production')} />
      <NavLink to="/super/admin/pos"      icon={FcShop} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/pos')} label={t('driver_allocation')} />
      <NavLink to='/super/admin/save/order'  icon={FcList} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/save/order')} label={t('manage_route')} />
      <NavLink to="/super/admin/order-status" icon={FcHeatMap } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/order-status')} label={t('manage_locations')} />
      <NavLink to="/super/admin/order-status" icon={FcTimeline  } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/order-status')} label={t('manage_ingredients')} />

      {/* ----- Dropdown: user management ----- */}
      <DropdownHeader
        label={t('user_management')}
        icon={FcManager}
        isOpen={open.user || location.pathname.startsWith('/super/admin/user/list')}
        onToggle={() => toggle('user')}
        hoverBg={hoverBg}
      />
      <Collapse in={open.user || location.pathname.startsWith('/super/admin/user/list')} animateOpacity>
        <Box ml="8" mt="1"  borderRadius="md">
          <NavLink to={USER_LIST_PATH}         icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive(USER_LIST_PATH)}         label={t('user_list')} small />
          <NavLink to="/super/admin/expense"         icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/expense')}         label={t('staff_list')} small />
          <NavLink to="/super/admin/expense/create"  icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/expense/create')}  label={t('add_staff')}  small />
        </Box>
      </Collapse>

      {/* ----- Dropdown: Expense ----- */}
      <DropdownHeader
        label={t('expense')}
        icon={FcMoneyTransfer}
        isOpen={open.expense || location.pathname.startsWith('/super/admin/expense')}
        onToggle={() => toggle('expense')}
        hoverBg={hoverBg}
      />
      <Collapse in={open.expense || location.pathname.startsWith('/super/admin/expense')} animateOpacity>
        <Box ml="8" mt="1"  borderRadius="md">
          <NavLink to="/super/admin/expense"         icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/expense')}         label={t('expense_head')} small />
          <NavLink to="/super/admin/expense"         icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/expense')}         label={t('all_expense')} small />
          <NavLink to="/super/admin/expense/create"  icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/expense/create')}  label={t('add_expense')}  small />
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
      
      {/* ----- Dropdown: delivery boy ----- */}
      <DropdownHeader
        label={t('delivery_boy')}
        icon={FcShipped}
        isOpen={open.delivery || location.pathname.startsWith('/super/admin/delivery/boy')}
        onToggle={() => toggle('delivery')}
        hoverBg={hoverBg}
      />
      <Collapse in={open.delivery || location.pathname.startsWith('/super/admin/delivery/boy')} animateOpacity>
        <Box ml="8" mt="1"  borderRadius="md">
          <NavLink to="/super/admin/tools/import" icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/tools/import')} label="Import/Export" small />
          <NavLink to="/super/admin/tools/logs"   icon={null} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/tools/logs')}   label="System Logs"   small />
        </Box>
      </Collapse>
      

      <NavLink to="/super/admin/settings" icon={FcSettings} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/settings')} label="Settings" />
      <NavLink to="/super/admin/backup" icon={FcAddDatabase } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/backup')} label={t('backup')} />
      <NavLink to="/super/admin/login/history" icon={FcMindMap } activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/login/history')} label={ t('login_history') } />
      <NavLink to="/super/admin/logout" icon={FcAdvance} activeBg={activeBg} activeColor={activeColor} hoverBg={hoverBg} active={isActive('/super/admin/logout')} label="Logout" />
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
