import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  Textarea,
} from "@chakra-ui/react";

const AssignmentPaymentRemarks = ({
  paid,
  setPaid,
  paymentMethod,
  setPaymentMethod,
  remarks,
  setRemarks,
}) => (
  <Card mb={6}>
    <CardHeader color="green.600" fontWeight="bold">Payment & Remarks</CardHeader>
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
);

export default AssignmentPaymentRemarks;
