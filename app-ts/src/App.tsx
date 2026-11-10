import { Routes, Route } from "react-router";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import Templates from "@/pages/Templates";
import MyResumes from "@/pages/MyResumes";
import AdminUsers from "@/pages/AdminUsers";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          {/* 公开页面 */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* 需要登录的页面 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/my-resumes" element={<MyResumes />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}