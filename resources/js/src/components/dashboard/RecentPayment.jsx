import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
 } from '@chakra-ui/react';

const RecentPayment = () => {
  return (
    <>
    <TableContainer>
            <Table size="sm">
              {/* second table rows */}
              <Thead>
                <Tr>
                  <Th>Item</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Example</Td>
                  <Td>123</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
    </>
  )
}

export default RecentPayment