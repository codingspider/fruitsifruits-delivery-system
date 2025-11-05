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
    InputGroup,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    HStack,
    useToast,
    Flex,
    InputRightElement,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import { ASSIGN_TASK_PATH, DASHBOARD_PATH } from "../../router";
import { Link as ReactRouterLink } from "react-router-dom";
import { DRIVER_LIST_PATH } from './../../router';

const DailyCollection = () => {
    const { register, handleSubmit, reset } = useForm();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await api.post("driver/daily/collection", data);
            reset();

            toast({
                position: "bottom-right",
                title: res.data.message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            const errorResponse = err?.response?.data;
            if (errorResponse?.errors) {
                const errorMessage = Object.values(errorResponse.errors).flat().join(" ");
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

    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Daily Collection`;
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
                                to={ASSIGN_TASK_PATH}
                            >
                                {t("list")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </CardBody>
            </Card>

            <Box>
                <Card shadow="md" borderRadius="2xl">
                    <CardBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Plan Info */}
                            <SimpleGrid
                                columns={{ base: 1, md: 2 }}
                                spacing={6}
                            >
                                <FormControl isRequired>
                                    <FormLabel>{t("amount")}</FormLabel>
                                    <Input
                                        {...register("amount", {
                                            required: true,
                                        })}
                                        placeholder={t("amount")}
                                    />
                                </FormControl>
                                <HStack spacing={4} mt={6}>
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

                            </SimpleGrid>

                            
                        </form>
                    </CardBody>
                </Card>
            </Box>
        </>
    );
};

export default DailyCollection;
