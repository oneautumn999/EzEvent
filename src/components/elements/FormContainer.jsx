import React, { useState } from "react";
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";

const FormComponent = (props) => {
  const { formFields, onSubmit, onChange, formValues, buttonText } = props;

  const [selectValues, setSelectValues] = useState({});

  const handleSelectionChange = (fieldName, isMultiple) => (e) => {
    const newValues = new Set(e.target.value.split(","));

    setSelectValues({
      ...selectValues,
      [fieldName]: newValues,
    });

    const syntheticEvent = {
      target: {
        name: fieldName,
        value: isMultiple
          ? Array.from(newValues)
          : Array.from(newValues)[0] || "",
      },
    };

    onChange(syntheticEvent);
  };

  return (
    <Form onSubmit={onSubmit} className="space-y-4">
      {formFields.map((field, index) => (
        <div key={index} className="w-full">
          {field.type === "select" ? (
            <div className="space-y-2">
              <Select
                id={field.name}
                label={field.label}
                placeholder={`Select ${field.label}`}
                selectedKeys={
                  selectValues[field.name] ||
                  (field.multiple
                    ? new Set(formValues[field.name] || [])
                    : formValues[field.name]
                    ? new Set([formValues[field.name]])
                    : new Set([]))
                }
                selectionMode={field.multiple ? "multiple" : "single"}
                onChange={handleSelectionChange(field.name, field.multiple)}
                className="w-full"
              >
                {field.options.map((option) => (
                  <SelectItem
                    key={option.value}
                    className="text-black data-[selected=true]:bg-blue-600"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          ) : (
            <Input
              name={field.name}
              value={formValues[field.name] || ""}
              onChange={onChange}
              placeholder={field.placeholder}
              type={field.type}
              label={field.label}
              isRequired={field.required}
              errorMessage={field.errorMessage}
              className="w-full"
            />
          )}
        </div>
      ))}
      <Button type="submit" color="primary" className="w-full">
        {buttonText || "Submit"}
      </Button>
    </Form>
  );
};

export default FormComponent;
