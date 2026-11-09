import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar, Logo } from './UI';

// [함수/컴포넌트 출처]
// useState/useEffect/useRef는 React가 제공한다.
// NavLink/Outlet/useLocation/useNavigate는 react-router-dom이 제공하고, Avatar/Logo는 components/UI.jsx에서 만들었다.
// user/logout은 context/AuthContext.jsx가 공급한다. 현재 logout은 백엔드가 아니라 localStorage의 더미 세션을 지운다.
// 이 컴포넌트는 App.jsx의 Protected 경로 전체를 감싸는 공통 껍데기(사이드바 + 상단바)다.

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menu = useRef(null);

  // 계정 메뉴 바깥을 누르면 열린 메뉴를 닫는다.
  useEffect(() => {
    const close = (event) => open && !menu.current?.contains(event.target) && setOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const exit = () => {
    // exit는 AppLayout에서 만든 함수다. AuthContext의 logout을 실행한 뒤 로그인 주소로 이동한다.
    logout();
    navigate('/login');
  };

  // 현재 주소를 보고 상단 제목을 정한다. 주소가 교실 번호라면 제목은 교실 이름표와 같다.
  const isAdminPage = location.pathname.startsWith('/admin');
  const isProfilePage = location.pathname.startsWith('/profile');
  const pageTitle = isAdminPage ? '사용자 관리' : isProfilePage ? '마이페이지' : '메시지';
  const roleLabel = user.role === 'admin' ? '관리자' : user.role === 'employee' ? '미음 사원' : '고객';

  // Outlet에는 App.jsx에서 현재 주소와 일치한 자식 페이지가 들어온다.
  // 예: /dashboard이면 DashboardPage, /profile이면 ProfilePage가 이 자리에 끼워진다.
  return <div className="app-shell">
    <aside className="sidebar"><div className="sidebar-logo"><Logo light /></div><div className="workspace"><b>M</b><span><strong>Mieum workspace</strong><small>{roleLabel} 워크스페이스</small></span></div><nav><small>WORKSPACE</small><NavLink to="/dashboard">◯ <span>메시지</span></NavLink>{user.role === 'admin' && <NavLink to="/admin/users">▦ <span>사용자 관리</span></NavLink>}<NavLink to="/profile">♙ <span>마이페이지</span></NavLink></nav><div className="sidebar-bottom"><div className="sidebar-note"><i>✦</i><strong>미음을 잇는 대화</strong><p>사원과 고객의 이야기를 한곳에서 이어보세요.</p></div><button type="button" onClick={() => navigate('/profile')}><Avatar user={user} size="sm" /><span><strong>{user.name}</strong><small>{user.role === 'admin' ? '시스템 관리자' : user.role === 'employee' ? user.department : user.company}</small></span><b>›</b></button></div></aside>
    <main className="app-main"><header className="topbar"><div><small>WORKSPACE / {isAdminPage ? 'ADMIN' : isProfilePage ? 'PROFILE' : 'MESSAGES'}</small><h1>{pageTitle}</h1></div><div className="top-actions"><span>오늘도 좋은 하루 보내세요 ✦</span><button className="icon-btn" aria-label="알림">♧</button><div className="account" ref={menu}><button type="button" onClick={() => setOpen(!open)} aria-expanded={open}><Avatar user={user} size="sm" /><span>{user.name}</span>⌄</button>{open && <div className="dropdown"><div><strong>{user.name}</strong><small>{user.email}</small></div><button type="button" onClick={() => navigate('/profile')}>내 정보</button>{user.role === 'admin' && <button type="button" onClick={() => navigate('/admin/users')}>사용자 관리</button>}<button type="button" onClick={exit}>로그아웃</button></div>}</div></div></header><div className="content"><Outlet /></div></main>
    <nav className="mobile-nav"><NavLink to="/dashboard">◯<small>메시지</small></NavLink>{user.role === 'admin' && <NavLink to="/admin/users">▦<small>사용자</small></NavLink>}<NavLink to="/profile">♙<small>내 정보</small></NavLink></nav>
  </div>;
}
