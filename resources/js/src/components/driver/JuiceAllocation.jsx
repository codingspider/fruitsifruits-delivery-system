import React, { useEffect, useState } from "react";
import api from "../../axios";
import TanStackTable from "../../TanStackTable";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    SimpleGrid,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
    useToast,
    CardHeader,
    Flex,
    Heading,
    Button,
    FormControl,
    FormLabel,
    Input,
    Divider,
    Text

    
} from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DASHBOARD_PATH, DRIVER_EDIT_PATH } from "../../router";
import { EditIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink } from "react-router-dom";
import moment from "moment";

export default function JuiceAllocation() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;
    const [pageCount, setPageCount] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Fetch data whenever page or search changes
    const fetchJuiceAllocations = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/driver/allocated/juice");
            console.log(res.data.data);
            setData(res.data.data);
        } catch (err) {
            console.error("fetchJuiceAllocations error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const app_name = localStorage.getItem('app_name');
        document.title = `${app_name} | Juice Allocation`;
        fetchJuiceAllocations();
    }, [pageIndex, globalFilter]);


    return (
        <>
            {/* Breadcrumb */}
            <Card mb={5}>
                <CardBody>
                    <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                as={ReactRouterLink}
                                to={DASHBOARD_PATH}
                            >
                                {t("dashboard")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </CardBody>
            </Card>

            <Box>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <Card key={index} shadow="md" borderRadius="2xl" mb={6}>
                            <CardBody>
                                {/* 🔹 Basic Info */}
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                                    <FormControl>
                                        <FormLabel>{t("product")}</FormLabel>
                                        <Input value={item.product?.name || "-"} isReadOnly />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>{t("date")}</FormLabel>
                                        <Input value={item.allocation_date || "-"} isReadOnly />
                                    </FormControl>
                                </SimpleGrid>

                                <Divider my={4} />

                                {/* 🔹 Items Table */}
                                <Heading size="sm" mb={3}>
                                    {t("items")}
                                </Heading>

                                {item.lines?.length > 0 ? (
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
                                                {item.lines.map((line, idx) => (
                                                    <Tr key={line.id || idx}>
                                                        <Td>{idx + 1}</Td>
                                                        <Td>{line.flavour?.name || "-"}</Td>
                                                        <Td>{line.bottle?.name || "-"}</Td>
                                                        <Td isNumeric>{line.quantity}</Td>
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
                    ))
                ) : (
                    <Text color="gray.500" mt={3}>
                        {t("no_items_found")}
                    </Text>
                )}
            </Box>


        </>
    );
}
