import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import "./styles/global.css";
import "./styles/pages.css";

// [라이브러리가 정해 둔 함수]
// createRoot와 render는 React가 제공한다. HTML의 #root라는 빈 상자에 App 화면을 끼워 넣는 시작점이다.
// BrowserRouter도 react-router-dom이 제공하며, 현재 URL을 보고 어떤 페이지를 보여 줄지 관리한다.
//
// [이 프로젝트에서 만든 컴포넌트]
// AuthProvider: context/AuthContext.jsx에서 정의한 로그인 정보 공급자
// ToastProvider: context/ToastContext.jsx에서 정의한 알림 공급자
// App: App.jsx에서 정의한 전체 주소표(라우팅) 컴포넌트
// 앱 전체에서 라우터, 로그인 정보, 알림을 사용할 수 있도록 가장 바깥에서 감싼다.
// 도시 전체에 수도관을 먼저 깔아 두면 각 집에서 물을 쓸 수 있는 것과 같은 구조다.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
