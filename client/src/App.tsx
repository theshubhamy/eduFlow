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
import TimetablePage from "@/app/dashboard/timetable";
import ExamsPage from "@/app/dashboard/exams";
import LibraryPage from "@/app/dashboard/library";
import FeesPage from "@/app/dashboard/fees";
import PaymentsPage from "@/app/dashboard/payments";
import LeavesPage from "@/app/dashboard/leaves";
import NoticesPage from "@/app/dashboard/notices";
import TeamPage from "@/app/dashboard/team";
import SettingsPage from "@/app/dashboard/settings";

import HomePage from "@/app/home/index";
import HomeLayout from "./layout/home-layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
      </Route>
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
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="leaves" element={<LeavesPage />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
