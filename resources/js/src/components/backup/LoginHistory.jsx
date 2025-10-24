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
    Td,
    Box,
    useToast,
} from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DASHBOARD_PATH, INGREDIENT_ADD_PATH, INGREDIENT_EDIT_PATH } from "../../router";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Swal from "sweetalert2";
import { Link as ReactRouterLink } from "react-router-dom";

export default function LoginHistory() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;
    const [pageCount, setPageCount] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();

    // Fetch data whenever page or search changes
    const loginHistory = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/superadmin/login-history", {
                params: {
                    page: pageIndex + 1,
                    per_page: pageSize,
                    search: globalFilter || "",
                },
            });

            const ingredients = res.data?.data?.data || [];
            const total = res.data?.data?.total || ingredients.length;

            // Update table
            setData(ingredients);
            setPageCount(Math.ceil(total / pageSize));
        } catch (err) {
            console.error("loginHistory error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const app_name = localStorage.getItem('app_name');
        document.title = `${app_name} | Login History`;
        loginHistory();
    }, [pageIndex, globalFilter]);


    const columns = [
        { header: "ID", accessorKey: "id"},
        { header: "User",
            accessorFn: row => row.user.name || "", 
        },
        { header: "IP", accessorKey: "ip_address"},
        { header: "Browser", accessorKey: "browser"},
        { header: "Device", accessorKey: "device"},
        { header: "OS", accessorKey: "os"},
        { header: "Timestamp", accessorKey: "logged_in_at"},
    ];

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

            <SimpleGrid columns={{ base: 1, md: 1 }} mt={5}>
                <Card>
                    <CardBody>
                        <TanStackTable
                            columns={columns}
                            data={data}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            setPageIndex={setPageIndex}
                            pageCount={pageCount}
                            isLoading={isLoading}
                            addURL=""
                        />
                    </CardBody>
                </Card>
            </SimpleGrid>
        </>
    );
}
