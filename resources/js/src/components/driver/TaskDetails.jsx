import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    CardBody as ChakraCardBody,
    Card as ChakraCard,
    CardHeader as ChakraCardHeader,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Select,
    SimpleGrid,
    VStack,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useToast,
    Checkbox,
    Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
    Link as ReactRouterLink,
    useNavigate,
    useParams,
} from "react-router-dom";
import { BsFillTrash3Fill } from "react-icons/bs";
import api from "../../axios";
import { useTranslation } from "react-i18next";
import { DASHBOARD_PATH, LOCATION_LIST_PATH } from "../../router";
import AssignProduct from "../sell/AssignProduct";
import LocationInfo from "../sell/LocationInfo";

const TaskDetails = () => {
    const { handleSubmit, reset } = useForm();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [products, setProducts] = useState([]);
    const [flavours, setFlavours] = useState([]);
    const [bottles, setBottles] = useState([]);
    const [locations, setLocation] = useState([]);
    const [items, setItems] = useState([]);

    const toast = useToast();
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        lat: "",
        lon: "",
        tax_enabled: false,
        tax_amount: "",
    });

    const getBottles = async () => {
        const res = await api.get("superadmin/get/bottles");
        setBottles(res.data.data.data);
    };

    const getProducts = async () => {
        try {
            const res = await api.get("superadmin/get/finished/goods");
            setProducts(res.data?.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const getFlavours = async () => {
        try {
            const res = await api.get("superadmin/flavours");
            setFlavours(res.data?.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch flavours", err);
        }
    };

    const getLocation = async () => {
        const res = await api.get(`superadmin/locations/${id}`);
        const location = res.data.data;
        setLocation(location);

        setForm({
            name: location.name ?? "",
            lat: location.lat ?? "",
            lon: location.lon ?? "",
            tax_enabled: location.tax_amount > 0 ? true : false,
            tax_amount: location.tax_amount ?? "",
        });

        setItems(
            location.location_flavours.map((line) => ({
                productId: line.product_id ?? '',
                flavourId: line.flavour_id ?? '',
                bottle_id: line.bottle_id ?? '',
                quantity: line.specific_quantity,
                price: line.price,
            }))
        );
    };


    useEffect(() => {
        const app_name = localStorage.getItem("app_name") || "App";
        document.title = `${app_name} | Make Sell`;
        getProducts();
        getFlavours();
        getBottles();
        getLocation();
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
                                to={LOCATION_LIST_PATH}
                            >
                                {t("list")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </CardBody>
            </Card>
            
                <AssignProduct
                flavours={flavours}
                bottles={bottles}
                products={products}
                items={items}
                ></AssignProduct>
        </>
    );
};

export default TaskDetails;
