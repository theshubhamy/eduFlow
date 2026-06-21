import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/app/auth/login";
import RegisterPage from "@/app/auth/register";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/layout/dashboard-layout";
import DashboardOverview from "@/app/dashboard/overview";
import ClassesPage from "@/app/dashboard/classes";
import SubjectsPage from "@/app/dashboard/subjects";
import StudentsPage from "@/app/dashboard/students";
import AttendancePage from "@/app/dashboard/attendance";
import FeesPage from "@/app/dashboard/fees";
import PaymentsPage from "@/app/dashboard/payments";
import TeamPage from "@/app/dashboard/team";
import SettingsPage from "@/app/dashboard/settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
