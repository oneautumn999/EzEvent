import { Input } from "@heroui/react";
import { FaSearchLocation } from "react-icons/fa";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      {/* <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      /> */}
      <Input
        placeholder="Type to search..."
        startContent={<FaSearchLocation size={18} type="search" />}
      />
    </div>
  );
};

export default SearchBar;
