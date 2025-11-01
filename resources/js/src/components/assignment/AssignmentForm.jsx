import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SignaturePad from "react-signature-canvas";
import api from "../../axios";
import { useForm } from "react-hook-form";
import { ASSIGN_TASK_PATH, TASK_DETAILS_PATH } from "../../router";

// child components
import AssignmentLocationCard from "./AssignmentLocationCard";
import AssignmentFlavoursTable from "./AssignmentFlavoursTable";
import AssignmentReturnsTable from "./AssignmentReturnsTable";
import AssignmentTotals from "./AssignmentTotals";
import AssignmentPaymentRemarks from "./AssignmentPaymentRemarks";
import AssignmentSignature from "./AssignmentSignature";

const AssignmentForm = ({ flavours, bottles, products, items, location }) => {
  const { handleSubmit } = useForm();
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const { t } = useTranslation();

  const sigPadRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flavourData, setFlavourData] = useState([]);
  const [returns, setReturns] = useState([]);
  const [paid, setPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [route_location, setRouteLocation] = useState("");

  const fetchLocationProductsDetails = async () => {
    try {
      const res = await api.get(`/driver/location/products/details/${id}`);
      setRouteLocation(res.data.data || null);
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
    document.title = `${localStorage.getItem("app_name") || "App"} | Assign Task`;
    fetchLocationProductsDetails();
  }, [id]);

  // Initialize data from location
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
      toBeFilled: Math.max(
        (lf.specific_quantity || 0) - (lf.remaining || 0),
        0
      ),
    }));
    setFlavourData(mapped);
  }, [location]);

  // Calculations
  const subtotal = useMemo(
    () => flavourData.reduce((s, f) => s + (f.price || 0) * (f.toBeFilled || 0), 0),
    [flavourData]
  );

  const returnDeduction = useMemo(() => {
    let total = 0;
    for (const r of returns) {
      const match = flavourData.find((f) => f.flavour_id === r.flavour_id);
      total += (match?.price || 0) * (r.qty || 0);
    }
    return total;
  }, [returns, flavourData]);

  const taxAmount = useMemo(() => {
    const taxType = location?.tax_type;
    const taxVal = Number(location?.tax_amount || 0);
    if (taxType === "percentage")
      return ((subtotal - returnDeduction) * taxVal) / 100;
    return taxVal;
  }, [location, subtotal, returnDeduction]);

  const grandTotal = subtotal - returnDeduction + taxAmount;

  // helpers
  const getSignatureDataURL = () =>
    sigPadRef.current?.isEmpty()
      ? null
      : sigPadRef.current.getCanvas().toDataURL("image/png");

  // submit handler
  const onSubmit = async () => {
    const payload = {
      location_id: location?.id,
      route_id: route_location.id,
      flavours: flavourData.map((f) => ({
        id: f.id,
        flavour_id: f.flavour_id,
        bottle_id: f.bottle_id,
        product_id: f.product_id,
        remaining: f.remaining,
        toBeFilled: f.toBeFilled,
        price: f.price,
        sub_total: f.sub_total,
      })),
      returns: returns.map((r) => ({
        flavour_id: r.flavour_id,
        bottle_id: r.bottle_id,
        qty: r.qty,
      })),
      payment: { paid, method: paymentMethod },
      remarks,
      signature: getSignatureDataURL(),
      totals: { subtotal, returnDeduction, taxAmount, grandTotal },
    };

    try {
      setIsSubmitting(true);
      await api.post(`/driver/save/sell/data`, payload);
      toast({
        title: "Success",
        description: "Assignment submitted",
        status: "success",
        position: "bottom-right",
      });
      navigate(ASSIGN_TASK_PATH);
    } catch (err) {
      toast({
        title: "Submit failed",
        description: err?.response?.data?.message || err.message,
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Box textAlign="center"><Spinner size="lg" /></Box>;

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AssignmentLocationCard location={location} route_location={route_location} t={t} />

          <AssignmentFlavoursTable
            flavours={flavours}
            products={products}
            flavourData={flavourData}
            setFlavourData={setFlavourData}
            location={location}
            t={t}
          />

          <AssignmentReturnsTable
            products={products}
            returns={returns}
            flavours={flavours}
            bottles={bottles}
            setReturns={setReturns}
            location={location}
            t={t}
          />

          <AssignmentTotals
            subtotal={subtotal}
            returnDeduction={returnDeduction}
            taxAmount={taxAmount}
            grandTotal={grandTotal}
            location={location}
            t={t}
          />

          <AssignmentPaymentRemarks
            paid={paid}
            setPaid={setPaid}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            remarks={remarks}
            setRemarks={setRemarks}
          />

          <AssignmentSignature sigPadRef={sigPadRef} />

          <HStack mt={6}>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Saving..."
              colorScheme="teal"
              flex={1}
            >
              {t("save")}
            </Button>
          </HStack>
        </form>
      </CardBody>
    </Card>
  );
};

export default AssignmentForm;
