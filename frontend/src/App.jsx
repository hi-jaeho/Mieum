import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import { LoginPage } from "./pages/AuthPages";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminUsersPage from "./pages/AdminUsersPage";

// [라이브러리가 정해 둔 컴포넌트]
// Routes/Route는 react-router-dom의 주소표이고, Navigate는 사용자를 다른 주소로 보내는 표지판이다.
// [프로젝트 함수] useAuth는 context/AuthContext.jsx에서 만든 훅으로 현재 로그인 사용자를 꺼낸다.

// 로그인한 사용자만 아래 중첩 경로로 들어가게 하는 문지기 역할을 한다.
function Protected() {
  const { user } = useAuth();
  return user ? <AppLayout /> : <Navigate to="/login" replace />;
}

// 관리자 화면은 로그인 여부뿐 아니라 role까지 한 번 더 확인한다.
function AdminOnly() {
  const { user } = useAuth();
  return user?.role === "admin" ? (
    <AdminUsersPage />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

export default function App() {
  return (
    <Routes>
      {/* 누구나 볼 수 있는 공개 화면 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected를 통과한 자식 화면은 components/AppLayout.jsx의 <Outlet /> 자리에 들어간다. */}
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/chats/:id" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/users" element={<AdminOnly />} />
      </Route>

      {/* 앞의 어떤 주소와도 맞지 않으면 404 화면을 보여 준다. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
