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
    Badge
} from "@chakra-ui/react";
import { t } from "i18next";
import api from "../../axios";
import { useForm } from "react-hook-form";
import moment from "moment"; 

const DeliverySummeryReport = () => {
    const bg = useColorModeValue("gray.50", "gray.800");
    const cardBg = useColorModeValue("white", "gray.700");
    const [locations, setLocations] = useState([]);
    const [reports, setReports] = useState([]);
    const [tran_locations, setTransactionLocation] = useState([]);
    const { register, handleSubmit, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

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
        onSubmit(); 
    }, []);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await api.post("superadmin/get/delivery/summery/report", data);
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
                {t("profit_report")}
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
                <TableContainer
                    bg={cardBg}
                    p={4}
                    rounded="xl"
                    shadow="md"
                >
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Location</Th>
                                <Th>Total Deliveries</Th>
                                <Th>Total Quantity</Th>
                                <Th>Drivers</Th>
                                <Th>Last Delivery Date</Th>
                                <Th>Paid</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {reports.map((item, index) => (
                                <Tr key={index}>
                                    <Td>{item.location_name}</Td>
                                    <Td>{item.total_deliveries}</Td>
                                    <Td>{item.total_quantity}</Td>
                                    <Td>{item.driver_name}</Td>
                                    <Td>{moment(item.last_delivery_date).format("MMMM Do YYYY, h:mm:ss A")} </Td>
                                    <Td>
                                        <Stack direction='row'>
                                            <Badge variant='solid' colorScheme='green'>
                                                Paid {item.paid_deliveries}
                                            </Badge>
                                            <Badge variant='subtle' colorScheme='red'>
                                                Unpaid {item.unpaid_deliveries}
                                            </Badge>
                                        </Stack>
                                        
                                    </Td>
                                </Tr>
                            )) }
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
            </Card>
        </Box>
    );
};

export default DeliverySummeryReport;
