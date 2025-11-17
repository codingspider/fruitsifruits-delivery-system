import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    GridItem,
    FormControl,
    FormLabel,
    Select,
    Input,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Heading,
    Flex,
    useToast,
    useColorModeValue,
    Card,
    CardHeader,
    CardBody,
    Tfoot,
} from "@chakra-ui/react";
import { t } from "i18next";
import api from "../../axios";
import { useForm } from "react-hook-form";
import { useCurrencyFormatter } from "../../useCurrencyFormatter";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const LocationProfitReport = () => {
    const bg = useColorModeValue("gray.50", "gray.800");
    const cardBg = useColorModeValue("white", "gray.700");
    const [locations, setLocations] = useState([]);
    const [reports, setReports] = useState([]);
    const [tran_locations, setTransactionLocation] = useState([]);
    const { register, handleSubmit, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const { formatAmount, currency } = useCurrencyFormatter();

    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "Report",
    });

    // Fetch locations
    const getLocations = async () => {
        try {
            const res = await api.get("superadmin/locations");
            setLocations(res.data?.data?.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const app_name = localStorage.getItem("app_name") || "App";
        document.title = `${app_name} | Location Profit Report`;
        getLocations();
    }, []);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await api.post("superadmin/get/profit/report", data);
            console.log(res.data.data);
            setReports(res.data.data);
        } catch (err) {
            const errorResponse = err?.response?.data;
            if (errorResponse?.errors) {
                const errorMessage = Object.values(errorResponse.errors)
                    .flat()
                    .join(" ");
                toast({
                    position: "bottom-right",
                    title: "Error",
                    description: errorMessage,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } else if (errorResponse?.message) {
                toast({
                    position: "bottom-right",
                    title: "Error",
                    description: errorResponse.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const totals = reports?.reduce(
        (acc, row) => {
            acc.totalQuantity += Number(row.total_quantity);
            acc.totalNetPrice += Number(row.net_price);
            acc.totalProfit += Number(row.total_profit);
            return acc;
        },
        {
            totalQuantity: 0,
            totalNetPrice: 0,
            totalProfit: 0,
        }
    );

    return (
        <Box p={6} bg={bg} minH="100vh">
            <Heading size="md" mb={4}>
                {t("profit_report")}
            </Heading>
            <style>
                {`
                @media print {
                    button {
                    display: none;
                    }
                    table {
                    width: 100% !important;
                    border-collapse: collapse;
                    }
                    th, td {
                    border: 1px solid #ccc !important;
                    padding: 8px !important;
                    }
                }
                `}
            </style>

            {/* Filter Form */}
            <Box bg={cardBg} p={6} rounded="xl" shadow="md" mb={8}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                        gap={4}
                    >
                        {/* Location */}
                        {/* <GridItem>
                            <FormControl>
                                <FormLabel>Select Location</FormLabel>
                                <Select
                                    placeholder="All Locations"
                                    {...register("location_id")}
                                >
                                    {locations.map((location) => (
                                        <option
                                            key={location.id}
                                            value={location.id}
                                        >
                                            {location.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem> */}

                        {/* Start Date */}
                        <GridItem>
                            <FormControl>
                                <FormLabel>Start Date</FormLabel>
                                <Input
                                    type="date"
                                    {...register("start_date")}
                                />
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
                            <Button colorScheme="blue" w="full" type="submit">
                                Filter
                            </Button>
                        </GridItem>
                    </Grid>
                </form>
            </Box>

            {/* Data Table */}
            <Card mb={6}>
                <CardBody>
                    <Button colorScheme="blue" onClick={handlePrint}>
                        Print Report
                    </Button>
                    {/* Wrap the printable table in a plain div with ref */}
                    <div ref={componentRef}>
                        <TableContainer p={4} >
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Flavor</Th>
                                        <Th isNumeric>Total Quantity</Th>
                                        <Th isNumeric>Price per Unit</Th>
                                        <Th isNumeric>Cost per Bottle</Th>
                                        <Th isNumeric>Net Price</Th>
                                        <Th isNumeric>Total Profit</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {reports && reports.length > 0 ? (
                                        reports.map((report, i) => (
                                            <Tr key={i}>
                                                <Td>{report.flavor}</Td>
                                                <Td isNumeric>{report.total_quantity}</Td>
                                                <Td isNumeric>{formatAmount(report.price_per_unit)}</Td>
                                                <Td isNumeric>{formatAmount(report.cost_per_bottle)}</Td>
                                                <Td isNumeric>{formatAmount(report.net_price)}</Td>
                                                <Td isNumeric>{formatAmount(report.total_profit)}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan={6} textAlign="center" py={6}>
                                                No flavors found
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>

                                <Tfoot>
                                    <Tr>
                                        <Td colSpan={5} textAlign="right" fontWeight="bold">
                                            Total Profit
                                        </Td>
                                        <Td textAlign="right" fontWeight="bold">
                                            {formatAmount(totals.totalProfit)}
                                        </Td>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        </TableContainer>
                    </div>
                </CardBody>
            </Card>
        </Box>
    );
};

export default LocationProfitReport;
