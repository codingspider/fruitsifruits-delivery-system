import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Select,
  Input,
  IconButton,
  Text,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const AssignmentReturnsTable = ({ returns, setReturns, flavours, bottles, products, t }) => {

  const handleChange = (idx, field, value) => {
    setReturns((prev) => {
      const copy = [...prev];
      const row = { ...copy[idx] };

      if (field === "product_id") {
        row.product_id = Number(value); // convert string to number
        // Update price from selected product
        const product = products.find(p => p.id === Number(value));
        row.price = product ? product.price || 0 : 0;
      } else if (field === "qty") {
        row.qty = Number(value);
      } else if (field === "flavour_id") {
        row.flavour_id = Number(value);
      } else if (field === "bottle_id") {
        row.bottle_id = Number(value);
      }

      copy[idx] = row;
      return copy;
    });
  };

  const addRow = () =>
    setReturns((prev) => [
      ...prev,
      { id: `r_${Date.now()}`, product_id: "", flavour_id: "", bottle_id: "", qty: 1, price: 0 },
    ]);

  const removeRow = (id) =>
    setReturns((prev) => prev.filter((x) => x.id !== id));

  return (
    <Card mb={6}>
      <CardHeader fontWeight="bold" fontSize="lg">
        {t("returns")}
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {returns.length === 0 && (
            <Text fontSize="sm" color="gray.500">
              No returns added
            </Text>
          )}

          {returns.map((r, idx) => (
            <Grid
              key={r.id}
              templateColumns={{
                base: "1fr 1fr 1fr 1fr auto",
                md: "2fr 2fr 2fr 1fr 60px",
              }}
              gap={3}
              alignItems="center"
            >
              {/* Product */}
              <GridItem>
                <Select
                  placeholder="Select Product"
                  value={r.product_id || ""}
                  onChange={(e) =>
                    handleChange(idx, "product_id", e.target.value)
                  }
                >
                  {products.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
              </GridItem>

              {/* Flavour */}
              <GridItem>
                <Select
                  placeholder="Select Flavor"
                  value={r.flavour_id || ""}
                  onChange={(e) =>
                    handleChange(idx, "flavour_id", e.target.value)
                  }
                >
                  {flavours.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
              </GridItem>

              {/* Bottle */}
              <GridItem>
                <Select
                  placeholder="Select Bottle"
                  value={r.bottle_id || ""}
                  onChange={(e) =>
                    handleChange(idx, "bottle_id", e.target.value)
                  }
                >
                  {bottles.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
              </GridItem>

              {/* Quantity + Price */}
              <GridItem>
                <HStack>
                  <Input
                    type="number"
                    min={0}
                    value={r.qty}
                    onChange={(e) => handleChange(idx, "qty", e.target.value)}
                    placeholder="Qty"
                  />
                </HStack>
              </GridItem>

              {/* Remove */}
              <GridItem>
                <IconButton
                  icon={<CloseIcon />}
                  colorScheme="red"
                  aria-label="Remove"
                  size="sm"
                  onClick={() => removeRow(r.id)}
                />
              </GridItem>
            </Grid>
          ))}

          <HStack justify="flex-end">
            <Button colorScheme="blue" onClick={addRow}>
              + Add Return
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default AssignmentReturnsTable;
