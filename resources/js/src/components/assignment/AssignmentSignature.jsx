import { Box, Button, Card, CardBody, CardHeader, Flex, Text } from "@chakra-ui/react";
import SignaturePad from "react-signature-canvas";

const AssignmentSignature = ({ sigPadRef }) => {
  const clear = () => sigPadRef.current?.clear();

  return (
    <Card mb={6}>
      <CardHeader color="green.600" fontWeight="bold">Client Signature</CardHeader>
      <CardBody>
        <Box border="1px" borderColor="gray.300" p={2} overflowX="auto">
          <SignaturePad
            ref={sigPadRef}
            canvasProps={{ width: 1000, height: 220, className: "sigCanvas" }}
          />
        </Box>
        <Flex mt={3}>
          <Button onClick={clear} colorScheme="gray">Clear Signature</Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AssignmentSignature;
