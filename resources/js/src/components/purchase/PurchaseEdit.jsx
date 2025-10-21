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
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import { DASHBOARD_PATH, PURCHASE_LIST_PATH } from "../../router";
import { Link as ReactRouterLink, useParams } from "react-router-dom";

const PurchaseEdit = () => {
    const { register, handleSubmit, reset } = useForm();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [products, setProduct] = useState([]);
    const { id } = useParams();
    const toast = useToast();
    const navigate = useNavigate();
    const [items, setItems] = useState([
        { productId: "", quantity: 1, price: 0 },
    ]);

    // Add new product row
    const addItem = () => {
        setItems([...items, { productId: "", quantity: 1, price: 0 }]);
    };

    const [form, setForm] = useState({
        date: "",
        total: "",
        ref_no: "",
        notes: "",
    });

    // Remove product row
    const removeItem = (index) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
    };

    // Handle input change
    const handleChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] =
            field === "quantity" || field === "price" ? Number(value) : value;

        // Auto-update price when product selected
        if (field === "productId") {
            const selectedProduct = products.find(
                (p) => p.id === Number(value)
            );
            updated[index].price = selectedProduct
                ? selectedProduct.cost_price
                : 0;
        }

        setItems(updated);
        setForm((prev) => ({ ...prev, total: getTotal() }));
    };

    // Calculate total
    const getTotal = () => {
        return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                date: form.date,
                total: form.total,
                ref_no: form.ref_no,
                notes: form.notes,

                products: items.map((item) => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            };

            const res = await api.put(`superadmin/purchases/${id}`, payload);
            reset();

            toast({
                position: "bottom-right",
                title: res.data.message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate(`${PURCHASE_LIST_PATH}`);
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

    const getProducts = async () => {
        const res = await api.get("superadmin/get/products");
        setProduct(res.data.data.data);
    };

    const getPurchase = async () => {
        const res = await api.get(`superadmin/purchases/${id}`);
        const purchase = res.data.data;

        setForm({
            date: purchase.date ?? "",
            total: purchase.total_amount ?? "",
            ref_no: purchase.reference_no ?? "",
            notes: purchase.notes ?? "",
        });

        setItems(
            purchase.lines.map((line) => ({
                productId: line.product_id,
                quantity: line.quantity,
                price: line.unit_cost,
            }))
        );
    };

    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Purchase Create`;
        getProducts();
        getPurchase();
    }, []);

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
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink
                                as={ReactRouterLink}
                                to={PURCHASE_LIST_PATH}
                            >
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
                            <Heading size="md">{t("add_purchase")}</Heading>
                            <Button
                                colorScheme="teal"
                                as={ReactRouterLink}
                                to={PURCHASE_LIST_PATH}
                                display={{ base: "none", md: "inline-flex" }}
                                px={4}
                                py={2}
                                whiteSpace="normal"
                                textAlign="center"
                            >
                                {t("list")}
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <SimpleGrid
                                columns={{ base: 1, md: 3 }}
                                spacing={6}
                            >
                                <FormControl mb={3} isRequired>
                                    <FormLabel>{t("date")}</FormLabel>
                                    <Input
                                        name="date"
                                        type="date"
                                        placeholder={t("date")}
                                        value={form.date}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                date: e.target.value,
                                            }))
                                        }
                                    />
                                </FormControl>

                                <FormControl mb={3}>
                                    <FormLabel>{t("reference_no")}</FormLabel>
                                    <Input
                                        name="reference_no"
                                        type="text"
                                        placeholder={t("reference_no")}
                                        value={form.ref_no}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                ref_no: e.target.value,
                                            }))
                                        }
                                    />
                                </FormControl>

                                <FormControl mb={3}>
                                    <FormLabel>{t("notes")}</FormLabel>
                                    <Input
                                        name="notes"
                                        type="text"
                                        placeholder={t("notes")}
                                        value={form.notes}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                notes: e.target.value,
                                            }))
                                        }
                                    />
                                </FormControl>
                            </SimpleGrid>

                            <VStack spacing={4} align="stretch">
                                {items.map((item, index) => (
                                    <Box
                                        key={index}
                                        p={4}
                                        borderWidth={1}
                                        borderRadius="md"
                                    >
                                        <HStack spacing={4}>
                                            {/* Product Selector */}
                                            <FormControl>
                                                <FormLabel>Product</FormLabel>
                                                <Select
                                                    placeholder="Select Product"
                                                    value={item.productId}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "productId",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {products.map((product) => (
                                                        <option
                                                            key={product.id}
                                                            value={product.id}
                                                        >
                                                            {product.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            {/* Quantity */}
                                            <FormControl>
                                                <FormLabel>Quantity</FormLabel>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </FormControl>

                                            {/* Price */}
                                            <FormControl>
                                                <FormLabel>Price</FormLabel>
                                                <Input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </FormControl>

                                            {/* Remove Button */}
                                            {items.length > 1 && (
                                                <Button
                                                    mt={6}
                                                    colorScheme="red"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
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

                                <p fontWeight="bold">Total: ${getTotal()}</p>
                                <Input
                                    type="hidden"
                                    name="total"
                                    value={form.total}
                                />
                            </VStack>

                            <HStack spacing={4} mt={6}>
                                <Button
                                    type="button"
                                    as={ReactRouterLink}
                                    to={PURCHASE_LIST_PATH}
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

export default PurchaseEdit;
