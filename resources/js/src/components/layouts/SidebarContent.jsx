import React from 'react';

import { FcBearish,FcAutomatic, FcBullish, FcGlobe } from "react-icons/fc";
import { Link as RouterLink } from 'react-router-dom';
import {
    Flex,
    Box,
    Text,
    Icon,
    CloseButton,
    useColorModeValue
} from '@chakra-ui/react'

const LinkItems = [
  { name: 'Home', icon: FcBullish, href: '/super/admin/dashboard' },
  { name: 'Settings', icon: FcAutomatic, href: '/super/admin/settings' },
]

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <>
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <Box
          as={RouterLink}
          to={link.href}
          key={link.name}
          _hover={{ bg: 'teal.400', color: 'white' }}
          display="flex"
          alignItems="center"
          p="2"
          mx="4"
          borderRadius="lg"
          cursor="pointer">
          <Icon boxSize={6} as={link.icon} mr="4" />
          {link.name}
        </Box>
      ))}
    </Box>
    </>
  )
}

export default SidebarContent