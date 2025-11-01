// AssignmentForm.jsx
import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  Text,
  Stack,
  Divider,
  Checkbox,
  Textarea,
  FormControl,
  FormLabel,
  IconButton,
  useToast,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  HStack,
  SimpleGrid,
  TableContainer
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import SignaturePad from "react-signature-canvas";
import { useTranslation } from "react-i18next";
import api from "../../axios";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TASK_DETAILS_PATH } from "../../router";

const AssignmentForm = ({flavours, bottles, products, items}) => {
  const toast = useToast();
  const { id } = useParams();
  const { register, handleSubmit, reset } = useForm(); 
  const { t } = useTranslation(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);

  const [returns, setReturns] = useState([]);
  const [paid, setPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const navigate = useNavigate();

  const sigPadRef = useRef(null);

  // Fetch location products
  const fetchLocationProductsDetails = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/driver/location/products/details/${id}`);
      console.log(res);
      setLocation(res.data.data || null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Could not load location details",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const app_name = localStorage.getItem("app_name");
    document.title = `${app_name || "App"} | Assign Task`;
    fetchLocationProductsDetails();
  }, [id]);

  // Initialize flavours
  useEffect(() => {
    if (!location?.location_flavours) return;
    const mapped = location.location_flavours.map((lf) => ({
      id: lf.id,
      location_id: lf.location_id,
      flavour_id: lf.flavour_id,
      bottle_id: lf.bottle_id,
      product_id: lf.product_id,
      specific_quantity: Number(lf.specific_quantity || 0),
      deal_quantity: Number(lf.deal_quantity || 0),
      price: Number(lf.price || 0),
      sub_total: Number(lf.sub_total || 0),
      flavour: lf.flavour,
      bottle: lf.bottle,
      remaining: Number(lf.remaining ?? 0),
    }));
    setFlavours(mapped);
  }, [location]);

  // flavour & bottle options
  const flavourOptions = useMemo(() => {
    const uniq = [];
    (flavours || []).forEach((lf) => {
      if (lf.flavour && !uniq.find((u) => u.id === lf.flavour.id)) uniq.push(lf.flavour);
    });
    return uniq;
  }, [location]);

  const bottleOptions = useMemo(() => {
    const uniq = [];
    (bottles || []).forEach((lf) => {
      if (lf.bottle && !uniq.find((u) => u.id === lf.bottle.id)) uniq.push(lf.bottle);
    });
    return uniq;
  }, [location]);

  // Add new juice
  const addJuiceInline = () => {
    setFlavours((prev) => [
      ...prev,
      {
        id: `new_${Date.now()}`,
        location_id: location?.id ?? null,
        flavour_id: null,
        bottle_id: null,
        product_id: null,
        specific_quantity: 0,
        deal_quantity: 0,
        price: 0,
        flavour: null,
        bottle: null,
        remaining: 0,
      },
    ]);
  };

  const removeFlavour = (id) => {
    setFlavours((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFlavourChange = (idx, field, value) => {
    setFlavours((prev) => {
      const copy = [...prev];
      const row = { ...copy[idx] };

      if (field === "flavour_id") {
        const f = flavourOptions.find((fl) => fl.id === Number(value));
        row.flavour_id = value ? Number(value) : null;
        row.flavour = f || null;
      } else if (field === "bottle_id") {
        const b = bottleOptions.find((bo) => bo.id === Number(value));
        row.bottle_id = value ? Number(value) : null;
        row.bottle = b || null;
      } else if (field === "remaining") {
        row.remaining = Number(value || 0);
      } else if (field === "price") {
        row.price = Number(value || 0);
      }

      // Calculate To Be Filled automatically
      row.toBeFilled = Math.max((row.specific_quantity || 0) - (row.remaining || 0), 0);

      // sub_total
      row.sub_total = Number((row.price || 0) * (row.toBeFilled || 0));

      copy[idx] = row;
      return copy;
    });
  };

  // Returns
  const addReturnRow = () => setReturns((r) => [...r, { id: `r_${Date.now()}`, flavour_id: null, bottle_id: null, qty: 1 }]);
  const removeReturnRow = (id) => setReturns((r) => r.filter((x) => x.id !== id));
  const handleReturnChange = (idx, field, value) => {
    setReturns((prev) => {
      const copy = [...prev];
      const row = { ...copy[idx] };
      if (field === "flavour_id") row.flavour_id = value ? Number(value) : null;
      else if (field === "bottle_id") row.bottle_id = value ? Number(value) : null;
      else if (field === "qty") row.qty = Number(value || 0);
      copy[idx] = row;
      return copy;
    });
  };

  // Calculations
  const subtotal = useMemo(() => flavours.reduce((s, f) => s + (f.price || 0) * (f.toBeFilled || 0), 0), [flavours]);

  const returnDeduction = useMemo(() => {
    let total = 0;
    for (const r of returns) {
      if (!r.flavour_id) continue;
      const match = flavours.find((f) => f.flavour_id === r.flavour_id);
      let unitCost = match?.price || 0;
      total += unitCost * (r.qty || 0);
    }
    return total;
  }, [returns, flavours]);

  const taxAmount = useMemo(() => {
    const taxType = location?.tax_type;
    const taxVal = Number(location?.tax_amount || 0);
    if (taxType === "percentage") return ((subtotal - returnDeduction) * taxVal) / 100;
    return taxVal;
  }, [location, subtotal, returnDeduction]);

  const grandTotal = subtotal - returnDeduction + taxAmount;

  const clearSignature = () => sigPadRef.current?.clear();
  const getSignatureDataURL = () => (sigPadRef.current?.isEmpty() ? null : sigPadRef.current.getCanvas().toDataURL("image/png"));

  // Submit
  const onSubmit = async () => {
    const payload = {
      location_id: location?.id,
      route_id: location?.route.id,
      flavours: flavours.map((f) => ({
        id: f.id,
        flavour_id: f.flavour_id,
        bottle_id: f.bottle_id,
        product_id: f.product_id,
        remaining: f.remaining,
        toBeFilled: f.toBeFilled,
        price: f.price,
        sub_total: f.sub_total,
      })),
      returns: returns.map((r) => ({ flavour_id: r.flavour_id, bottle_id: r.bottle_id, qty: r.qty })),
      payment: { paid, method: paymentMethod },
      remarks,
      signature: getSignatureDataURL(),
      totals: { subtotal, returnDeduction, taxAmount, grandTotal },
    };

    try {
      setIsSubmitting(true);
      console.log(payload);
      const res = await api.post(`/driver/save/sell/data`, payload);
      toast({ title: "Success",position: "bottom-right", description: "Assignment submitted", status: "success" });
      navigate(TASK_DETAILS_PATH)
    } catch (err) {
      toast({ title: "Submit failed", position: "bottom-right",description: err?.response?.data?.message || err.message, status: "error" });
    }finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Box textAlign="center"><Spinner size="lg" /></Box>;

  return (
    <>
      <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Location Card */}
              <Card mb={6}>
                <CardBody>
                  <Heading textAlign="center">{location?.name || "—"}</Heading>
                  <Stack spacing={2} textAlign="center" mt={4}>
                    <Text><strong>{t('assigned_date')}:</strong> </Text>
                    <Text><strong>{t('day_of_week')}:</strong> </Text>
                    <Text><strong>{t('status')}:</strong> <Text as="span" color="orange.500">{location.status}</Text></Text>
                  </Stack>
                </CardBody>
              </Card>

              {/* Flavours Table */}
              <Card mb={6}>
                <CardHeader><Text color="green.600" fontWeight="bold">{t('flavors_for_location')}</Text></CardHeader>
                <CardBody>
                  <Box overflowX={{ base: "scroll", md: "auto" }}>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>{t('flavor')}</Th>
                            <Th>{t('required')}</Th>
                            <Th>{t('remaining')}</Th>
                            <Th>{t('to_be_filled')}</Th>
                            <Th>{t('price')}</Th>
                            <Th>{t('total')}</Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {flavours.map((f, idx) => (
                            <Tr key={f.id}>
                              <Td>
                                {f.flavour?.name ?? (
                                  <Select placeholder="Select flavor" value={f.flavour_id || ""} onChange={(e) => handleFlavourChange(idx, "flavour_id", e.target.value)}>
                                    {flavourOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                  </Select>
                                )}
                              </Td>
                              <Td>{f.specific_quantity ?? "—"}</Td>
                              <Td>
                                <Input
                                  size="sm"
                                  value={f.remaining}
                                  onChange={(e) => handleFlavourChange(idx, "remaining", e.target.value)}
                                />
                              </Td>
                              <Td>{f.toBeFilled}</Td>
                              <Td>
                                <Input
                                  size="sm"
                                  value={f.price}
                                  onChange={(e) => handleFlavourChange(idx, "price", e.target.value)}
                                />
                              </Td>
                              <Td>{f.sub_total}</Td>
                              <Td><IconButton size="sm" colorScheme="red" aria-label="remove" icon={<CloseIcon />} onClick={() => removeFlavour(f.id)} /></Td>
                            </Tr>
                          ))}
                        </Tbody>
                        <Tfoot>
                          <Tr>
                            <Th colSpan={5} textAlign="right">{t('total_to_fill')}:</Th>
                            <Th>{flavours.reduce((acc, r) => acc + (r.toBeFilled || 0), 0)}</Th>
                            <Th />
                          </Tr>
                        </Tfoot>
                      </Table>
                    </TableContainer>
                  </Box>

                  <Flex gap={3} mt={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
                    <Button colorScheme="blue" onClick={addJuiceInline}>{t('add_juice_listed')}</Button>
                    <Button colorScheme="blue" onClick={addReturnRow}>{t('add_return')}</Button>
                  </Flex>
                </CardBody>
              </Card>

              {/* Returns Table */}
              <Card mb={6}>
                <CardHeader><Text fontWeight="bold">{t('returns')}</Text></CardHeader>
                <CardBody>
                  <Stack spacing={3}>
                    {returns.length === 0 && <Text fontSize="sm" color="gray.500">No returns added</Text>}
                    {returns.map((r, idx) => (
                      <Flex
                        key={r.id}
                        gap={2}
                        align="center"
                        flexWrap={{ base: "wrap", md: "nowrap" }}
                        width="100%"
                      >
                        <Select
                          placeholder="Select Flavor"
                          value={r.flavour_id || ""}
                          onChange={(e) => handleReturnChange(idx, "flavour_id", e.target.value)}
                          flex={{ base: "1 1 100%", md: "auto" }}
                        >
                          {flavourOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </Select>

                        <Select
                          placeholder="Select Bottle"
                          value={r.bottle_id || ""}
                          onChange={(e) => handleReturnChange(idx, "bottle_id", e.target.value)}
                          flex={{ base: "1 1 100%", md: "auto" }}
                        >
                          {bottleOptions.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </Select>

                        <Input
                          type="number"
                          min={0}
                          value={r.qty}
                          onChange={(e) => handleReturnChange(idx, "qty", e.target.value)}
                          flex={{ base: "1 1 100%", md: "0 0 80px" }}
                        />

                        <IconButton aria-label="remove-return" icon={<CloseIcon />} colorScheme="red" />
                      </Flex>
                    ))}
                  </Stack>
                </CardBody>
              </Card>

              {/* Totals */}
              <Card mb={6}>
                <CardBody>
                  <Stack spacing={2}>
                    <Flex justify="space-between"><Text>Total (Subtotal):</Text><Text>{subtotal.toFixed(2)}</Text></Flex>
                    <Flex justify="space-between"><Text>Return Deduction:</Text><Text>- {returnDeduction.toFixed(2)}</Text></Flex>
                    <Flex justify="space-between"><Text>Tax ({location?.tax_type || "—"}):</Text><Text>{taxAmount.toFixed(2)}</Text></Flex>
                    <Divider />
                    <Flex justify="space-between" fontWeight="bold"><Text>Total (Including Tax)</Text><Text>{grandTotal.toFixed(2)}</Text></Flex>
                  </Stack>
                </CardBody>
              </Card>

              {/* Payment & Remarks */}
              <Card mb={6}>
                <CardHeader><Text color="green.600" fontWeight="bold">Payment & Remarks</Text></CardHeader>
                <CardBody>
                  <Checkbox isChecked={paid} onChange={(e) => setPaid(e.target.checked)} mb={3}>Paid?</Checkbox>
                  <FormControl mb={3}>
                    <FormLabel>Payment Method</FormLabel>
                    <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option>Cash</option>
                      <option>Card</option>
                      <option>Mobile</option>
                      <option>Other</option>
                    </Select>
                  </FormControl>
                  <FormControl mb={3}>
                    <FormLabel>Remarks</FormLabel>
                    <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks..." />
                  </FormControl>
                </CardBody>
              </Card>

              {/* Signature */}
              <Card mb={6}>
                <CardHeader><Text color="green.600" fontWeight="bold">Client Signature</Text></CardHeader>
                <CardBody>
                  <Box border="1px" borderColor="gray.300" p={2} w="100%" overflowX="auto">
                    <SignaturePad ref={sigPadRef} canvasProps={{ width: 1000, height: 220, className: "sigCanvas" }} />
                  </Box>
                  <Flex gap={3} mt={3}>
                    <Button onClick={clearSignature} colorScheme="gray">Clear Signature</Button>
                  </Flex>
                </CardBody>
              </Card>

              {/* Submit */}
              <HStack spacing={4} mt={6} flexWrap={{ base: "wrap", md: "nowrap" }}>
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

    </>
  );
};

export default AssignmentForm;
