import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    SimpleGrid,
    Heading,
    Button,
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Text
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import api from "../../axios";
import moment from "moment";
import { DRIVER_DASHBOARD_PATH, TASK_DETAILS_PATH } from "../../router";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";

const AssignTask = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTask] = useState([]);
    const navigate = useNavigate();
    const fetchTasks = async () => {
        try {
            const res = await api.get("/driver/assign/tasks");
            console.log(res.data.data);

            setTask(res.data.data);
        } catch (err) {
            console.error("fetchFlavours error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Assign Task`;
        fetchTasks();
    }, []);
    return (
        <>
             <Card mb={5}>
                <CardBody>
                    <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                as={ReactRouterLink}
                                to={DRIVER_DASHBOARD_PATH}
                            >
                                {t("dashboard")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink
                                as={ReactRouterLink}
                                to="#"
                            >
                                {t("assign_task")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </CardBody>
            </Card>

            <SimpleGrid
                spacing={6}
                templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            >
                {tasks.length === 0 ? (
                <Card>
                    <CardBody>
                        <Text textAlign="center" mt={4}>No more task</Text>
                    </CardBody>
                </Card>
                ) : (
                tasks.map((item, index) => (
                    <Card key={index}>
                    <CardHeader>
                        <Heading size="md">{item.location_name}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Heading size="sm">
                        {moment(item.date).format("DD MMM, YYYY")}{" "}
                        </Heading>
                        <Badge
                        colorScheme={item.status === "active" ? "green" : "teal"}
                        variant="subtle"
                        px={2}
                        py={1}
                        mt={2}
                        borderRadius="md"
                        >
                        {item.status}
                        </Badge>
                    </CardBody>
                    <CardFooter>
                        <Button
                        colorScheme="teal"
                        display={{ base: "none", md: "inline-flex" }}
                        px={4}
                        py={2}
                        whiteSpace="normal"
                        textAlign="center"
                        onClick={() =>
                            navigate(TASK_DETAILS_PATH(item.location_id))
                        }
                        >
                        {t("details")}
                        </Button>
                    </CardFooter>
                    </Card>
                ))
                )}

            </SimpleGrid>
        </>
    );
};

export default AssignTask;
