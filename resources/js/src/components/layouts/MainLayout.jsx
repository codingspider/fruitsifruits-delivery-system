import React from 'react';
import {useColorModeValue, useDisclosure, Box, Drawer, DrawerContent} from '@chakra-ui/react';
import SidebarContent from './SidebarContent';
import TopNav from './TopNav';
import { Outlet } from "react-router-dom";

const MainLayout = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            {/* Sidebar */}
            <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer autoFocus={false} isOpen={isOpen} placement="left" onClose={onClose} size="full">
                <DrawerContent>
                <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>

            {/* Top Navbar */}
            <TopNav onOpen={onOpen} />

            {/* Page Content */}
            <Box ml={{ base: 0, md: 60 }} p="6">
                <Outlet></Outlet>
            </Box>
        </Box>
    </>
  )
}

export default MainLayout