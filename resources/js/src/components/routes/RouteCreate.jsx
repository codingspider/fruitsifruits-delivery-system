import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";
import api from "../../axios";
import { DASHBOARD_PATH, DRIVER_ROUTE_LIST_PATH } from "../../router";

const RouteCreate = () => {
  const { handleSubmit, reset } = useForm();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [form, setForm] = useState({
    user_id: "",
    day: "",
  });

  const [items, setItems] = useState([{ location_id: "" }]);

  const weekdays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  // Fetch locations
  const getLocations = async () => {
    try {
      const res = await api.get("superadmin/locations");
      setLocations(res.data?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch drivers
  const getDrivers = async () => {
    try {
      const res = await api.get("superadmin/drivers");
      setDrivers(res.data?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const app_name = localStorage.getItem("app_name") || "App";
    document.title = `${app_name} | Create Driver Route`;
    getLocations();
    getDrivers();
  }, []);

  // Handle form-level change
  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle per-item location change
  const handleItemChange = (index, value) => {
    const updated = [...items];
    updated[index].location_id = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { location_id: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    // Basic validation
    if (!form.user_id) {
      toast({
        title: "Validation Error",
        description: "Driver is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!form.day) {
      toast({
        title: "Validation Error",
        description: "Day is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (items.some((item) => !item.location_id)) {
      toast({
        title: "Validation Error",
        description: "All locations must be selected",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      user_id: form.user_id,
      day: form.day,
      locations: items.map((item) => ({ location_id: item.location_id })),
    };

    setIsSubmitting(true);
    try {
      const res = await api.post("superadmin/driver/routes", payload);
      toast({
        position: "bottom-right",
        title: res.data.message || "Route created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      reset();
      setForm({ user_id: "", day: "" });
      setItems([{ location_id: "" }]);
      navigate(DRIVER_ROUTE_LIST_PATH);
    } catch (err) {
      const errorResponse = err?.response?.data;
      const message =
        errorResponse?.message ||
        Object.values(errorResponse?.errors || {}).flat().join(" ") ||
        "Something went wrong";
      toast({
        position: "bottom-right",
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <Card mb={5}>
        <CardBody>
          <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
            <BreadcrumbItem>
              <BreadcrumbLink as={ReactRouterLink} to={DASHBOARD_PATH}>
                {t("dashboard")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink as={ReactRouterLink} to={DRIVER_ROUTE_LIST_PATH}>
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
              <Heading size="md">{t("add_route") || "Add Route"}</Heading>
              <Button
                colorScheme="teal"
                as={ReactRouterLink}
                to={DRIVER_ROUTE_LIST_PATH}
                display={{ base: "none", md: "inline-flex" }}
              >
                {t("list")}
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* Driver select */}
                <FormControl isRequired>
                  <FormLabel>{t("driver")}</FormLabel>
                  <Select
                    placeholder="Select Driver"
                    value={form.user_id}
                    onChange={(e) => handleFormChange("user_id", e.target.value)}
                  >
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Day select */}
                <FormControl isRequired>
                  <FormLabel>Day</FormLabel>
                  <Select
                    placeholder="Select Day"
                    value={form.day}
                    onChange={(e) => handleFormChange("day", e.target.value)}
                  >
                    {weekdays.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Locations per row */}
              <VStack spacing={4} align="stretch" mt={6}>
                {items.map((item, index) => (
                  <Box key={index} p={4} borderWidth={1} borderRadius="md">
                    <HStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Location</FormLabel>
                        <Select
                          placeholder="Select Location"
                          value={item.location_id || ""}
                          onChange={(e) => handleItemChange(index, e.target.value)}
                        >
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      {items.length > 1 && (
                        <Button colorScheme="red" onClick={() => removeItem(index)}>
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
                  to={DRIVER_ROUTE_LIST_PATH}
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

export default RouteCreate;
