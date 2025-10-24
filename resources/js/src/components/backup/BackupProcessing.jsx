import {
    Box,
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useToast,
    Spinner,
    Center,
    Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import api from "../../axios";
import { DASHBOARD_PATH } from "../../router";

const BackupProcessing = () => {
    const { t } = useTranslation();
    const toast = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const downloadBackup = async () => {
        try {
            const response = await api.get("/superadmin/backup-and-download", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "database-backup.zip");
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast({
                title: t("Backup Downloaded"),
                status: "success",
                position: "top",
                isClosable: true,
            });

        } catch (error) {
            console.error(error);
            toast({
                title: t("Backup Failed"),
                description: t("Something went wrong while processing backup."),
                status: "error",
                position: "top",
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Backup`;
        downloadBackup();
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
                            <BreadcrumbLink as={ReactRouterLink} to="#">
                                {t("backup")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </CardBody>
            </Card>

            <Box>
                <Card shadow="md" borderRadius="2xl">
                    <CardBody>
                        {isLoading ? (
                            <Center flexDirection="column" py={10}>
                                <Spinner size="xl" thickness="6px" speed="0.6s" />
                                <Text mt={4} fontSize="lg" fontWeight="semibold">
                                    {t("Processing backup... Please wait.")}
                                </Text>
                            </Center>
                        ) : (
                            <Center py={10}>
                                <Text fontSize="lg" fontWeight="semibold">
                                    ✅ {t("Your backup has been downloaded.")}
                                </Text>
                            </Center>
                        )}
                    </CardBody>
                </Card>
            </Box>
        </>
    );
};

export default BackupProcessing;
