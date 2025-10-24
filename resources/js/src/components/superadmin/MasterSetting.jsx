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

const MasterSetting = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // ✅ FormData for file upload
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("zip_code", data.zip);

    if (data.app_logo?.[0]) {
      formData.append("logo", data.app_logo[0]);
    }
    if (data.fav_icon?.[0]) {
      formData.append("favicon", data.fav_icon[0]);
    }

    try {
      const res = await api.post("superadmin/save/business/setting", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

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
        const res = await api.get(`superadmin/get/business/data`);
        const business = res.data.data;
        reset({
            name: business.name,
            email: business.email,
            phone: business.phone,
            address: business.address,
            city: business.city,
            state: business.state,
            zip_code: business.zip_code,
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
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">{t("master_setting")}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </CardBody>
      </Card>

      <Box>
        <Card mx="auto" boxShadow="lg">
          <CardBody>
            <Heading size="md" mb={6}>
              {t("master_setting")}
            </Heading>

            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel>{t("application_name")}</FormLabel>
                  <Input type="text" {...register("name", { required: true })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t("phone_number")}</FormLabel>
                  <Input type="text" {...register("phone", { required: true })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t("email")}</FormLabel>
                  <Input type="email" {...register("email", { required: true })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t("address")}</FormLabel>
                  <Input type="text" {...register("address", { required: true })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t("city")}</FormLabel>
                  <Input type="text" {...register("city", { required: true })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t("zip")}</FormLabel>
                  <Input type="text" {...register("zip_code", { required: true })} />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={8}>
                <FormControl>
                  <FormLabel>{t("app_logo")}</FormLabel>
                  <Input type="file" {...register("app_logo")} />
                </FormControl>

                <FormControl>
                  <FormLabel>{t("fav_icon")}</FormLabel>
                  <Input type="file" {...register("fav_icon")} />
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

export default MasterSetting;
