import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "../lib/axiosInstance";
import { FaCalendar, FaUsers, FaMoneyBill } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import { Card } from "@heroui/react";
import { set } from "date-fns";

const DashboardPage = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const axios = axiosInstance(getToken);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const [event, setEvent] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [guestChartData, setGuestChartData] = useState(null);
  const [revenueChartData, setRevenueChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [eventsRes, transactionsRes] = await Promise.all([
          axios.get("/event"),
          axios.get("/transaction"),
        ]);
        const eventList = eventsRes.data || [];
        const transactionList = transactionsRes.data || [];

        setEvent(eventList);
        setTransaction(transactionList);

        prepareChartData(eventList, transactionList);
      } catch (error) {
        console.error("Failed to fetch transaction", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Prepare chart data using both events and transactions
  const prepareChartData = (eventList, transactionList) => {
    if (eventList.length === 0) return;

    // Create lookup map for event names by ID
    const eventMap = {};
    eventList.forEach((event) => {
      eventMap[event.id] = event.name || "Unnamed Event";
    });

    // Initialize data with all events (even those with no transactions)
    const eventData = {};
    eventList.forEach((event) => {
      eventData[event.name || "Unnamed Event"] = {
        revenue: 0,
        guestCount: 0,
      };
    });

    // Add transaction data
    transactionList.forEach((transaction) => {
      const eventName = transaction.event?.name || "Unnamed Event";
      const amount = transaction.gross_amount || 0;

      if (eventData[eventName]) {
        eventData[eventName].revenue += amount;
        eventData[eventName].guestCount += 1;
      } else {
        eventData[eventName] = {
          revenue: amount,
          guestCount: 1,
        };
      }
    });

    // Prepare chart data
    const labels = Object.keys(eventData);
    const revenueValues = labels.map(
      (eventName) => eventData[eventName].revenue
    );
    const guestCountValues = labels.map(
      (eventName) => eventData[eventName].guestCount
    );

    const backgroundColors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
      "rgba(199, 199, 199, 0.6)",
      "rgba(83, 102, 255, 0.6)",
      "rgba(78, 205, 196, 0.6)",
      "rgba(244, 157, 26, 0.6)",
    ];

    const borderColors = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(199, 199, 199, 1)",
      "rgba(83, 102, 255, 1)",
      "rgba(78, 205, 196, 1)",
      "rgba(244, 157, 26, 1)",
    ];

    // Create consistent colors array for both charts
    const usedBackgrounds = backgroundColors.slice(0, labels.length);
    const usedBorders = borderColors.slice(0, labels.length);

    const revenueData = {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: revenueValues,
          backgroundColor: usedBackgrounds,
          borderColor: usedBorders,
          borderWidth: 1,
        },
      ],
    };

    const guestData = {
      labels,
      datasets: [
        {
          label: "Number of Guests",
          data: guestCountValues,
          backgroundColor: usedBackgrounds,
          borderColor: usedBorders,
          borderWidth: 1,
        },
      ],
    };

    setRevenueChartData(revenueData);
    setGuestChartData(guestData);
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "white",
        },
      },
    },
  };

  const stats = [
    {
      title: "Upcoming Events",
      value: event?.length || "0",
      icon: <FaCalendar className="text-purple-400 text-2xl" />,
    },
    {
      title: "Total Guests",
      value: transaction?.length || "0",
      icon: <FaUsers className="text-blue-400 text-2xl" />,
      trend: "up",
      trendValue: "increase",
    },
    {
      title: "Revenue",
      value: formatCurrency(
        transaction?.reduce((acc, curr) => acc + curr.gross_amount, 0) || "0"
      ),
      icon: <FaMoneyBill className="text-yellow-400 text-2xl" />,
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-start min-h-full bg-gray-900 p-4">
        <div className="space-y-6 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-3xl font-bold">
              Welcome back, {user?.username || "User"}!
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-gray-800 text-white">
                <div className="flex items-center gap-4 p-4">
                  {stat.icon}
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-xl font-semibold">{stat.value}</p>
                    {stat.trend && (
                      <p className="text-green-400 text-sm">
                        ↑ {stat.trendValue}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 text-white">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Guests by Event</h2>
                <div className="h-80">
                  {" "}
                  {guestChartData ? (
                    <Bar data={guestChartData} options={chartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">
                        {transaction.length === 0
                          ? "No transaction data available"
                          : "Loading chart data..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800 text-white">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Revenue by Event</h2>
                <div className="h-80">
                  {" "}
                  {revenueChartData ? (
                    <Pie data={revenueChartData} options={pieChartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">
                        {transaction.length === 0
                          ? "No transaction data available"
                          : "Loading chart data..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-gray-800 text-white">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Recent Activities</h2>
              {event.length === 0 ? (
                <p className="text-gray-400">No recent activities to show.</p>
              ) : (
                <ul className="list-disc list-inside">
                  {event.map((event) => (
                    <li key={event.id} className="text-gray-400">
                      Create {event.name} -{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
