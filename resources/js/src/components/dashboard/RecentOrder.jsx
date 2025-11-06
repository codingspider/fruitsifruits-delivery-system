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
import { DASHBOARD_PATH, FLAVOUR_ADD_PATH, FLAVOUR_EDIT_PATH } from "../../router";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Swal from "sweetalert2";
import { Link as ReactRouterLink } from "react-router-dom";

export default function RecentOrder() {
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
    const fetchFlavours = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/superadmin/get/recent/productions", {
                params: {
                    page: pageIndex + 1,
                    per_page: pageSize,
                    search: globalFilter || "",
                },
            });

            const bottles = res.data?.data || [];
            const total = res.data?.data?.total || bottles.length;
            setData(bottles);
            setPageCount(Math.ceil(total / pageSize));
        } catch (err) {
            console.error("fetchFlavours error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchFlavours();
    }, [pageIndex, globalFilter]);

    const columns = [
        { header: "Ref.No", accessorKey: "ref_no"},
        { header: "Quantity", accessorKey: "quantity"},
        { header: "Date", accessorKey: "mfg_date"},
    ];

    return (
        <>
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
                            addURL={FLAVOUR_ADD_PATH}
                            hideAddBtn="true"
                        />
                    </CardBody>
                </Card>
            </SimpleGrid>
        </>
    );
}
