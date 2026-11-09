// [더미 데이터 전용 파일]
// 아래 데이터는 백엔드 DB에서 온 값이 아니다. services/mockApi.js가 브라우저 localStorage에 값이 없을 때 씨앗처럼 넣는다.
// 연결 컴포넌트: 로그인(AuthPages), 대화(DashboardPage/ChatComponents), 관리자 목록(AdminUsersPage), 프로필(ProfilePage).
// 실제 API 전환이 끝나면 화면은 이 배열을 직접 읽지 않고 각 service가 받은 서버 응답을 사용해야 한다.

// 실행한 시점을 기준으로 자연스러운 최근 대화 시간을 만들어 주는 프로젝트 도우미 함수다.
const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

// 실제 서버가 연결되기 전 화면을 체험하기 위한 초기 사용자 데이터다.
export const mockUsers = [
  { id: 'u0', name: '강미음', email: 'admin@mieum.com', password: 'Password1!', role: 'admin', company: 'Mieum', department: '경영지원팀', title: '시스템 관리자', color: 'pink', status: 'active' },
  { id: 'u1', name: '이지안', email: 'employee@mieum.com', password: 'Password1!', role: 'employee', company: 'Mieum', department: '프로덕트팀', title: '프로덕트 매니저', color: 'pink', status: 'active' },
  { id: 'u2', name: '김도윤', email: 'doyun@mieum.com', password: 'Password1!', role: 'employee', company: 'Mieum', department: '디자인팀', title: '프로덕트 디자이너', color: 'purple', status: 'active' },
  { id: 'u3', name: '박서연', email: 'seoyeon@mieum.com', password: 'Password1!', role: 'employee', company: 'Mieum', department: '고객성공팀', title: '고객 성공 매니저', color: 'mint', status: 'active' },
  { id: 'u4', name: '정하린', email: 'customer@example.com', password: 'Password1!', role: 'customer', company: '온리브', department: '', title: '브랜드 매니저', color: 'peach', status: 'active' },
  { id: 'u5', name: '최민준', email: 'minjun@example.com', password: 'Password1!', role: 'customer', company: '스튜디오 모먼트', department: '', title: '대표', color: 'blue', status: 'active' },
  { id: 'u6', name: '윤태호', email: 'taeho@mieum.com', password: 'Password1!', role: 'employee', company: 'Mieum', department: '개발팀', title: '프론트엔드 개발자', color: 'blue', status: 'active' },
];

// 사용자의 브라우저에 저장된 대화가 없을 때 처음 보여 줄 대화 목록이다.
export const mockConversations = [
  { id: 'c1', title: '웹사이트 리뉴얼 프로젝트', type: 'internal', status: 'open', participants: ['u1', 'u2', 'u6'], updatedAt: ago(4), lastMessage: '시안 최종본 확인했습니다. 정말 좋아요!', unread: 2, pinned: true },
  { id: 'c2', title: '온리브 · 브랜드 페이지 문의', type: 'customer', status: 'open', participants: ['u1', 'u4'], updatedAt: ago(28), lastMessage: '공유해주신 자료 확인 후 연락드릴게요.', unread: 1, pinned: false },
  { id: 'c3', title: '이번 주 프로덕트 스탠드업', type: 'internal', status: 'open', participants: ['u1', 'u2', 'u3'], updatedAt: ago(75), lastMessage: '오늘 오후 3시에 짧게 모일까요?', unread: 0, pinned: false },
  { id: 'c4', title: '스튜디오 모먼트 · 도입 상담', type: 'customer', status: 'open', participants: ['u1', 'u5'], updatedAt: ago(180), lastMessage: '네, 일정 확인해서 알려드리겠습니다.', unread: 0, pinned: false },
  { id: 'c5', title: '디자인 시스템', type: 'internal', status: 'open', participants: ['u1', 'u2'], updatedAt: ago(360), lastMessage: '새 버튼 컴포넌트 적용해두었습니다.', unread: 0, pinned: false },
  { id: 'c6', title: '온리브 · 첫 상담', type: 'customer', status: 'closed', participants: ['u1', 'u4'], updatedAt: ago(2900), lastMessage: '도움 주셔서 감사합니다!', unread: 0, pinned: false },
  { id: 'c7', title: '월간 회고', type: 'internal', status: 'open', participants: ['u1', 'u2', 'u3', 'u6'], updatedAt: ago(5200), lastMessage: '좋았던 점 하나씩 남겨주세요.', unread: 0, pinned: false },
];

// 각 메시지는 conversationId로 자신이 들어갈 대화방을 찾는다.
export const mockMessages = [
  { id: 'm1', conversationId: 'c1', senderId: 'u2', text: '안녕하세요! 이번 리뉴얼 첫 화면 시안을 공유합니다. 전체 흐름을 중심으로 봐주세요.', createdAt: ago(190) },
  { id: 'm2', conversationId: 'c1', senderId: 'u1', text: '좋아요. 여백이 넉넉해서 중요한 내용이 잘 보이네요.', createdAt: ago(160) },
  { id: 'm3', conversationId: 'c1', senderId: 'u6', text: '개발 관점에서도 구성하기 편할 것 같습니다. 모바일 화면도 확인할게요.', createdAt: ago(110) },
  { id: 'm4', conversationId: 'c1', senderId: 'u2', text: '모바일 버전까지 정리해서 방금 업데이트했습니다 ✨', createdAt: ago(65) },
  { id: 'm5', conversationId: 'c1', senderId: 'u1', text: '확인했습니다. 고객 대화 영역은 핑크를 조금만 쓰면 더 차분할 것 같아요.', createdAt: ago(42) },
  { id: 'm6', conversationId: 'c1', senderId: 'u2', text: '피드백 반영해볼게요!', createdAt: ago(23) },
  { id: 'm7', conversationId: 'c1', senderId: 'u6', text: '시안 최종본 확인했습니다. 정말 좋아요!', createdAt: ago(4) },
  { id: 'm8', conversationId: 'c2', senderId: 'u4', text: '안녕하세요. 브랜드 페이지 구성에 대해 문의드리고 싶어요.', createdAt: ago(90) },
  { id: 'm9', conversationId: 'c2', senderId: 'u1', text: '안녕하세요, 하린님! 어떤 부분이 궁금하신가요?', createdAt: ago(70) },
  { id: 'm10', conversationId: 'c2', senderId: 'u4', text: '메인 비주얼 이미지 규격을 알고 싶어요.', createdAt: ago(48) },
  { id: 'm11', conversationId: 'c2', senderId: 'u1', text: '공유해주신 자료 확인 후 연락드릴게요.', createdAt: ago(28) },
  ...mockConversations.slice(2).map((conversation, index) => ({ id: `seed-${index}`, conversationId: conversation.id, senderId: conversation.participants[1], text: conversation.lastMessage, createdAt: conversation.updatedAt })),
];
