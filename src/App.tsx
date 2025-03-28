
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Properties from "./pages/admin/Properties";
import PropertyDetails from "./pages/admin/PropertyDetails";
import PropertyEdit from "./pages/admin/PropertyEdit";
import Bookings from "./pages/admin/Bookings";
import Reports from "./pages/admin/Reports";

// User Pages
import UserDashboard from "./pages/user/Dashboard";

// Public Pages
import PropertyPublicPage from "./components/property/PropertyPublicPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/properties/:id" element={<PropertyPublicPage />} />
              
              {/* Redirect from root to appropriate dashboard */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/properties" element={<Properties />} />
              <Route path="/admin/properties/:id" element={<PropertyDetails />} />
              <Route path="/admin/properties/:id/edit" element={<PropertyEdit />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/reports" element={<Reports />} />

              {/* User Routes */}
              <Route path="/user" element={<UserDashboard />} />
              
              {/* Add routes for other user pages when they are created */}
              <Route path="/user/calendar" element={<UserDashboard />} />
              <Route path="/user/pricing" element={<UserDashboard />} />
              <Route path="/user/availability" element={<UserDashboard />} />
              <Route path="/user/property" element={<UserDashboard />} />
              <Route path="/user/reports" element={<UserDashboard />} />
              <Route path="/user/channels" element={<UserDashboard />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
