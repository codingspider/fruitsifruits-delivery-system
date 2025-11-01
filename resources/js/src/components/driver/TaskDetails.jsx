import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
    Link as ReactRouterLink,
    useNavigate,
    useParams,
} from "react-router-dom";
import api from "../../axios";
import { useTranslation } from "react-i18next";
import { DASHBOARD_PATH, LOCATION_LIST_PATH } from "../../router";
import AssignmentForm from "../assignment/AssignmentForm";

const TaskDetails = () => {
    const { handleSubmit, reset } = useForm();
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [flavours, setFlavours] = useState([]);
    const [bottles, setBottles] = useState([]);
    const [location, setLocation] = useState(null);
    const [items, setItems] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();
    const { id } = useParams();

    const getBottles = async () => {
        try {
            const res = await api.get("superadmin/get/bottles");
            setBottles(res.data?.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch bottles:", err);
        }
    };

    const getProducts = async () => {
        try {
            const res = await api.get("superadmin/get/finished/goods");
            setProducts(res.data?.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    const getFlavours = async () => {
        try {
            const res = await api.get("superadmin/flavours");
            setFlavours(res.data?.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch flavours:", err);
        }
    };

    const getLocation = async () => {
        try {
            const res = await api.get(`superadmin/locations/${id}`);
            const locationData = res.data?.data || {};
            setLocation(locationData);

            // ✅ Safely map items
            const mappedItems = (locationData.location_flavours || []).map(
                (line) => ({
                    productId: line.product_id ?? "",
                    flavourId: line.flavour_id ?? "",
                    bottle_id: line.bottle_id ?? "",
                    quantity: line.specific_quantity ?? 0,
                    price: line.price ?? 0,
                })
            );

            setItems(mappedItems);
        } catch (err) {
            console.error("Failed to fetch location:", err);
        }
    };

    useEffect(() => {
        const app_name = localStorage.getItem("app_name") || "App";
        document.title = `${app_name} | Make Sell`;

        // Fetch all
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

            {items.length > 0 && (
                <AssignmentForm
                    flavours={flavours}
                    bottles={bottles}
                    products={products}
                    items={items}
                    location={location}
                />
            )}
        </>
    );
};

export default TaskDetails;
