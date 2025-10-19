import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";
import { Button, Link as ChakraLink } from "@chakra-ui/react";

import {
    Box,
    Flex,
    IconButton,
    Avatar,
    HStack,
    VStack,
    Text,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    useColorModeValue,
    Select,
    useColorMode,
} from "@chakra-ui/react";
import { FcGlobe } from "react-icons/fc";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { logoutUser } from "../../services/authService";
import { LanguageContext } from "../../LanguageProvider";

const TopNav = ({ onOpen, ...rest }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { lang, changeLanguage } = useContext(LanguageContext);
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logoutUser(navigate);
    };
    return (
        <>
            <Flex
                ml={{ base: 0, md: 60 }}
                px="4"
                height="20"
                alignItems="center"
                bg={useColorModeValue("white", "gray.900")}
                borderBottomWidth="1px"
                borderBottomColor={useColorModeValue("gray.200", "gray.700")}
                justifyContent="space-between"
                {...rest}
            >
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onOpen}
                    variant="outline"
                    aria-label="open menu"
                    icon={<FiMenu />}
                />
                <Text fontSize="lg" fontWeight="bold">
                    Dashboard
                </Text>

                <HStack spacing="4">
                    <Box p={5}>
                        <IconButton
                            aria-label="Toggle color mode"
                            icon={
                                colorMode === "light" ? (
                                    <MoonIcon />
                                ) : (
                                    <SunIcon />
                                )
                            }
                            onClick={toggleColorMode}
                        />
                    </Box>
                    <Select
                        value={lang}
                        mr={3}
                        display={{ base: "none", md: "block" }}
                        onChange={(e) => changeLanguage(e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="bn">বাংলা</option>
                    </Select>

                    <IconButton
                        size="lg"
                        variant="ghost"
                        w="40px"
                        h="40px"
                        icon={<FcGlobe />}
                    />
                    <Menu>
                        <MenuButton>
                            <HStack>
                                <Avatar
                                    size="sm"
                                    src="https://i.pravatar.cc/40"
                                />
                                <VStack
                                    display={{ base: "none", md: "flex" }}
                                    align="flex-start"
                                    spacing="0"
                                    ml="2"
                                >
                                    <Text fontSize="sm">John Doe</Text>
                                    <Text fontSize="xs" color="gray.500">
                                        Admin
                                    </Text>
                                </VStack>
                                <FiChevronDown />
                            </HStack>
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </>
    );
};

export default TopNav;
