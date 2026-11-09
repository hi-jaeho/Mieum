import { createContext, useContext, useState } from 'react';
import { authApi } from '../services/mockApi';

// [라이브러리가 정해 둔 함수]
// createContext/useContext/useState는 React가 제공한다. Context는 여러 방이 함께 쓰는 공용 사물함과 비슷하다.
// [백엔드 연결 현황]
// authApi는 이름과 달리 현재 서버가 아니라 services/mockApi.js의 localStorage를 사용한다.
// 실제 로그인 API로 전환할 때는 authApi의 내부 구현을 fetch 기반으로 바꾸면 이 Context를 쓰는 화면은 그대로 둘 수 있다.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 첫 렌더링에서 localStorage의 세션을 읽어 새로고침 뒤에도 로그인을 유지한다.
  const [user, setUser] = useState(() => authApi.current());

  // API 결과와 화면의 사용자 상태를 항상 같은 값으로 맞춘다.
  const login = async (values) => {
    // 이 login은 AuthProvider에서 직접 정의한 프로젝트 함수다.
    // pages/AuthPages.jsx의 LoginPage가 useAuth()로 받아 호출한다.
    const next = await authApi.login(values);
    setUser(next);
    return next;
  };

  const updateProfile = async (values) => {
    // pages/ProfilePage.jsx가 호출한다. 현재는 브라우저 저장소만 바뀌며 백엔드 DB에는 반영되지 않는다.
    const next = await authApi.update(user.id, values);
    setUser(next);
  };

  const logout = () => {
    // 현재는 localStorage의 가짜 세션만 지운다. JWT 연결 후에는 저장한 토큰도 함께 제거해야 한다.
    authApi.logout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, updateProfile, logout }}>{children}</AuthContext.Provider>;
}

// 여러 화면이 로그인 정보를 직접 전달받지 않고도 꺼내 쓰게 하는 전용 훅이다.
export const useAuth = () => useContext(AuthContext);
