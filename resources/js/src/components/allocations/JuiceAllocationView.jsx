import {
    Box,
    Button,
    Card,
    CardHeader,
    CardBody,
    Heading,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    HStack,
    useToast,
    Flex,
    Text,
    Divider,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link as ReactRouterLink } from "react-router-dom";
import api from "../../axios";
import { DASHBOARD_PATH, JUICE_ALLOCATION_LIST_PATH, PRODUCTION_LIST_PATH } from "../../router";

const JuiceAllocationView = () => {
    const { t } = useTranslation();
    const toast = useToast();
    const navigate = useNavigate();
    const { id } = useParams(); // ✅ Get production ID from URL

    const [loading, setLoading] = useState(true);
    const [production, setProduction] = useState(null);
    const [items, setItems] = useState([]);

    // ✅ Fetch production details
    const getProduction = async () => {
        try {
            const res = await api.get(`superadmin/driver/juice/allocations/${id}`);
            const data = res.data.data;

            setProduction(data);
            setItems(data.lines || []);
        } catch (err) {
            toast({
                title: t("error"),
                description: err?.response?.data?.message || "Failed to fetch details",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Allocation Details`;
        getProduction();
    }, []);

    if (loading) {
        return (
            <Flex justify="center" align="center" h="60vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!production) {
        return (
            <Flex justify="center" align="center" h="60vh">
                <Text color="red.500">{t("no_data_found")}</Text>
            </Flex>
        );
    }

    return (
        <>
            {/* 🧭 Breadcrumb */}
            <Card mb={5}>
                <CardBody>
                    <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactRouterLink} to={DASHBOARD_PATH}>
                                {t("dashboard")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactRouterLink} to={JUICE_ALLOCATION_LIST_PATH}>
                                {t("allocations")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink>{t("details")}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </CardBody>
            </Card>

            <Box>
                <Card shadow="md" borderRadius="2xl">
                    <CardHeader>
                        <Flex mb={4} justifyContent="space-between" alignItems="center">
                            <Heading size="md">{t("allocation_details")}</Heading>
                            <Button
                                colorScheme="teal"
                                as={ReactRouterLink}
                                to={PRODUCTION_LIST_PATH}
                            >
                                {t("list")}
                            </Button>
                        </Flex>
                    </CardHeader>

                    <CardBody>
                        {/* 🔹 Basic Info */}
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                            <FormControl>
                                <FormLabel>{t("product")}</FormLabel>
                                <Input value={production.product?.name || "-"} isReadOnly />
                            </FormControl>

                            <FormControl>
                                <FormLabel>{t("driver")}</FormLabel>
                                <Input value={production.driver.name || "-"} isReadOnly />
                            </FormControl>

                            <FormControl>
                                <FormLabel>{t("date")}</FormLabel>
                                <Input value={production.allocation_date || "-"} isReadOnly />
                            </FormControl>

                        </SimpleGrid>

                        <Divider my={4} />

                        {/* 🔹 Items Table */}
                        <Heading size="sm" mb={3}>
                            {t("items")}
                        </Heading>

                        {items.length > 0 ? (
                            <Box overflowX="auto">
                                <Table variant="simple" size="sm">
                                    <Thead bg="gray.100">
                                        <Tr>
                                            <Th>#</Th>
                                            <Th>{t("flavour")}</Th>
                                            <Th>{t("bottle_size")}</Th>
                                            <Th isNumeric>{t("quantity")}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {items.map((item, index) => (
                                            <Tr key={item.id}>
                                                <Td>{index + 1}</Td>
                                                <Td>{item.flavour?.name || "-"}</Td>
                                                <Td>{item.bottle?.name || "-"}</Td>
                                                <Td isNumeric>{item.quantity}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : (
                            <Text color="gray.500" mt={3}>
                                {t("no_items_found")}
                            </Text>
                        )}

                    </CardBody>
                </Card>
            </Box>
        </>
    );
};

export default JuiceAllocationView;
