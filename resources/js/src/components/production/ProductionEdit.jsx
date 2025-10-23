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
    Text,
} from "@chakra-ui/react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link as ReactRouterLink } from "react-router-dom";
import api from "../../axios";
import { DASHBOARD_PATH, RECIPE_LIST_PATH } from "../../router";

const ProductionEdit = () => {
    const { register, handleSubmit, reset } = useForm();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [products, setProducts] = useState([]);
    const { id } = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    // 🧾 Recipe form data
    const [form, setForm] = useState({
        product_id: "",
        total_quantity: 0,
        ingredients_cost: 0,
        instructions: "",
        notes: "",
    });

    // 🧮 Recipe line items
    const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0 }]);

    // 🔢 Helpers
    const getTotalQty = (list = items) =>
        list.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    const getTotalCost = (list = items) =>
        list.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // 🧠 Handle ingredient/product field changes
    const handleChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] =
            field === "quantity" || field === "price" ? Number(value) : value;

        // Auto set price from selected ingredient
        if (field === "productId") {
            const selected = ingredients.find((p) => p.id === Number(value));
            updated[index].price = selected ? Number(selected.cost_price) : 0;
        }

        setItems(updated); // totals auto update via useEffect
    };

    // ➕ Add ingredient line
    const addItem = () => {
        setItems([...items, { productId: "", quantity: 1, price: 0 }]);
    };

    // 🗑 Remove ingredient line
    const removeItem = (index) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
    };

    // 🔄 Auto-recalculate totals whenever items change
    useEffect(() => {
        const totalQty = getTotalQty(items);
        const totalCost = getTotalCost(items);
        setForm((prev) => ({
            ...prev,
            total_quantity: totalQty,
            ingredients_cost: totalCost,
        }));
    }, [items]);

    // 📦 Fetch available ingredients
    const getIngredients = async () => {
        const res = await api.get("superadmin/get/products");
        setIngredients(res.data.data.data);
    };

    // 🏷 Fetch finished goods
    const getProducts = async () => {
        const res = await api.get("superadmin/get/finished/goods");
        setProducts(res.data.data.data);
    };

    // 🧾 Fetch existing recipe to edit
    const getRecipe = async () => {
        const res = await api.get(`superadmin/recipes/${id}`);
        const recipe = res.data.data;

        // Map API data to local form shape
        setForm({
            product_id: recipe.product_id ?? "",
            instructions: recipe.instructions ?? "",
            notes: recipe.notes ?? "",
            total_quantity: recipe.total_quantity ?? 0,
            ingredients_cost: recipe.ingredients_cost ?? 0,
        });

        setItems(
            recipe.recipe_items.map((line) => ({
                productId: line.product_id,
                quantity: line.quantity,
                price: line.price,
            }))
        );
    };

    // 📤 Submit updated recipe
    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                product_id: form.product_id,
                total_quantity: form.total_quantity,
                ingredients_cost: form.ingredients_cost,
                instructions: form.instructions,
                notes: form.notes,
                products: items.map((item) => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            };

            const res = await api.put(`superadmin/recipes/${id}`, payload);

            toast({
                position: "bottom-right",
                title: res.data.message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            navigate(RECIPE_LIST_PATH);
        } catch (err) {
            const errorResponse = err?.response?.data;
            const errorMessage =
                errorResponse?.errors
                    ? Object.values(errorResponse.errors).flat().join(" ")
                    : errorResponse?.message || "Unknown error occurred.";

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

    // ⚡ On mount — load everything
    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Recipe Update`;
        getIngredients();
        getProducts();
        getRecipe();
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
                            <BreadcrumbLink as={ReactRouterLink} to={RECIPE_LIST_PATH}>
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
                            <Heading size="md">{t("update_recipe")}</Heading>
                            <Button
                                colorScheme="teal"
                                as={ReactRouterLink}
                                to={RECIPE_LIST_PATH}
                            >
                                {t("list")}
                            </Button>
                        </Flex>
                    </CardHeader>

                    <CardBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                {/* ✅ Product Select */}
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

                                {/* ✅ Notes */}
                                <FormControl>
                                    <FormLabel>{t("notes")}</FormLabel>
                                    <Input
                                        value={form.notes}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                notes: e.target.value,
                                            }))
                                        }
                                        placeholder={t("notes")}
                                    />
                                </FormControl>
                            </SimpleGrid>

                            {/* 🧾 Ingredient Items */}
                            <VStack spacing={4} align="stretch" mt={6}>
                                {items.map((item, index) => (
                                    <Box key={index} p={4} borderWidth={1} borderRadius="md">
                                        <HStack spacing={4}>
                                            <FormControl>
                                                <FormLabel>{t("ingredient")}</FormLabel>
                                                <Select
                                                    placeholder="Select Ingredient"
                                                    value={item.productId ?? ""}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "productId",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {ingredients.map((ing) => (
                                                        <option
                                                            key={ing.id}
                                                            value={ing.id}
                                                        >
                                                            {ing.name}
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
                                                        handleChange(
                                                            index,
                                                            "quantity",
                                                            e.target.value
                                                        )
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

                            {/* ✅ Footer Buttons */}
                            <HStack spacing={4} mt={6}>
                                <Button
                                    as={ReactRouterLink}
                                    to={RECIPE_LIST_PATH}
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
                                    {t("update")}
                                </Button>
                            </HStack>
                        </form>
                    </CardBody>
                </Card>
            </Box>
        </>
    );
};

export default ProductionEdit;
