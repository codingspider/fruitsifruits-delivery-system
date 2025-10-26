import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../axios";

const DriverProfile = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await api.post("driver/profile/update", data);

      toast({
        position: "bottom-right",
        title: res.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });


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

  const getBusinesData = async () => {
        const res = await api.get(`driver/profile/data`);
        const driver = res.data.data;
        reset({
            name: driver.name,
            phone: driver.phone,
        });

    };

  useEffect(() => {
      getBusinesData();
  }, []);

  return (
    <>
      <Card mb={5}>
        <CardBody>
          <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{t("home")}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </CardBody>
      </Card>

      <Box>
        <Card mx="auto" boxShadow="lg">
          <CardBody>
            <Heading size="md" mb={6}>
              {t("driver_profile")}
            </Heading>

            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel>{t("name")}</FormLabel>
                  <Input type="text" {...register("name", { required: true })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t("phone_number")}</FormLabel>
                  <Input type="text" {...register("phone", { required: true })} />
                </FormControl>
              </SimpleGrid>

              <Stack direction="row" justify="flex-end" mt={8}>
                <Button
                  isLoading={isSubmitting}
                  loadingText="Saving..."
                  type="submit"
                  colorScheme="teal"
                >
                  {t("save")}
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
      </Box>
    </>
  );
};

export default DriverProfile;
