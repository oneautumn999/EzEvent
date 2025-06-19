import React, { useState } from "react";
import FormComponent from "../elements/FormContainer";

const CategoryForm = ({ onSubmit }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const formFields = [
    {
      name: "name",
      type: "text",
      label: "Nama Kategori",
      placeholder: "Masukkan Nama Kategori",
      required: true,
      errorMessage: "Nama Kategori wajib diisi",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
    setFormValues({ name: "" });
  };

  return (
    <FormComponent
      formFields={formFields}
      onSubmit={handleSubmit}
      onChange={handleChange}
      formValues={formValues}
      buttonText="Edit Kategori"
    />
  );
};

export default CategoryForm;
