import React from "react";
import AppRouter from "./routes/AppRouter";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <AppRouter />
      {/* <ThemeProvider>
      </ThemeProvider> */}
    </BrowserRouter>
  );
}

export default App;
