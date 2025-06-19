import { useState, useEffect } from "react";
import axiosInstance from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import { Pagination, Input } from "@heroui/react";
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import Card from "../components/elements/Card";

const EventListPage = () => {
  const { getToken } = useAuth();
  const axios = axiosInstance(getToken);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [transaction, setTransaction] = useState([]);
  const itemsPerPage = 6;
  const [statusFilter, setStatusFilter] = useState("all");

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
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.statusEvent === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const displayedEventList = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, transactionsRes] = await Promise.all([
          axios.get("/event"),
          axios.get("/transaction"),
        ]);
        setEvents(eventsRes.data || []);
        setTransaction(transactionsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusStyles = {
      planning: "bg-yellow-500 text-white",
      "in progress": "bg-blue-500 text-white",
      completed: "bg-green-500 text-white",
      cancelled: "bg-red-500 text-white",
      default: "bg-gray-500 text-white",
    };

    const style = statusStyles[status.toLowerCase()] || statusStyles.default;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${style}`}>
        {status}
      </span>
    );
  };

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Event List</h1>
          <div className="w-1/3">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 text-white"
              clearable
            />
          </div>
          <div>
            <select
              className="bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="close">Close</option>
              <option value="comingsoon">Coming Soon</option>
            </select>
          </div>
        </div>

        {displayedEventList.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-xl mb-4">No events found</p>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {displayedEventList.map((event) => (
              <Card
                key={event.id}
                className="bg-gray-900 hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1"
                isHoverable
                elevation="medium"
              >
                <div className="p-0">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {event.name}
                    </h3>
                    {getStatusBadge(event.statusEvent || "planning")}
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {event.description || "No description provided"}
                  </p>

                  <div className="flex items-center mb-2 text-gray-400">
                    <FaCalendarAlt className="mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>

                  <div className="flex items-center mb-2 text-gray-400">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{event.location || "Venue TBD"}</span>
                  </div>

                  <div className="flex justify-between mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center text-gray-300">
                      <FaTicketAlt className="mr-2" />
                      <span>
                        <span className="font-bold">
                          {transaction.filter(
                            (t) => t.event?.name === event.name
                          ).length || 0}
                          /
                          {event.qty -
                            transaction.filter(
                              (t) => t.event?.name === event.name
                            ).length || 100}
                        </span>{" "}
                        tickets sold
                      </span>
                    </div>

                    <div className="text-blue-400 font-bold">
                      Price: {formatCurrency(event.price || 0)}
                    </div>
                  </div>

                  <div className="text-right text-gray-400 mt-2">
                    Revenue:{" "}
                    {formatCurrency(
                      (event.price || 0) *
                        transaction.filter((t) => t.event?.name === event.name)
                          .length || 0
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredEvents.length > itemsPerPage && (
          <div className="flex justify-center mt-8">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              size="lg"
              current={currentPage}
              total={totalPages}
              onChange={handlePageChange}
              className="bg-gray-700"
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default EventListPage;
