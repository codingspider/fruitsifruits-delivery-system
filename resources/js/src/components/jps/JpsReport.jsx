import React, { useEffect, useState } from "react";
import api from "../../axios";
import TanStackTable from "../../TanStackTable";
import {
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    SimpleGrid,
    Box,
    useToast,
    Grid,
    GridItem,
    FormControl,
    FormLabel,
    Input,
    Button,
    useColorModeValue
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DASHBOARD_PATH, ASSIGN_TASK_PATH } from "../../router";
import { Link as ReactRouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function JpsReport() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;
    const [pageCount, setPageCount] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { t } = useTranslation();
    const toast = useToast();
    const { register, handleSubmit } = useForm();
    const cardBg = useColorModeValue("white", "gray.700");

    /** ================================
     *  FETCH REPORT DATA
     =================================*/
    const onSubmit = async (formData = {}) => {
        setIsLoading(true);
        setIsSubmitting(true);

        try {
            const res = await api.post("jps/get/reports", formData);
            setData(res.data.data || []); // ensure array
        } catch (err) {
            const errorResponse = err?.response?.data;
            toast({
                position: "bottom-right",
                title: "Error",
                description: errorResponse?.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    };

    /** ================================
     *  LOAD ON FIRST RENDER (default report)
     =================================*/
    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Report`;
        onSubmit({});
    }, []);

    /** ================================
     *  TABLE COLUMNS (MATCH API KEYS)
     =================================*/
    const columns = [
        { header: "Flavour", accessorKey: "flavour_name" },
        { header: "Bottle Size", accessorKey: "bottle_name" },
        { header: "Produced", accessorKey: "produced_qty" },
        { header: "Allocated", accessorKey: "allowcated_qty" }, // Your API key
        { header: "Delivered", accessorKey: "delivered_qty" },
        { header: "Returned", accessorKey: "returned_qty" },
        { header: "Remaining Stock", accessorKey: "remaining_stock" },
    ];

    return (
        <>
            {/* Breadcrumb */}
            <Card mb={5}>
                <CardBody>
                    <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactRouterLink} to={DASHBOARD_PATH}>
                                {t("dashboard")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink as={ReactRouterLink} to={ASSIGN_TASK_PATH}>
                                {t("list")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </CardBody>
            </Card>

            {/* Filter Form */}
            <Box bg={cardBg} p={6} rounded="xl" shadow="md" mb={8}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
                        {/* Start Date */}
                        <GridItem>
                            <FormControl>
                                <FormLabel>Start Date</FormLabel>
                                <Input type="date" {...register("start_date")} />
                            </FormControl>
                        </GridItem>

                        {/* End Date */}
                        <GridItem>
                            <FormControl>
                                <FormLabel>End Date</FormLabel>
                                <Input type="date" {...register("end_date")} />
                            </FormControl>
                        </GridItem>

                        {/* Filter Button */}
                        <GridItem display="flex" alignItems="end">
                            <Button colorScheme="blue" w="full" type="submit" isLoading={isSubmitting}>
                                Filter
                            </Button>
                        </GridItem>
                    </Grid>
                </form>
            </Box>

            {/* Table */}
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
                            hideAddBtn="true"
                        />
                    </CardBody>
                </Card>
            </SimpleGrid>
        </>
    );
}
