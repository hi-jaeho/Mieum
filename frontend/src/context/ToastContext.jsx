import { createContext, useContext, useEffect, useState } from 'react';

// [라이브러리가 정해 둔 함수]
// useEffect와 useState는 React 함수이고, setTimeout/clearTimeout은 브라우저가 제공하는 함수다.
// 이 파일은 서버 데이터와 무관한 '잠깐 나타나는 안내문'만 관리한다.
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  // 새 알림이 나타날 때마다 타이머를 새로 시작하고 3.2초 뒤 자동으로 닫는다.
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider
      // showToast는 여기서 정의되어 useToast()를 통해 다른 컴포넌트로 전달되는 프로젝트 함수다.
      // 예: pages/ProfilePage.jsx, pages/AdminUsersPage.jsx, pages/DashboardPage.jsx에서 호출한다.
      value={{ showToast: (message, type = 'success') => setToast({ message, type, id: Date.now() }) }}
    >
      {children}
      {toast && (
        <div className={`toast ${toast.type}`} role="status">
          <span>{toast.type === 'error' ? '!' : '✓'}</span>
          {toast.message}
          <button type="button" aria-label="알림 닫기" onClick={() => setToast(null)}>×</button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

// 저장 완료 같은 짧은 알림을 어느 화면에서나 띄울 수 있게 한다.
export const useToast = () => useContext(ToastContext);
