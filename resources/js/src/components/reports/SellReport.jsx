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
    Stack,
    Badge,

} from "@chakra-ui/react";
import { t } from "i18next";
import api from "../../axios";
import { useForm } from "react-hook-form";
import moment from "moment"; 
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ViewIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import InvoicePrint from "./InvoicePrint";


const SellReport = () => {
    const bg = useColorModeValue("gray.50", "gray.800");
    const cardBg = useColorModeValue("white", "gray.700");
    const [locations, setLocations] = useState([]);
    const [reports, setReports] = useState([]);
    const [tran_locations, setTransactionLocation] = useState([]);
    const { register, handleSubmit, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const componentRef = useRef(null);

    const [printId, setPrintId] = useState(null);
    const [printMode, setPrintMode] = useState("A4");

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
        document.title = `${app_name} | Sell Report`;
        getLocations();
        onSubmit(); 
    }, []);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await api.post("superadmin/get/sell/report", data);
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

    return (
        <Box p={6} bg={bg} minH="100vh">
            <Heading size="md" mb={4}>
                {t("sell_report")}
            </Heading>

            {/* Filter Form */}
            <Box bg={cardBg} p={6} rounded="xl" shadow="md" mb={8}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                        gap={4}
                    >
                        {/* Location */}
                        <GridItem>
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
                        </GridItem>

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
            <Card>
                <CardBody>
                <TableContainer p={4}>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Location</Th>
                                <Th>Ref.No</Th>
                                <Th>Date</Th>
                                <Th>Amount</Th>
                                <Th>Notes</Th>
                                <Th>Payment Status</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {reports.map((item, index) => (
                                <Tr key={index}>
                                    <Td>{item.location.name}</Td>
                                    <Td>{item.reference_no}</Td>
                                    <Td>{moment(item.created_at).format("MMMM Do YYYY")} </Td>
                                    <Td>{item.total_amount}</Td>
                                    <Td>{item.notes}</Td>
                                    <Td>{item.status}</Td>
                                    <Td>
                                        
                                        <Stack>
                                            <Button 
                                                colorScheme="blue"
                                                size="sm"
                                                onClick={() => {
                                                    setPrintId(item.id);
                                                    setPrintMode("A4"); 
                                                }}
                                            >
                                                Print A4
                                            </Button>

                                            <Button 
                                                colorScheme="green"
                                                size="sm"
                                                onClick={() => {
                                                    setPrintId(item.id);
                                                    setPrintMode("THERMAL");
                                                }}
                                            >
                                                Print Thermal
                                            </Button>
                                        </Stack>
                                    </Td>
                                </Tr>
                            )) }
                        </Tbody>
                    </Table>
                </TableContainer>
                {printId && (
                    <InvoicePrint
                        id={printId}
                        mode={printMode}
                        onClose={() => setPrintId(null)}
                    />
                )}
            </CardBody>
            </Card>
        </Box>
    );
};

export default SellReport;
