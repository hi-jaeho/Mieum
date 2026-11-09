import { mockConversations, mockMessages, mockUsers } from '../data/mockData';

// [중요: 이 파일은 진짜 백엔드 API가 아니다]
// 화면이 호출하는 모양만 API처럼 만들어 둔 연습용 서비스다.
// 데이터는 data/mockData.js에서 시작해 브라우저 localStorage에 저장된다.
// 나중에는 authApi/chatApi/adminApi의 각 메서드 안을 fetch 호출로 교체하는 방식으로 서버를 연결할 수 있다.
const STORAGE = { users: 'mieum.users', conversations: 'mieum.conversations', messages: 'mieum.messages', session: 'mieum.session' };

// Promise와 setTimeout은 JavaScript/브라우저가 제공하는 기능이다.
// 실제 서버 통신처럼 잠깐 기다리게 해 로딩 화면도 확인할 수 있게 한다.
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// JSON.parse/stringify, localStorage도 브라우저가 제공한다. read/write/getUsers/safeUser는 이 파일에서 만든 함수다.
// localStorage가 비었거나 깨졌다면 준비된 목 데이터를 안전망처럼 사용한다.
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(STORAGE[key])) || fallback; } catch { return fallback; }
};
const write = (key, value) => { localStorage.setItem(STORAGE[key], JSON.stringify(value)); return value; };

// 화면으로 돌려주는 사용자 정보에서는 비밀번호를 빼낸다.
const safeUser = ({ password: _password, ...user }) => user;

const getUsers = () => {
  const saved = read('users', mockUsers);
  // 목 데이터에 계정이 새로 추가되어도 기존 브라우저 저장값 때문에 사라지지 않게 합친다.
  const missingSeeds = mockUsers.filter((seed) => !saved.some((user) => user.id === seed.id));
  return [...saved, ...missingSeeds];
};

// 인증 서버 대신 브라우저 저장소로 로그인과 프로필 변경을 흉내 낸다.
export const authApi = {
  // 사용 컴포넌트: context/AuthContext.jsx → AuthPages/ProfilePage/AppLayout로 이어진다.
  current() {
    const session = read('session', null);
    const user = getUsers().find((item) => item.id === session?.userId);
    return user ? safeUser(user) : null;
  },
  async login({ email, password }) {
    await delay();
    const user = getUsers().find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password && item.status !== 'inactive');
    if (!user) throw new Error('이메일 또는 비밀번호를 다시 확인해 주세요.');
    write('session', { userId: user.id });
    return safeUser(user);
  },
  async update(userId, values) {
    await delay(220);
    const users = getUsers();
    let updated;
    write('users', users.map((item) => item.id === userId ? (updated = { ...item, ...values }) : item));
    return safeUser(updated);
  },
  logout() { localStorage.removeItem(STORAGE.session); },
};

// 대화 목록, 메시지 전송, 대화방 생성을 담당하는 가짜 API다.
export const chatApi = {
  // 사용 컴포넌트: pages/DashboardPage.jsx와 components/ChatComponents.jsx.
  // list/room/messages/send/create 모두 현재 서버가 아닌 localStorage를 읽고 쓴다.
  async users() { await delay(150); return getUsers().filter((user) => user.status !== 'inactive').map(safeUser); },
  async list({ userId, role, search = '', filter = 'all', page = 1, size = 5 }) {
    await delay();
    const query = search.trim().toLowerCase();
    const isStaff = role === 'employee' || role === 'admin';
    // 큰 바구니에서 '내 대화 → 선택 필터 → 검색어' 순서로 필요한 것만 골라낸다.
    const all = read('conversations', mockConversations)
      .filter((item) => item.participants.includes(userId))
      .filter((item) => filter === 'all' || (isStaff ? item.type === filter : item.status === filter))
      .filter((item) => !query || item.title.toLowerCase().includes(query))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.updatedAt) - new Date(a.updatedAt));
    const pages = Math.max(1, Math.ceil(all.length / size));
    // 검색 결과가 줄어 현재 페이지가 범위를 벗어나면 마지막 페이지로 맞춘다.
    const current = Math.min(page, pages);
    return { items: all.slice((current - 1) * size, current * size), total: all.length, page: current, pages };
  },
  async room(id, userId) {
    await delay(180);
    const room = read('conversations', mockConversations).find((item) => item.id === id && item.participants.includes(userId));
    if (!room) throw new Error('대화를 찾을 수 없습니다.');
    return room;
  },
  async messages(id) { await delay(200); return read('messages', mockMessages).filter((item) => item.conversationId === id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); },
  async send({ conversationId, senderId, text }) {
    await delay(180);
    const message = { id: `m-${Date.now()}`, conversationId, senderId, text: text.trim(), createdAt: new Date().toISOString() };
    write('messages', [...read('messages', mockMessages), message]);
    // 메시지를 보내면 대화 목록의 미리보기와 최근 시간도 함께 갱신한다.
    write('conversations', read('conversations', mockConversations).map((item) => item.id === conversationId ? { ...item, lastMessage: message.text, updatedAt: message.createdAt, unread: 0 } : item));
    return message;
  },
  async create({ creator, participant, title }) {
    await delay(240);
    const room = { id: `c-${Date.now()}`, title: title.trim(), type: creator.role !== 'customer' && participant.role !== 'customer' ? 'internal' : 'customer', status: 'open', participants: [creator.id, participant.id], updatedAt: new Date().toISOString(), lastMessage: '새 대화가 시작되었습니다.', unread: 0, pinned: false };
    write('conversations', [room, ...read('conversations', mockConversations)]);
    return room;
  },
};

// 관리자 권한이 필요한 사용자 조회와 계정 발급을 흉내 낸다.
export const adminApi = {
  // 사용 컴포넌트: pages/AdminUsersPage.jsx의 사용자 목록.
  // 주의: 같은 화면의 사원 등록은 employeeApi로 실제 서버에 보내지만, 목록은 여전히 이 더미 저장소를 읽는다.
  async listUsers({ requester, search = '', filter = 'all', page = 1, size = 6 }) {
    await delay(260);
    if (requester.role !== 'admin') throw new Error('관리자만 사용자 목록을 확인할 수 있습니다.');
    const query = search.trim().toLowerCase();
    const members = getUsers()
      .filter((user) => user.role !== 'admin')
      .filter((user) => filter === 'all' || user.role === filter)
      .filter((user) => !query || `${user.name} ${user.email} ${user.company} ${user.department}`.toLowerCase().includes(query));
    const pages = Math.max(1, Math.ceil(members.length / size));
    const current = Math.min(page, pages);
    return { items: members.slice((current - 1) * size, current * size).map(safeUser), total: members.length, page: current, pages };
  },
  async createUser({ requester, values }) {
    await delay(300);
    if (requester.role !== 'admin') throw new Error('관리자만 계정을 생성할 수 있습니다.');
    const users = getUsers();
    if (users.some((user) => user.email.toLowerCase() === values.email.trim().toLowerCase())) throw new Error('이미 사용 중인 이메일입니다.');
    // 역할에 따라 회사와 부서의 기본값을 다르게 조립한다.
    const user = {
      id: `u-${Date.now()}`,
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      role: values.role,
      company: values.role === 'employee' ? 'Mieum' : values.company.trim(),
      department: values.role === 'employee' ? values.department.trim() : '',
      title: values.title.trim(),
      color: values.role === 'employee' ? 'purple' : 'peach',
      status: 'active',
    };
    write('users', [...users, user]);
    return safeUser(user);
  },
};
