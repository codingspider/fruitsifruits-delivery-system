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

const RecentOrder = () => {
  return (
    <>
    <TableContainer>
        <Table size="sm">
            <Thead>
            <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
            </Tr>
            </Thead>
            <Tbody>
            <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
            </Tr>
            </Tbody>
            <Tfoot>
            <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
            </Tr>
            </Tfoot>
        </Table>
    </TableContainer>
    </>
  )
}

export default RecentOrder