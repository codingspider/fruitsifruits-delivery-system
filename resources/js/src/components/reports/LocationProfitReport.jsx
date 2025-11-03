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
} from "@chakra-ui/react";
import { t } from "i18next";
import api from "../../axios";
import { useForm } from "react-hook-form";

const LocationProfitReport = () => {
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
    }, []);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await api.post("superadmin/get/profit/report", data);
            setTransactionLocation(res.data.data);
            toast({
                position: "bottom-right",
                title: res.data.message || "Route created successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            reset();
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
            {tran_locations && tran_locations.length > 0 ? (
                tran_locations.map((item, index) => (
                    <Card key={index} mb={6}>
                        <CardHeader fontWeight="bold" fontSize="lg">
                            Location: {item.location} — Total Profit: $
                            {item.total_profit.toFixed(2)}
                        </CardHeader>

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
                                            <Th>Flavor</Th>
                                            <Th isNumeric>Total Quantity</Th>
                                            <Th isNumeric>Price per Unit</Th>
                                            <Th isNumeric>Cost per Bottle</Th>
                                            <Th isNumeric>Net Price</Th>
                                            <Th isNumeric>Deal Quantity</Th>
                                            <Th isNumeric>Deal Cost</Th>
                                            <Th isNumeric>Total Profit</Th>
                                        </Tr>
                                    </Thead>

                                    <Tbody>
                                        {item.flavors &&
                                        item.flavors.length > 0 ? (
                                            item.flavors.map((report, i) => (
                                                <Tr key={i}>
                                                    <Td>{report.flavor}</Td>
                                                    <Td isNumeric>
                                                        {report.total_quantity}
                                                    </Td>
                                                    <Td isNumeric>
                                                        {report.price_per_unit}
                                                    </Td>
                                                    <Td isNumeric>
                                                        {report.cost_per_bottle}
                                                    </Td>
                                                    <Td isNumeric>
                                                        {report.net_price}
                                                    </Td>
                                                    <Td isNumeric>
                                                        {report.deal_quantity}
                                                    </Td>
                                                    <Td isNumeric>
                                                        {report.deal_cost}
                                                    </Td>
                                                    <Td isNumeric>
                                                        {report.total_profit}
                                                    </Td>
                                                </Tr>
                                            ))
                                        ) : (
                                            <Tr>
                                                <Td
                                                    colSpan={8}
                                                    textAlign="center"
                                                    py={6}
                                                >
                                                    No flavors found
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </CardBody>
                    </Card>
                ))
            ) : (
                <Box textAlign="center" py={10}>
                    No locations found
                </Box>
            )}
        </Box>
    );
};

export default LocationProfitReport;
