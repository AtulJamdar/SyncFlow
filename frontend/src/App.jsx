import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import LandingPage from './pages/public/LandingPage';
import AdminDashboard from './pages/dashboard/Admin/AdminDashboard';
import ManagerDashboard from './pages/dashboard/Manager/ManagerDashboard';
import AccountantDashboard from './pages/dashboard/Accountant/AccountantDashboard';
import UserDashboard from './pages/dashboard/User/UserDashboard';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MyProjects from './pages/dashboard/User/MyProjects';
import ManageClients from './pages/dashboard/Admin/ManageClients';
import ManageProjects from './pages/dashboard/Admin/ManageProjects';
import ManageTeams from './pages/dashboard/Admin/ManageTeams';
import ManageUsers from './pages/dashboard/Admin/ManageUsers';
import ManageInvoices from './pages/dashboard/Admin/ManageInvoices';
import AnalyticsDashboard from './pages/dashboard/Admin/AnalyticsDashboard';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import { useAuthStore } from './store/useAuthStore'; // assuming you have this

// Default redirection after login
const DashboardRedirect = () => {
    const { user } = useAuthStore();
    switch (user?.role) {
        case 'admin':
        case 'owner':
            return <Navigate to="/dashboard/admin" />;
        case 'manager':
            return <Navigate to="/dashboard/manager" />;
        case 'accountant':
            return <Navigate to="/dashboard/accountant" />;
        case 'user':
            return <Navigate to="/dashboard/user" />;
        default:
            return <Navigate to="/login" />;
    }
};

function App() {
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const eventSource = new EventSource(
            `https://syncflow-backend-cbau.onrender.com/api/events?token=${token}`
        );

        eventSource.onmessage = (event) => {
            console.log("SSE message:", event.data);
            // You can also update state/store here to push live events
        };

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close(); // cleanup on unmount
        };
    }, []);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute />}>
                {/* Protected Routes */}
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/manager" element={<ManagerDashboard />} />
                <Route path="/dashboard/accountant" element={<AccountantDashboard />} />
                <Route path="/dashboard/user" element={<UserDashboard />} />
                <Route path="/dashboard/my-projects" element={<MyProjects />} />
                <Route path="/dashboard/clients" element={<ManageClients />} />
                <Route path="/dashboard/projects" element={<ManageProjects />} />
                <Route path="/dashboard/invoices" element={<ManageInvoices />} />
                <Route path="/dashboard/teams" element={<ManageTeams />} />
                <Route path="/dashboard/users" element={<ManageUsers />} />
                <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} />
            </Route>
        </Routes>
    );
}

export default App;
