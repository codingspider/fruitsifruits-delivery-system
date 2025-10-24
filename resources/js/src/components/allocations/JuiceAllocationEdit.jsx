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
    Select,
    Divider,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    HStack,
    useToast,
    Flex,
    VStack,
} from "@chakra-ui/react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useNavigate, Link as ReactRouterLink, useParams } from "react-router-dom";
import api from "../../axios";
import { DASHBOARD_PATH, JUICE_ALLOCATION_LIST_PATH } from "../../router";

const JuiceAllocationEdit = () => {
    const { handleSubmit, reset } = useForm();
    const { t } = useTranslation();
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [flavours, setFlavours] = useState([]);
    const [products, setProducts] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [bottles, setBottles] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();

    // ✅ Each production item
    const [items, setItems] = useState([
        { flavour_id: "", bottle_id: "", quantity: 1 },
    ]);

    // ✅ Form data
    const [form, setForm] = useState({
        product_id: "",
        driver_id: "",
        allocation_date: "",
    });

    // ➕ Add new product row
    const addItem = () => {
        setItems([...items, { flavour_id: "", bottle_id: "", quantity: 1 }]);
    };

    // ❌ Remove product row
    const removeItem = (index) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
    };

    // 🧠 Handle item field change
    const handleChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    // 📨 Submit form
    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                product_id: form.product_id,
                driver_id: form.driver_id,
                allocation_date: form.allocation_date,
                lines: items.map((item) => ({
                    flavour_id: item.flavour_id,
                    bottle_id: item.bottle_id,
                    quantity: item.quantity,
                })),
            };
            const res = await api.put(`superadmin/driver/juice/allocations/${id}`, payload);
            reset();
            toast({
                position: "bottom-right",
                title: res.data.message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate(JUICE_ALLOCATION_LIST_PATH);
        } catch (err) {
            const errorResponse = err?.response?.data;
            const errorMessage =
                errorResponse?.errors
                    ? Object.values(errorResponse.errors).flat().join(" ")
                    : errorResponse?.message || "Something went wrong";
            toast({
                position: "bottom-right",
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 📦 Fetch all needed data
    const getFlavours = async () => {
        const res = await api.get("superadmin/flavours");
        setFlavours(res.data.data.data);
    };

    const getProducts = async () => {
        const res = await api.get("superadmin/get/finished/goods");
        setProducts(res.data.data.data);
    };
    
    const getBottles = async () => {
        const res = await api.get("superadmin/get/bottles");
        setBottles(res.data.data.data);
    };

    const getDrivers = async () => {
        const res = await api.get("superadmin/drivers");
        setDrivers(res.data.data.data);
    };

    // 🧾 Fetch existing recipe to edit
    const getAllocation = async () => {
        const res = await api.get(`superadmin/driver/juice/allocations/${id}`);
        const allocation = res.data.data;

        // Map API data to local form shape
        setForm({
            product_id: allocation.product_id ?? "",
            driver_id: allocation.driver_id ?? "",
            allocation_date: allocation.allocation_date ?? "",
        });

        setItems(
            allocation.lines.map((line) => ({
                bottle_id: line.bottle_id,
                flavour_id: line.flavour_id,
                quantity: line.quantity,
            }))
        );
    };

    // ⚡ Load on mount
    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Production Create`;
        getFlavours();
        getProducts();
        getDrivers();
        getBottles();
        getAllocation();
    }, []);

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
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink as={ReactRouterLink} to={JUICE_ALLOCATION_LIST_PATH}>
                                {t("list")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </CardBody>
            </Card>

            <Box>
                <Card shadow="md" borderRadius="2xl">
                    <CardHeader>
                        <Flex mb={4} justifyContent="space-between">
                            <Heading size="md">{t("edit_driver_allocation")}</Heading>
                            <Button
                                colorScheme="teal"
                                as={ReactRouterLink}
                                to={JUICE_ALLOCATION_LIST_PATH}
                                display={{ base: "none", md: "inline-flex" }}
                                px={4}
                                py={2}
                            >
                                {t("list")}
                            </Button>
                        </Flex>
                    </CardHeader>

                    <CardBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                {/* Product */}
                                <FormControl isRequired>
                                    <FormLabel>{t("product")}</FormLabel>
                                    <Select
                                        placeholder="Select Product"
                                        value={form.product_id}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                product_id: e.target.value,
                                            }))
                                        }
                                    >
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Location */}
                                <FormControl isRequired>
                                    <FormLabel>{t("driver")}</FormLabel>
                                    <Select
                                        placeholder="Select"
                                        value={form.driver_id}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                driver_id: e.target.value,
                                            }))
                                        }
                                    >
                                        {drivers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Date */}
                                <FormControl isRequired>
                                    <FormLabel>{t("date")}</FormLabel>
                                    <Input
                                        type="date"
                                        value={form.allocation_date}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                allocation_date: e.target.value,
                                            }))
                                        }
                                    />
                                </FormControl>
                            </SimpleGrid>

                            {/* Flavour rows */}
                            <VStack spacing={4} align="stretch" mt={6}>
                                {items.map((item, index) => (
                                    <Box key={index} p={4} borderWidth={1} borderRadius="md">
                                        <HStack spacing={4}>
                                            <FormControl>
                                                <FormLabel>{t("flavour")}</FormLabel>
                                                <Select
                                                    placeholder="Select"
                                                    value={item.flavour_id}
                                                    onChange={(e) =>
                                                        handleChange(index, "flavour_id", e.target.value)
                                                    }
                                                >
                                                    {flavours.map((flavour) => (
                                                        <option key={flavour.id} value={flavour.id}>
                                                            {flavour.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>{t("bottle")}</FormLabel>
                                                <Select
                                                    placeholder="Select"
                                                    value={item.bottle_id}
                                                    onChange={(e) =>
                                                        handleChange(index, "bottle_id", e.target.value)
                                                    }
                                                >
                                                    {bottles.map((bottle) => (
                                                        <option key={bottle.id} value={bottle.id}>
                                                            {bottle.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>{t("quantity")}</FormLabel>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleChange(index, "quantity", e.target.value)
                                                    }
                                                />
                                            </FormControl>

                                            {items.length > 1 && (
                                                <Button
                                                    mt={6}
                                                    colorScheme="red"
                                                    onClick={() => removeItem(index)}
                                                >
                                                    <BsFillTrash3Fill />
                                                </Button>
                                            )}
                                        </HStack>
                                    </Box>
                                ))}

                                <Button colorScheme="blue" onClick={addItem}>
                                    {t("add_row")}
                                </Button>

                                <Divider />
                            </VStack>

                            <HStack spacing={4} mt={6}>
                                <Button
                                    type="button"
                                    as={ReactRouterLink}
                                    to={JUICE_ALLOCATION_LIST_PATH}
                                    colorScheme="orange"
                                    flex={1}
                                >
                                    {t("cancel")}
                                </Button>

                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    loadingText="Saving Data..."
                                    colorScheme="teal"
                                    flex={1}
                                >
                                    {t("save")}
                                </Button>
                            </HStack>
                        </form>
                    </CardBody>
                </Card>
            </Box>
        </>
    );
};

export default JuiceAllocationEdit;
