import Card from "./Card";
import { motion } from "framer-motion";

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  className = "",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={`bg-gray-800 p-6 rounded-lg shadow-lg ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {trend && (
              <p
                className={`text-sm mt-2 ${
                  trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </p>
            )}
          </div>
          {icon && <div className="text-2xl">{icon}</div>}
        </div>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
