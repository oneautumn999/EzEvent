import { Button } from "@heroui/react";

const ButtonFilled = (props) => {
  const {
    children,
    type = "button",
    variant = "solid",
    color = "blue",
    radius = "md",
    disabled = false,
    icon,
    className = "",
    endContent,
    onClick,
    ...rest
  } = props;

  const customColor = {
    blue: {
      solid: "bg-blue-600 hover:bg-blue-700 text-white",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    },
    green: {
      solid: "bg-green-600 hover:bg-green-700 text-white",
      outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
    },
    red: {
      solid: "bg-red-500 hover:bg-red-700 text-white",
      outline: "border-2 border-red-600 text-red-600 hover:bg-red-50",
    },
    gray: {
      solid: "bg-gray-600 hover:bg-gray-700 text-white",
      outline: "border-2 border-gray-600 text-gray-600 hover:bg-gray-50",
    },
    black: {
      solid: "bg-black hover:bg-gray-800 text-white",
      outline: "border-2 border-gray-600 text-gray-600 hover:bg-gray-50",
    },
  };

  const borderRadius = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const padding = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const selectedColor = customColor[color] || customColor.blue;
  const style = selectedColor[variant] || selectedColor.solid;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${style}
        ${borderRadius[radius]} 
        ${padding[radius]}
        font-semibold
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          color === "blue" ? "focus:ring-blue-500" : ""
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...rest}
    >
      <span className="flex items-center justify-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
        {endContent}
      </span>
    </button>
  );
};

export default ButtonFilled;
