import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Card,
} from "@heroui/react";
import ButtonFilled from "../components/elements/ButtonFilled";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CategoryForm from "../components/form/CategoryForm";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "../lib/axiosInstance";
import Swal from "sweetalert2";

const CategoryPage = () => {
  const { getToken } = useAuth();
  const axios = axiosInstance(getToken);
  const [category, setCategory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [backdrop, setBackdrop] = useState("blur");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalCategoryItems = category.length;
  const totalPages = Math.ceil(totalCategoryItems / itemsPerPage);
  const displayedCategory = category.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get("/category");
        setCategory(res.data);
      } catch (error) {
        console.error("Failed to fetch Category", error);
      }
    };
    fetchCategory();
  }, []);

  const openModal = (category = null) => {
    setIsEditMode(!!category);
    setCurrentCategory(category);
    setIsModalOpen(true);
    setBackdrop(backdrop);
  };

  const closeModal = () => setIsModalOpen(false);

  // const handleFormSubmit = async (formData) => {
  //   try {
  //     const res = await axios.post("/category", formData);
  //     setCategory((prevCategory) => [...prevCategory, res.data]);
  //     closeModal();
  //   } catch (error) {
  //     console.error("Failed to create Category", error);
  //   }
  // };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditMode) {
        const res = await axios.put(
          `/category/${currentCategory.id}`,
          formData
        );
        setCategory((prevCategory) =>
          prevCategory.map((cat) =>
            cat.id === currentCategory.id ? res.data : cat
          )
        );
      Swal.fire({
        icon: "success",
        title: "Category Updated",
        text: "Category Success Updated",
        confirmButtonColor: "#3085d6"
      });
      } else {
        const res = await axios.post("/category", formData);
        setCategory((prevCategory) => [...prevCategory, res.data]);
        Swal.fire({
          icon: "success",
          title: "Category Created",
          text: "Category Success Created",
          confirmButtonColor: "#3085d6"
        });
      }
      closeModal();
    } catch (error) {
      console.error(
        isEditMode ? "Failed to update Category" : "Failed to create Category",
        error
      );
      Swal.fire({
        icon: "success",
        title: "Event Created",
        text: isEditMode ? "Failed to update Category" : "Failed to create Category",
        confirmButtonColor: "#d33"
      });
    }
  };

  const handleDeleteCategory = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/category/${id}`);
        setCategory((prevCategory) =>
          prevCategory.filter((category) => category.id !== id)
        );
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The category has been deleted.",
          confirmButtonColor: "#3085d6",
        });
      } catch (error) {
        console.error("Failed to delete Category", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete the category. Please try again.",
          confirmButtonColor: "#d33",
        });
      }
    }
  });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-start min-h-full bg-gray-900 p-4">
        <div className="space-y-6 w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-2xl font-bold">Daftar Kategori</h2>
            <ButtonFilled onClick={() => openModal()} endContent={<FaPlus />}>
              Tambah Kategori Event
            </ButtonFilled>
          </div>

          <Card className="bg-gray-800 text-white shadow-md rounded-lg">
            <div className="p-4">
              <Table
                aria-label="kategori Tabel"
                className="text-white"
                isStriped
                removeWrapper
              >
                <TableHeader>
                  <TableColumn className="text-center font-bold text-gray-600">
                    Nama Kategori
                  </TableColumn>
                  <TableColumn className="text-center font-bold text-gray-600">
                    Aksi
                  </TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent="Belum Ada Kategori"
                  className="bg-gray-800 divide-y divide-gray-700"
                >
                  {displayedCategory.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="text-center text-gray-400 py-8"
                        colSpan={2}
                      >
                        Belum Ada Kategori
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedCategory.map((category) => (
                      <TableRow key={category.id} className="hover:bg-gray-700">
                        <TableCell className="py-4 px-6 text-white text-center">
                          {category.name}
                        </TableCell>
                        <TableCell className="py-4 px-6 flex justify-center gap-3">
                          <ButtonFilled
                            color="gray"
                            variant="flat"
                            onClick={() => openModal(category)}
                            startContent={<FaEdit />}
                            className="min-w-[100px]"
                          >
                            Edit
                          </ButtonFilled>
                          <ButtonFilled
                            color="red"
                            variant="flat"
                            onClick={() => handleDeleteCategory(category.id)}
                            startContent={<FaTrash />}
                            className="min-w-[100px]"
                          >
                            Delete
                          </ButtonFilled>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {category.length > itemsPerPage && (
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

          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            contentlabel="Tambah Kategori"
            className="modal-content"
            overlayclass="modal-overlay"
            backdrop={backdrop}
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 text-white">
                {isEditMode ? "Edit Kategori" : "Tambahkan Kategori Baru"}
              </ModalHeader>
              <ModalBody>
                <CategoryForm
                  onSubmit={handleFormSubmit}
                  initialValues={isEditMode ? currentCategory : {}}
                />
              </ModalBody>
              <ModalFooter>
                {/* <ButtonFilled
                  color="red"
                  variant="light"
                  onClick={closeModal}
                  className="close-button"
                >
                  Close
                </ButtonFilled> */}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
