const Card = ({ children, header, className = "", ...props }) => {
  return (
    <div
      className={`bg-black-800 p-6 rounded-lg shadow-lg ${className}`}
      {...props}
    >
      {header && (
        <div className="pb-4 mb-4 border-b border-gray-700">{header}</div>
      )}
      {children}
    </div>
  );
};

export default Card;
