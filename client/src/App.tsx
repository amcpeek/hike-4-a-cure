import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Home } from "./pages/Home/Home";
import { Fundraisers } from "./pages/Fundraisers/Fundraisers";
import { SectionsAdmin } from "./pages/Admin/Sections/SectionsAdmin";
import { FundraisersAdmin } from "./pages/Admin/Fundraisers/FundraisersAdmin";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="fundraisers" element={<Fundraisers />} />
        <Route
          path="admin/sections"
          element={
            <ProtectedRoute>
              <SectionsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/fundraisers"
          element={
            <ProtectedRoute>
              <FundraisersAdmin />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
