import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  IconButton,
  Button,
  Flex,
  TableContainer,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const AssignmentFlavoursTable = ({ flavours, flavourData, setFlavourData, products, t }) => {
  const handleChange = (idx, field, value) => {
    setFlavourData(prev => {
      const copy = [...prev];
      const row = { ...copy[idx], [field]: value };
      if (field === "remaining" || field === "price") {
        row.toBeFilled = Math.max((row.specific_quantity || 0) - (row.remaining || 0), 0);
        row.sub_total = Number(row.price || 0) * Number(row.toBeFilled || 0);
      }
      copy[idx] = row;
      return copy;
    });
  };

  const removeRow = (id) => setFlavourData(prev => prev.filter(f => f.id !== id));

  const addRow = () => setFlavourData(prev => [...prev, {
    id: `new_${Date.now()}`, flavour_id: null, bottle_id: null, price: 0,
    remaining: 0, specific_quantity: 0, toBeFilled: 0, sub_total: 0,
  }]);

  return (
    <Card mb={6}>
      <CardHeader fontWeight="bold" color="green.600">{t("flavors_for_location")}</CardHeader>
      <CardBody>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>{t("product")}</Th>
                <Th>{t("flavor")}</Th>
                <Th>{t("required")}</Th>
                <Th>{t("remaining")}</Th>
                <Th>{t("to_be_filled")}</Th>
                <Th>{t("price")}</Th>
                <Th>{t("total")}</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {flavourData.map((f, idx) => (
                <Tr key={f.id}>
                    <Td>
                        <Select
                      value={f.product_id || ""}
                      onChange={(e) => handleChange(idx, "product_id", Number(e.target.value))}
                    >
                      <option value="">Select</option>
                      {products.map(opt => opt && (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </Select>
                    </Td>
                  <Td>
                    
                    <Select
                      value={f.flavour_id || ""}
                      onChange={(e) => handleChange(idx, "flavour_id", Number(e.target.value))}
                    >
                      <option value="">Select</option>
                      {flavours.map(opt => opt && (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </Select>
                  </Td>
                  <Td>{f.specific_quantity}</Td>
                  <Td>
                    <Input value={f.remaining} onChange={(e) => handleChange(idx, "remaining", Number(e.target.value))} />
                  </Td>
                  <Td>{f.toBeFilled}</Td>
                  <Td>
                    <Input value={f.price} onChange={(e) => handleChange(idx, "price", Number(e.target.value))} />
                  </Td>
                  <Td>{f.sub_total.toFixed(2)}</Td>
                  <Td><IconButton size="sm" colorScheme="red" icon={<CloseIcon />} onClick={() => removeRow(f.id)} /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex mt={4}>
          <Button colorScheme="blue" onClick={addRow}>+ Add Row</Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AssignmentFlavoursTable;
