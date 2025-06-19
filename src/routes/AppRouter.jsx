import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import MainLayout from "../pages/MainLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import CategoryPage from "../pages/CategoryPage";
import EventPage from "../pages/EventPage";
import DetailEventPage from "../pages/DetailEventPage";
import TransactionPage from "../pages/TransactionPage";
import EventListPage from "../pages/EventListPage";
import ProfilePage from "../pages/ProfilePage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login/*" element={<LoginPage />} />

      <Route path="/register/*" element={<RegisterPage />} />

      <Route
        path="/admin"
        element={
          <SignedIn>
            <MainLayout />
          </SignedIn>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="event" element={<EventPage />} />
        <Route path="event/:eventId" element={<DetailEventPage />} />
        <Route path="transaction" element={<TransactionPage />} />
        <Route path="event-list" element={<EventListPage />} />
        <Route path="/admin/profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="*"
        element={
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        }
      />
    </Routes>
  );
};

export default AppRouter;
