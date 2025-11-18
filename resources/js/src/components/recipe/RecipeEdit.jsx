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
    Text, // ✅ Added for displaying total nicely
} from "@chakra-ui/react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link as ReactRouterLink } from "react-router-dom";
import api from "../../axios";
import { DASHBOARD_PATH, RECIPE_LIST_PATH } from "../../router";

const RecipeEdit = () => {
    const { register, handleSubmit, reset } = useForm();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [products, setProducts] = useState([]);
    const [flavours, setFlavours] = useState([]); 
    const [bottles, setBottles] = useState([]); 
    const { id } = useParams();
    
    const toast = useToast();
    const navigate = useNavigate();

    const [items, setItems] = useState([
        { productId: "", bottle_id: "", quantity: 1, price: 0, unit: "" },
    ]);

    // ✅ Corrected form state — added missing "notes" and "total"
    const [form, setForm] = useState({
        product_id: "",
        flavour_id: "",
        total_quantity: "",
        ingredients_cost: "",
        instructions: "",
        total: 0,
        output_quantity: 0,
    });

    const getRecipe = async () => {
        const res = await api.get(`superadmin/recipes/${id}`);
        const recipe = res.data.data;

        console.log(recipe);

        // Map API data to local form shape
        setForm({
            product_id: recipe.product_id ?? "",
            flavour_id: recipe.flavour_id ?? "",
            instructions: recipe.instructions ?? "",
            total_quantity: recipe.total_quantity ?? 0,
            ingredients_cost: recipe.ingredients_cost ?? 0,
            output_quantity: recipe.flavor?.batch_yield ?? 0,
        });

        setItems(
            recipe.recipe_items.map((line) => ({
                productId: line.product_id,
                bottle_id: line.bottle_id,
                quantity: line.quantity,
                price: line.price,
                unit: line.unit,
            }))
        );
    };


    const getFlavours = async () => {
        try {
            const res = await api.get("superadmin/flavours");
            setFlavours(res.data?.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch flavours", err);
        }
    }; 

    const getBottles = async () => {
        const res = await api.get("superadmin/get/bottles");
        setBottles(res.data.data.data);
    };

    // ➕ Add new product row
    const addItem = () => {
        const updated = [...items, { productId: "", quantity: 1, price: 0 }];
        const computedTotal = getTotalQty(updated);
        setItems(updated);
        setForm(prev => ({ ...prev, total: computedTotal, total_quantity: computedTotal }));
    };

    // Remove a row
    const removeItem = (index) => {
        const updated = items.filter((_, i) => i !== index);
        const computedTotal = getTotalQty(updated);
        setItems(updated);
        setForm(prev => ({ ...prev, total: computedTotal, total_quantity: computedTotal }));
    };

    // 🧮 Calculate total cost dynamically
    const getTotal = (list = items) => {
        return list.reduce((sum, item) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            return sum + qty * price;
        }, 0);
    };

    const getTotalQty = (list = items) => {
        return list.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    };

    const handleChange = (index, field, value) => {
        const updated = [...items];

        // Convert numeric fields properly
        const numericFields = ["quantity", "price", "productId"];
        updated[index][field] = numericFields.includes(field) ? Number(value) : value;

        // Auto-update price when product is selected
        if (field === "productId") {
            const selectedProduct = ingredients.find((p) => p.id === Number(value));
            updated[index].price = selectedProduct ? Number(selectedProduct.cost_price) : 0;
        }

        // Compute totals based on UPDATED list
        const totalQty = getTotalQty(updated);
        const totalCost = getTotal(updated); // Optional if you need cost

        // Update items first
        setItems(updated);

        // Update form using the updated list
        setForm(prev => ({
            ...prev,
            ingredients_cost: totalCost,
            total_quantity: totalQty,
            total_cost: totalCost
        }));
    };


    // 📨 Handle form submit
    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                product_id: form.product_id,
                flavour_id: form.flavour_id,
                total_quantity: form.total_quantity,
                ingredients_cost: getTotal(),
                instructions: form.instructions,
                output_quantity: form.output_quantity,
                products: items.map((item) => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                    bottle_id: item.bottle_id,
                    unit: item.unit,
                    price: item.price,
                })),
            };

            console.log("Payload:", payload);

            const res = await api.put(`superadmin/recipes/${id}`, payload);
            reset();

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

    // 📦 Fetch ingredients (raw materials)
    const getIngredients = async () => {
        const res = await api.get("superadmin/get/ingredients");
        setIngredients(res.data.data.data);
    };

    // 🏷️ Fetch finished goods
    const getProducts = async () => {
        const res = await api.get("superadmin/get/finished/goods");
        setProducts(res.data.data.data);
    };

    // ⚡ Initial load
    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Cost Update`;
        getIngredients();
        getProducts();
        getFlavours();
        getBottles();
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
                            <Heading size="md">{t("add_recipe")}</Heading>
                            <Button
                                colorScheme="teal"
                                as={ReactRouterLink}
                                to={RECIPE_LIST_PATH}
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
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                {/* ✅ Fixed product select to actually update form state */}
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
                                <FormControl isRequired>
                                    <FormLabel>{t("flavour")}</FormLabel>
                                    <Select placeholder="Select Flavour"  value={form.flavour_id}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                flavour_id: e.target.value,
                                            }))
                                        }>
                                        {flavours.map((flavour) => (<option key={flavour.id} value={flavour.id}>{flavour.name}</option>))}
                                    </Select>
                                </FormControl>
                                

                                {/* ✅ Notes field fixed (was misreferencing notes/instructions) */}
                                <FormControl mb={3}>
                                    <FormLabel>{t("notes")}</FormLabel>
                                    <Input
                                        name="notes"
                                        type="text"
                                        placeholder={t("notes")}
                                        value={form.instructions}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                instructions: e.target.value,
                                            }))
                                        }
                                    />
                                </FormControl>
                                <FormControl mb={3} isRequired>
                                    <FormLabel>{t("output_quantity")}</FormLabel>
                                    <Input
                                        name="batch_yield"
                                        type="text"
                                        placeholder={t("output_quantity")}
                                        value={form.output_quantity}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                output_quantity: e.target.value,
                                            }))
                                        }
                                    />
                                </FormControl>
                            </SimpleGrid>

                            <VStack spacing={4} align="stretch" mt={6}>
                                {items.map((item, index) => (
                                    <Box key={index} p={4} borderWidth={1} borderRadius="md">
                                        <HStack spacing={4}>
                                            {/* Ingredient Selector */}
                                            <FormControl>
                                                <FormLabel>{t("ingredient")}</FormLabel>
                                                <Select
                                                    placeholder="Select Ingredient"
                                                    value={item.productId}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "productId",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {ingredients.map((ingredient) => (
                                                        <option
                                                            key={ingredient.id}
                                                            value={ingredient.id}
                                                        >
                                                            {ingredient.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>


                                            {/* Quantity */}
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

                                            <FormControl isRequired>
                                                <FormLabel>{t("unit")}</FormLabel>
                                                <Select 
                                                    value={item.unit}
                                                    onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "unit",
                                                        e.target.value
                                                    )
                                                    } placeholder="Select unit">
                                                    {/* Weight */}
                                                    <option value="kg">Kilogram (kg)</option>
                                                    <option value="g">Gram (g)</option>
                                                    <option value="mg">Milligram (mg)</option>
                                                    <option value="lb">Pound (lb)</option>

                                                    {/* Volume */}
                                                    <option value="liter">Liter (L)</option>
                                                    <option value="ml">Milliliter (mL)</option>
                                                    <option value="gal">Gallon (gal)</option>

                                                    {/* Units / Count */}
                                                    <option value="pcs">Pieces (pcs)</option>
                                                    <option value="pack">Pack</option>
                                                    <option value="box">Box</option>
                                                    <option value="carton">Carton</option>
                                                    <option value="bottle">Bottle</option>
                                                    <option value="bag">Bag</option>
                                                    {/* Other */}
                                                    <option value="dozen">Dozen</option>
                                                    <option value="set">Set</option>
                                                </Select>
                                            </FormControl>
                                            


                                            {/* Remove Row */}
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

                                {/* Add Row Button */}
                                <Button colorScheme="blue" onClick={addItem}>
                                    {t("add_row")}
                                </Button>

                                <Divider />
                            </VStack>

                            <HStack spacing={4} mt={6}>
                                <Button
                                    type="button"
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

export default RecipeEdit;
