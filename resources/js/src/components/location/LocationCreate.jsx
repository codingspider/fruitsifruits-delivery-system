import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
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
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { BsFillTrash3Fill } from "react-icons/bs";
import api from "../../axios";
import { useTranslation } from "react-i18next";
import { DASHBOARD_PATH, LOCATION_LIST_PATH } from "../../router";

const LocationCreate = () => {
  const { handleSubmit, reset } = useForm();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [bottles, setBottles] = useState([]);
  const [coords, setCoords] = useState(null);
  const mapRef = useRef(null); 
  const [marker, setMarker] = useState(null);
  const autocompleteRef = useRef(null); 
  const [map, setMap] = useState(null); 

  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lat: "",
    lon: "",
    tax_enabled : false,
    tax_amount: ""
  });

  const [items, setItems] = useState([
    {
      productId: "",
      flavourId: "",
      bottle_id: "",
      quantity: 1,
      price: 0,
      deal_enabled: false,
      deal_amount: "",
      discount_enabled: false,
      discount_type: "",
      discount_value: "",
    },
  ]);

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      let newValue = value;
      if (field === "price" || field === "quantity") newValue = Number(value);
      updated[index] = { ...updated[index], [field]: newValue };

      if (field === "productId") {
        const selectedProduct = products.find((p) => p.id === Number(value));
        updated[index].price = selectedProduct ? Number(selectedProduct.cost_price) : 0;
      }

      return updated;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: "",
        flavourId: "",
        bottle_id: "",
        quantity: 1,
        price: 0,
        deal_enabled: false,
        deal_amount: "",
        discount_enabled: false,
        discount_type: "",
        discount_value: "",
      },
    ]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
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

  const getBottles = async () => {
      const res = await api.get("superadmin/get/bottles");
      setBottles(res.data.data.data);
  };

  useEffect(() => {
    const app_name = localStorage.getItem("app_name") || "App";
    document.title = `${app_name} | Location Create`;
    getProducts();
    getFlavours();
    getBottles();

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDjb20izAR-trpI_UePYVNMeZkIOn1q6Ws&libraries=places`;
      script.async = true;
      document.body.appendChild(script);
      script.onload = initMap;
      return () => document.body.removeChild(script);
    } else {
      initMap();
    }
  }, []);

  function initMap() {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 23.8103, lng: 90.4125 },
        zoom: 13,
      });
      setMap(mapInstance);

      // Attach autocomplete to the existing name input
      const input = document.querySelector('input[name="name"]');
      const autocomplete = new window.google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", mapInstance);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        // Center map
        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(15);

        // Drop marker
        if (marker) marker.setMap(null);
        const newMarker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: mapInstance,
        });
        setMarker(newMarker);

        // Update form fields: name, lat, lon
        setForm((prev) => ({
          ...prev,
          name: place.name || place.formatted_address || prev.name,
          lat: place.geometry.location.lat(),
          lon: place.geometry.location.lng(),
        }));
      });

      autocompleteRef.current = autocomplete;
  }

  const onSubmit = async () => {
    if (!form.name) {
      toast({ title: "Validation error", description: "Name is required", status: "error", duration: 3000, isClosable: true });
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.productId) {
        toast({ title: "Validation error", description: `Product is required for row ${i + 1}`, status: "error", duration: 3000, isClosable: true });
        return;
      }
      if (!it.flavourId) {
        toast({ title: "Validation error", description: `Flavour is required for row ${i + 1}`, status: "error", duration: 3000, isClosable: true });
        return;
      }
    }

    const payload = {
      name: form.name,
      lat: form.lat,
      lon: form.lon,
      tax_enabled: form.tax_enabled,
      tax_amount: form.tax_amount,
      products: items.map((it) => ({
        product_id: it.productId,
        flavour_id: it.flavourId,
        bottle_id: it.bottle_id,
        quantity: Number(it.quantity) || 0,
        price: Number(it.price) || 0,
        deal_enabled: Boolean(it.deal_enabled),
        deal_amount: it.deal_amount ? Number(it.deal_amount) : null,
        discount_enabled: Boolean(it.discount_enabled),
        discount_type: it.discount_type || null,
        discount_value: it.discount_value ? Number(it.discount_value) : null,
      })),
    };

    setIsSubmitting(true);
    try {
      const res = await api.post("superadmin/locations", payload);
      toast({ position: "bottom-right", title: res?.data?.message || "Location created", status: "success", duration: 3000, isClosable: true });
      navigate(`${LOCATION_LIST_PATH}`);
    } catch (err) {
      const errorResponse = err?.response?.data;
      if (errorResponse?.errors) {
        const errorMessage = Object.values(errorResponse.errors).flat().join(" ");
        toast({ position: "bottom-right", title: "Error", description: errorMessage, status: "error", duration: 3000, isClosable: true });
      } else if (errorResponse?.message) {
        toast({ position: "bottom-right", title: "Error", description: errorResponse.message, status: "error", duration: 3000, isClosable: true });
      } else {
        toast({ position: "bottom-right", title: "Error", description: "Something went wrong", status: "error", duration: 3000, isClosable: true });
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card mb={5}>
        <CardBody>
          <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
            <BreadcrumbItem>
              <BreadcrumbLink as={ReactRouterLink} to={DASHBOARD_PATH}>{t("dashboard")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink as={ReactRouterLink} to={LOCATION_LIST_PATH}>{t("list")}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </CardBody>
      </Card>

      <Box>
        <Card shadow="md" borderRadius="2xl">
          <CardHeader>
            <Flex mb={4} justifyContent="space-between">
              <Heading size="md">{t("add_location") || "Add Location"}</Heading>
              <Button colorScheme="teal" as={ReactRouterLink} to={LOCATION_LIST_PATH} display={{ base: "none", md: "inline-flex" }} px={4} py={2} whiteSpace="normal" textAlign="center">{t("list")}</Button>
            </Flex>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <FormControl mb={3} isRequired>
                  <FormLabel>{t("name")}</FormLabel>
                  <Input name="name" type="text" placeholder={t("name")} value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel>{t("lat")}</FormLabel>
                  <Input name="lat" type="text" placeholder={t("lat")} value={form.lat} onChange={(e) => setForm((prev) => ({ ...prev, lat: e.target.value }))} />
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel>{t("lon")}</FormLabel>
                  <Input name="lon" type="text" placeholder={t("lon")} value={form.lon} onChange={(e) => setForm((prev) => ({ ...prev, lon: e.target.value }))} />
                </FormControl>

                <FormControl>
                  <HStack>
                    <Checkbox isChecked={Boolean(form.tax_enabled)} onChange={(e) => setForm((prev) => ({ ...prev, tax_enabled: e.target.checked }))}>{t("tax")}</Checkbox>
                    {form.tax_enabled && <Input type="number" placeholder="Tax %" value={form.tax_amount} onChange={(e) => setForm((prev) => ({ ...prev, tax_amount: e.target.value }))} />}
                  </HStack>
                </FormControl>
              </SimpleGrid>

              <VStack spacing={4} align="stretch" mt={6}>
                {items.map((item, index) => (
                  <Box key={index} p={4} borderWidth={1} borderRadius="md">
                    <HStack spacing={4} align="flex-start">
                      <FormControl isRequired>
                        <FormLabel>{t("product")}</FormLabel>
                        <Select placeholder="Select Product" value={item.productId} onChange={(e) => handleItemChange(index, "productId", e.target.value)}>
                          {products.map((product) => (<option key={product.id} value={product.id}>{product.name}</option>))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>{t("flavour")}</FormLabel>
                        <Select placeholder="Select Flavour" value={item.flavourId} onChange={(e) => handleItemChange(index, "flavourId", e.target.value)}>
                          {flavours.map((flavour) => (<option key={flavour.id} value={flavour.id}>{flavour.name}</option>))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>{t("bottle")}</FormLabel>
                        <Select placeholder="Select" value={item.bottle_id} onChange={(e) => handleItemChange(index, "bottle_id", e.target.value)}>
                          {bottles.map((bottle) => (<option key={bottle.id} value={bottle.id}>{bottle.name}</option>))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Quantity</FormLabel>
                        <Input type="number" min={1} value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Price</FormLabel>
                        <Input type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} />
                      </FormControl>

                      <FormControl>
                        <FormLabel>{t("deal")}</FormLabel>
                        <HStack>
                          <Checkbox isChecked={Boolean(item.deal_enabled)} onChange={(e) => handleItemChange(index, "deal_enabled", e.target.checked)}>{t("deal")}</Checkbox>
                          {item.deal_enabled && <Input type="number" placeholder="Deal QTY" value={item.deal_amount} onChange={(e) => handleItemChange(index, "deal_amount", e.target.value)} width="120px" />}
                        </HStack>
                      </FormControl>

                      <FormControl>
                        <FormLabel>{t("discount")}</FormLabel>
                        <HStack>
                          <Checkbox isChecked={Boolean(item.discount_enabled)} onChange={(e) => handleItemChange(index, "discount_enabled", e.target.checked)}>{t("discount")}</Checkbox>
                          {item.discount_enabled && (
                            <>
                              <Select placeholder="Type" value={item.discount_type} onChange={(e) => handleItemChange(index, "discount_type", e.target.value)} width="140px">
                                <option value="fixed">Fixed</option>
                                <option value="percent">Percent</option>
                              </Select>
                              <Input type="number" placeholder="Amount" value={item.discount_value} onChange={(e) => handleItemChange(index, "discount_value", e.target.value)} width="100px" />
                            </>
                          )}
                        </HStack>
                      </FormControl>

                      {items.length > 1 && (
                        <Button mt={6} colorScheme="red" onClick={() => removeItem(index)}><BsFillTrash3Fill /></Button>
                      )}
                    </HStack>
                  </Box>
                ))}

                <Button colorScheme="blue" mb={5} onClick={addItem}>{t("add_row")}</Button>
              </VStack>

              <Box ref={mapRef} height="400px" mt={4}></Box>

              <HStack spacing={4} mt={6}>
                <Button type="button" as={ReactRouterLink} to={LOCATION_LIST_PATH} colorScheme="orange" flex={1}>{t("cancel")}</Button>
                <Button type="submit" isLoading={isSubmitting} loadingText="Saving Data..." colorScheme="teal" flex={1}>{t("save")}</Button>
              </HStack>
            </form>
          </CardBody>
        </Card>
      </Box>
    </>
  );
};

export default LocationCreate;
