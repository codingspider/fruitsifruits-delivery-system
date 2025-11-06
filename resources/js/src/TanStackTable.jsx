import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Input,
  Button,
  Box,
  Spinner,
} from "@chakra-ui/react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Link as ReactRouterLink } from "react-router-dom";

// ✅ Fuzzy global filter (case-insensitive)
function fuzzyGlobalFilter(row, columnId, filterValue) {
  if (!filterValue) return true;
  const search = filterValue.toLowerCase();

  // skip "actions" column
  if (columnId === "actions") return true;

  const value = row.getValue(columnId);
  if (value == null) return false;

  return String(value).toLowerCase().includes(search);
}

export default function TanStackTable({
  columns,
  data,
  pageIndex,
  pageSize,
  setPageIndex,
  pageCount,
  isLoading,
  addURL,
  hideAddBtn="false"
}) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) =>
      setPageIndex(typeof updater === "function" ? updater({ pageIndex }).pageIndex : updater.pageIndex),
    manualPagination: true,
    pageCount,
    globalFilterFn: fuzzyGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { t } = useTranslation();

  return (
    <Box>
      {/* Global Search */}
      <Flex mb={4} justifyContent="space-between">
        <Input
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          maxW="250px"
        />

        {hideAddBtn && hideAddBtn == 'false' ? (
          <Button
            colorScheme="teal"
            as={ReactRouterLink}
            to={addURL}
            display={{ base: "none", md: "inline-flex" }}
            px={4}
            py={2}
            whiteSpace="normal"
            textAlign="center"

          >
            {t("add")}
          </Button>
        ) : ('')}
        
      </Flex>

      {/* Table */}
      <Box overflowX="auto">
        <Table variant="striped" size="sm">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={columns.length} textAlign="center">
                  <Spinner size="sm" />
                </Td>
              </Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Flex justify="flex-end" align="center" gap={2} mt={4}>
        <Button
          size="sm"
          onClick={() => setPageIndex(pageIndex - 1)}
          isDisabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <Box>
          Page {pageIndex + 1} of {pageCount}
        </Box>
        <Button
          size="sm"
          onClick={() => setPageIndex(pageIndex + 1)}
          isDisabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
}
