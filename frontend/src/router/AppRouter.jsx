import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import WatchVideo from "../pages/WatchVideo";
import UploadVideo from "../pages/UploadVideo";
import CreateChannel from "../pages/CreateChannel";
import UserProfile from "../pages/UserProfile";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Home />} />
        <Route path="watch/:id" element={<WatchVideo />} />
        <Route
          path="upload"
          element={
            <ProtectedRoute>
              <UploadVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="channel/create"
          element={
            <ProtectedRoute>
              <CreateChannel />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;

