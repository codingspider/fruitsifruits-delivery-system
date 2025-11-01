import { Card, CardBody, Divider, Flex, Stack, Text } from "@chakra-ui/react";

const AssignmentTotals = ({ subtotal, returnDeduction, taxAmount, grandTotal, location, t }) => (
  <Card mb={6}>
    <CardBody>
      <Stack spacing={2}>
        <Flex justify="space-between"><Text>Total (Subtotal):</Text><Text>{subtotal.toFixed(2)}</Text></Flex>
        <Flex justify="space-between"><Text>Return Deduction:</Text><Text>- {returnDeduction.toFixed(2)}</Text></Flex>
        <Flex justify="space-between"><Text>Tax ({location?.tax_type || "—"}):</Text><Text>{taxAmount.toFixed(2)}</Text></Flex>
        <Divider />
        <Flex justify="space-between" fontWeight="bold"><Text>Grand Total:</Text><Text>{grandTotal.toFixed(2)}</Text></Flex>
      </Stack>
    </CardBody>
  </Card>
);

export default AssignmentTotals;
