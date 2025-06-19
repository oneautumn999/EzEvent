import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Card,
  Chip,
} from "@heroui/react";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "../lib/axiosInstance";
import { format } from "date-fns";

const TransactionPage = () => {
  const { getToken } = useAuth();
  const axios = axiosInstance(getToken);
  const [transaction, setTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "settlement":
        return "success";
      case "pending":
        return "warning";
      case "failed":
      case "expire":
      case "cancel":
        return "danger";
      default:
        return "default";
    }
  };

  const totalTransaction = transaction.length;
  const totalPages = Math.ceil(totalTransaction / itemsPerPage);
  const displayedtransaction = transaction.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await axios.get("/transaction");
        setTransaction(res.data);
      } catch (error) {
        console.error("Failed to fetch transaction", error);
      }
    };
    fetchTransaction();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-start min-h-full bg-gray-900 p-4">
        <div className="space-y-6 w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-2xl font-bold">Daftar Transaksi</h2>
          </div>

          <Card className="bg-gray-800 text-white shadow-md rounded-lg">
            <div className="p-4">
              <Table
                aria-label="Transaction Table"
                className="text-white"
                isStriped
                removeWrapper
              >
                <TableHeader>
                  <TableColumn className="text-center font-bold text-gray-600 py-4">
                    ID Transaksi
                  </TableColumn>
                  <TableColumn className="text-center font-bold text-gray-600 py-4">
                    Event
                  </TableColumn>
                  <TableColumn className="text-center font-bold text-gray-600 py-4">
                    Nama
                  </TableColumn>
                  <TableColumn className="text-center font-bold text-gray-600 py-4">
                    Tanggal
                  </TableColumn>
                  <TableColumn className="text-center font-bold text-gray-600 py-4">
                    Harga
                  </TableColumn>
                  <TableColumn className="text-center font-bold text-gray-600 py-4">
                    Status
                  </TableColumn>
                  <TableColumn className="text-center font-bold text-gray-600 py-4">
                    Email
                  </TableColumn>
                  <TableColumn className="text-center font-bold text-gray-600 py-4">
                    Nomor Telepon
                  </TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent="Belum Ada Transaksi"
                  className="bg-gray-800 divide-y divide-gray-700"
                >
                  {displayedtransaction.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="text-center text-gray-400 py-10"
                        colSpan={8}
                      >
                        Belum Ada Transaksi
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedtransaction.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-gray-700"
                      >
                        <TableCell className="py-4 px-5 text-center text-white font-mono">
                          {transaction.order_id}
                        </TableCell>
                        <TableCell className="py-4 px-5 text-center text-white">
                          {transaction.event.name}
                        </TableCell>
                        <TableCell className="py-4 px-5 text-center text-white">
                          {transaction.name}
                        </TableCell>
                        <TableCell className="py-4 px-5 text-center text-white">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell className="py-4 px-5 text-center text-white font-medium">
                          {formatCurrency(transaction.gross_amount)}
                        </TableCell>
                        <TableCell className="py-4 px-5 text-center">
                          <div className="flex justify-center">
                            <Chip
                              color={getStatusColor(transaction.status)}
                              size="sm"
                              variant="flat"
                            >
                              {transaction.status || "Tidak diketahui"}
                            </Chip>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-5 text-center text-white">
                          {transaction.email}
                        </TableCell>
                        <TableCell className="py-4 px-5 text-center text-white">
                          {transaction.phone}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {transaction.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="default"
                    current={currentPage}
                    total={totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
