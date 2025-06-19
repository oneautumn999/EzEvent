// import { Navigate } from "react-router-dom";
// import SpinnerLoading from "../components/elements/SpinnerLoading";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { accessToken, isLoading } = useAuth();

//   if (isLoading) return <SpinnerLoading />; // Tunggu sampai cek token selesai
//   return accessToken ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;